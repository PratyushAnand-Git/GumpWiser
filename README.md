# 🛡️ GumpWiser: Empowering Montgomery with Civic Intelligence

**Tagline:** *Making the Gump Wiser through AI Sensing.*

## 💡 The Vision
GumpWiser is a real-time civic sensing platform built for the **World Wide Vibes Hackathon**. It tackles the growing problem of localized misinformation on social media by actively "sensing" community rumors and cross-referencing them against official city data. 

Our goal is to give citizens of Montgomery a reliable "Reality Check" on neighborhood vibes, road conditions, and public safety announcements.

---

## 🏗️ Technical Core (The "Brain")
GumpWiser uses a layered architecture to ensure a robust, "bulletproof" experience even during heavy traffic or API outages:

1. **The Live Senser (Social Scraping):** Integrates **Bright Data** SERP API to scrape and sense real-time "vibes" and rumors from local social media channels.
2. **The Verification Scraper (Civic Web Scraping):** If the official municipal APIs fail, GumpWiser dynamically uses a secondary **Bright Data** instance to actively scrape official civic domains (`montgomeryal.gov`, `wsfa.com`) to manually verify the incident before feeding it to the AI.
3. **The LLM Reasoning Engine:** Powered by **Google Gemini 1.5 Flash**, providing fast, low-latency heuristic analysis of both structured JSON and unstructured web scraped text.
3. **The Ground Truth:** Connects to the **City of Montgomery Open Data Portal** (ArcGIS REST API) to fetch live 311 service requests and 911 dispatch approximations.
4. **The Gump-Score:** A dynamic confidence meter. The LLM compares the incoming rumor against the official 311 JSON. 
   - *Example:* A perfect location + incident match yields a 95% **"Verified Fact"** card.
   - *Example:* An unverified major claim (e.g., a sinkhole not in the 311 data) yields a 12% **"Misinformation Alert"**.
5. **The Heuristic Fallback Engine:** To demonstrate engineering maturity, GumpWiser features a resilient fallback. If the live ArcGIS datasets go offline or the API quota is exceeded (429/404), the backend instantly routes the request to a local heuristic matching engine. This ensures the dashboard *never crashes* and continues to provide verified intelligence.

---

## 🚀 Running the Project Locally

1. Clone the repository.
2. Install dependencies:
   \`\`\`bash
   pnpm install
   \`\`\`
3. Create a \`.env.local\` file with your keys:
   \`\`\`env
   BRIGHTDATA_API_TOKEN=your_token
   GEMINI_API_KEY=your_key
   \`\`\`
4. Run the development server:
   \`\`\`bash
   pnpm dev
   \`\`\`
5. Open [http://localhost:3000](http://localhost:3000) and test the "Fact Check a Rumor" tool. Try typing:
   - *"Pothole road repair near the Capitol"* (Expected: Verified Fact)
   - *"Huge massive sinkhole explosion on Commerce Street"* (Expected: Misinformation Alert)
