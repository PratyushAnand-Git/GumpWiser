
export interface Objection {
  username: string;
  comment: string;
  image?: string; // base64 string
  timestamp: number;
  category: string;
}

const STORAGE_KEY = 'gumpwiser_objections';

export function getObjectionsByCategory(category: string): Objection[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    const allObjections: Objection[] = JSON.parse(stored);
    return allObjections.filter(o => o.category.toLowerCase() === category.toLowerCase());
  } catch {
    return [];
  }
}

export function saveObjection(objection: Objection) {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem(STORAGE_KEY);
  let allObjections: Objection[] = [];
  if (stored) {
    try {
      allObjections = JSON.parse(stored);
    } catch {
      allObjections = [];
    }
  }
  allObjections.push(objection);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allObjections));
}
