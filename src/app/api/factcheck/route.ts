import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { verifyRumorWithBrightData, scrapeSocialSignals } from '@/lib/brightData';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// ── ArcGIS Open Data endpoints ────────────────────────────────────────────────
const ARC_311 = 'https://opendata.arcgis.com/datasets/0e3b97b1a13e4b70a0e28e6c70eb8201_0.geojson';
// Montgomery CAD 911 active incidents (public endpoint)
const ARC_911 = 'https://opendata.arcgis.com/datasets/4b2bc44e96de4571a5bbc3cab9f21eca_0.geojson';

// Category → keyword map (used to filter 311/911 data)
const CAT_KEYWORDS: Record<string, string[]> = {
  sinkhole:     ['sinkhole','sink hole','hole','cave','collapse'],
  'water main': ['water main','water line','watermain','leak','burst pipe','flood'],
  outage:       ['outage','power out','power line','electric','apc','lights out'],
  'road closure':['closure','closed','road closed','blocked','pavement','pothole','pave'],
};

// ── Mock fallback for when ArcGIS is down ───────────────────────────────────
const MOCK_311 = [
  { type:'Road Obstruction', location:'Dexter Ave',     status:'Action Taken', description:'Pothole repair near Capitol.' },
  { type:'Utility Outage',   location:'South Perry St', status:'Investigating', description:'Water pressure low.' },
  { type:'Traffic Signal',   location:'Ann St',          status:'Assigned',     description:'Lights out in all directions.' },
  { type:'Sinkhole Report',  location:'Mobile Hwy',      status:'Open',         description:'Resident-reported sinkhole, crew dispatched.' },
];
const MOCK_911 = [
  { type:'Fire',    location:'1240 Mobile Hwy',      status:'ACTIVE', description:'Structure fire — 3 units dispatched.' },
  { type:'Medical', location:'Oak Park Drive',        status:'ACTIVE', description:'Medical emergency — 1 unit en route.' },
  { type:'Traffic', location:'I-85 N @ Exit 6',      status:'ACTIVE', description:'Multi-vehicle accident.' },
];

// ── Fetch ArcGIS 311 with timeout ────────────────────────────────────────────
async function fetch311() {
  try {
    const res = await fetch(ARC_311, { signal: AbortSignal.timeout(4000) });
    const raw = await res.json();
    if (raw?.features?.length) {
      return raw.features.slice(0, 60).map((f: any) => ({
        type: f.properties.Issue_Type || f.properties.RequestType || 'Unknown',
        location: f.properties.Location || f.properties.Street || '',
        status: f.properties.Status || f.properties.Resolution || '',
        description: f.properties.Description || '',
      }));
    }
  } catch { /* fallthrough */ }
  console.warn('[factcheck] ArcGIS 311 unavailable — using mock');
  return MOCK_311;
}

// ── Fetch ArcGIS 911 with timeout ────────────────────────────────────────────
async function fetch911() {
  try {
    const res = await fetch(ARC_911, { signal: AbortSignal.timeout(4000) });
    const raw = await res.json();
    if (raw?.features?.length) {
      return raw.features.slice(0, 40).map((f: any) => ({
        type: f.properties.IncidentType || f.properties.Nature || 'Unknown',
        location: f.properties.Address || f.properties.Location || '',
        status: f.properties.Status || 'ACTIVE',
        description: f.properties.Notes || f.properties.Comment || '',
      }));
    }
  } catch { /* fallthrough */ }
  console.warn('[factcheck] ArcGIS 911 unavailable — using mock');
  return MOCK_911;
}

// ── Filter records by category keywords ─────────────────────────────────────
function filterByCategory(records: any[], category: string | undefined) {
  if (!category) return records;
  const words = CAT_KEYWORDS[category.toLowerCase()] || [category.toLowerCase()];
  return records.filter(r =>
    words.some(w =>
      (r.type        || '').toLowerCase().includes(w) ||
      (r.description || '').toLowerCase().includes(w) ||
      (r.location    || '').toLowerCase().includes(w)
    )
  );
}

