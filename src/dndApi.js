const BASE_URL = 'https://www.dnd5eapi.co/api';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function getCached(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    
    if (Date.now() - ts > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch { return null;}
}

function setCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch (e) {console.warn('localStorage write failed:', e);}
}

export async function fetchMonsterList(filters = {}) {
  const params = new URLSearchParams();
  if (filters.challenge_rating !== undefined && filters.challenge_rating !== '') {
    params.set('challenge_rating', filters.challenge_rating);
  }
  if (filters.type) params.set('type', filters.type.toLowerCase());
  if (filters.size) params.set('size', filters.size.toLowerCase());

  const cacheKey = `dnd5e_list_${params.toString()}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const url = `${BASE_URL}/monsters${params.toString() ? '?' + params : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);

  const json = await res.json();
  const results = json.results ?? [];
  setCache(cacheKey, results);
  return results;
}

export async function fetchMonster(index) {
  const cacheKey = `dnd5e_monster_${index}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${BASE_URL}/monsters/${index}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  
  setCache(cacheKey, data);
  return data;
}

export const CR_MAP = {
  '0': 0, '1/8': 0.125, '1/4': 0.25, '1/2': 0.5,
  '1': 1, '2': 2, '3': 3, '4': 4, '5': 5,
  '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  '11': 11, '12': 12, '13': 13, '14': 14, '15': 15,
  '16': 16, '17': 17, '18': 18, '19': 19, '20': 20,
  '21': 21, '22': 22, '23': 23, '24': 24, '25': 25,
  '26': 26, '27': 27, '28': 28, '29': 29, '30': 30,
};

export function crToDisplay(cr) {
  if (cr === 0.125) return '1/8';
  if (cr === 0.25) return '1/4';
  if (cr === 0.5) return '1/2';
  return String(cr);
}

export function abilityMod(score) {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}