// ── POST /api/factcheck ──────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      rumor         = '',
      activeSources = ['twitter','reddit','facebook','nextdoor','311','911'],
      category      = '',     // optional preset chip
    } = body;

    if (!rumor.trim()) {
      return NextResponse.json({ error: 'Rumor text required.' }, { status: 400 });
    }

    // ── Fetch only the sources that are toggled on ───────────────────────────
    const fetchingCivic   = activeSources.includes('311') || activeSources.includes('911');
    const fetchingSocial  = ['twitter','reddit','facebook','nextdoor'].some(s => activeSources.includes(s));

    const [data311, data911, brightDataSnippet] = await Promise.all([
      activeSources.includes('311')      ? fetch311()                        : Promise.resolve(null),
      activeSources.includes('911')      ? fetch911()                        : Promise.resolve(null),
      fetchingSocial                     ? verifyRumorWithBrightData(rumor)  : Promise.resolve('Social sources not selected.'),
    ]);

    // Filter 311/911 by category if a chip was used
    const filtered311 = data311 ? filterByCategory(data311, category) : null;
    const filtered911 = data911 ? filterByCategory(data911, category) : null;

    // Also scrape targeted social signals per active social source
    const socialSignals = fetchingSocial
      ? await scrapeSocialSignals(rumor, activeSources.filter((s: string) => ['twitter','reddit','facebook','nextdoor'].includes(s)))
      : { volume: 0, sentiment: 'neutral', snippets: [] };

    // ── Build Gemini prompt ─────────────────────────────────────────────────
    const activeSourceNames = activeSources.map((s: string) =>
      s === '311' ? '311 Service Requests' :
      s === '911' ? '911 CAD Logs' :
      s.charAt(0).toUpperCase() + s.slice(1)
    ).join(', ');

    const evidenceParts: string[] = [];
    if (filtered311) evidenceParts.push(`## Montgomery 311 Service Requests (${filtered311.length} records)\n${JSON.stringify(filtered311.slice(0, 20))}`);
    if (filtered911) evidenceParts.push(`## Montgomery 911 CAD Logs (${filtered911.length} incidents)\n${JSON.stringify(filtered911.slice(0, 15))}`);
    if (fetchingSocial) {
      evidenceParts.push(`## Bright Data Social Signals\nSentiment: ${socialSignals.sentiment}\nVolume: ${socialSignals.volume} mentions\nSnippets: ${socialSignals.snippets.slice(0,5).join(' | ')}\nWeb corroboration: ${brightDataSnippet}`);
    }

    const prompt = `You are GumpWiser — the civic intelligence engine for Montgomery, Alabama.
Analyze the following rumor using ONLY the data sources provided (${activeSourceNames}).

## The Rumor
"${rumor}"
${category ? `Category hint: ${category}\n` : ''}

${evidenceParts.join('\n\n')}

## Your Task
1. Cross-reference the rumor text against each evidence source above.
2. If 311 data is provided: look for open tickets, dispatched crew, or confirmed reports matching the location/type. CRITICAL INSTRUCTION: Map the 'description' field from the 311 JSON to the rumor verification logic to check for semantic matches with the claimed event.
3. If 911 data is provided: look for active incidents matching the claimed event.
4. If social data is provided: assess sentiment volume and whether social mentions align with the rumor.
5. Produce a Gump-Score™ (0–100) where:
   - 70–100 = Verified (strong official record match)
   - 35–69  = Caution (partial or indirect evidence)
   - 0–34   = Alert/Misinformation (no corroboration, or contradicted by official data)
   - **CRITICAL**: If the rumor text is clearly gibberish (e.g., "ggrefger", "asdasd"), random letters, or too short to be a real claim, you MUST score it below 15 (Misinformation) and state that it is an invalid or unreadable claim.
6. Return a concise, citizen-readable "message" explaining your reasoning in plain English.
7. Return "dataSource" — which data source(s) actually matched (e.g. "311 Service Request #10234, 911 CAD Log").
`;

    try {
      const model  = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              status:     { type: SchemaType.STRING },   // 'verified' | 'caution' | 'misinformation'
              score:      { type: SchemaType.INTEGER },
              title:      { type: SchemaType.STRING },
              message:    { type: SchemaType.STRING },
              dataSource: { type: SchemaType.STRING },
              socialVol:  { type: SchemaType.INTEGER },
            },
            required: ['status', 'score', 'title', 'message', 'dataSource'],
          },
          temperature: 0.1,
        },
      });

      const text = result.response.text();
      if (text) {
        const parsed = JSON.parse(text);
        return NextResponse.json({
          ...parsed,
          activeSources,
          socialSignals,
          record311Count: filtered311?.length ?? 0,
          record911Count: filtered911?.length ?? 0,
        });
      }
      throw new Error('Empty Gemini response');

    } catch (apiErr) {
      console.warn('[factcheck] Gemini call failed — heuristic fallback', apiErr);
      return NextResponse.json(heuristicFallback(rumor, filtered311, filtered911, socialSignals, activeSources));
    }

  } catch (err) {
    console.error('[factcheck] Critical error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// ── Heuristic fallback (guaranteed result even if Gemini quota exceeded) ──────
function heuristicFallback(rumor: string, data311: any, data911: any, social: any, activeSources: string[]) {
  const lower = rumor.toLowerCase().trim();
  
  // Detect gibberish (no spaces in a long string, or very short and no vowels, or repeated chars)
  const isGibberish = lower.length < 5 || (lower.length > 5 && !lower.includes(' ')) || /([a-z])\1{3,}/.test(lower);

  if (isGibberish) {
    return {
      status: 'misinformation',
      score: 12,
      title: 'Invalid Input',
      message: 'The text provided does not appear to be a valid or readable civic claim. No analysis possible.',
      dataSource: 'Input Validation',
      activeSources,
      socialSignals: { volume: 0, sentiment: 'neutral', snippets: [] },
      record311Count: 0,
      record911Count: 0,
    };
  }

  const hasCivicMatch = [
    ...(data311 || []),
    ...(data911 || []),
  ].some(r =>
    lower.split(' ').some(w =>
      w.length > 4 &&
      ((r.location || '').toLowerCase().includes(w) ||
       (r.description || '').toLowerCase().includes(w))
    )
  );

  const isSensational = /sinkhole|cars falling|explosion|entire city|flooding downtown|shutdown all/i.test(rumor);
  const hasOfficialSrc = activeSources.includes('311') || activeSources.includes('911');

  let score = 50;
  if (hasCivicMatch)    score = 82;
  if (isSensational && !hasCivicMatch && hasOfficialSrc) score = 14;
  if (social.volume > 50) score = Math.min(score + 8, 96);
  if (social.sentiment === 'negative') score = Math.max(score - 10, 4);

  const verdict = score >= 70 ? 'verified' : score >= 35 ? 'caution' : 'misinformation';
  const titles  = { verified: 'Verified Fact', caution: 'Partial Signal — Caution', misinformation: 'Misinformation Alert' };
  const msgs    = {
    verified: `Confirmed by official city records. ${hasCivicMatch ? 'A matching incident was found in 311/911 data.' : ''} Social signal volume: ${social.volume}.`,
    caution: `Partial evidence found. Social mentions exist but no direct 311/911 match at the exact location. Monitor before sharing.`,
    misinformation: `No supporting evidence in official records. ${hasOfficialSrc ? 'Contradicts active 311/911 data.' : ''} High probability of exaggeration or misinformation.`,
  };

  return {
    status: verdict,
    score,
    title: titles[verdict],
    message: msgs[verdict],
    dataSource: hasCivicMatch ? `311/911 record match` : 'No official match — heuristic engine',
    activeSources,
    socialSignals: social,
    record311Count: (data311 || []).length,
    record911Count: (data911 || []).length,
  };
}
