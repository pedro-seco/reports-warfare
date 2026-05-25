import { useState, useEffect, useRef } from 'react';
import { fetchMonsterList, CR_MAP } from '../dndApi';

const CR_OPTIONS = ['', '0', '1/8', '1/4', '1/2', ...Array.from({ length: 30 }, (_, i) => String(i + 1))];

const TYPE_OPTIONS = [
  '', 'aberration', 'beast', 'celestial', 'construct', 'dragon',
  'elemental', 'fey', 'fiend', 'giant', 'humanoid', 'monstrosity',
  'ooze', 'plant', 'undead',
];

const SIZE_OPTIONS = ['', 'Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];

const ALIGNMENT_OPTIONS = [
  '', 'lawful good', 'neutral good', 'chaotic good',
  'lawful neutral', 'neutral', 'chaotic neutral',
  'lawful evil', 'neutral evil', 'chaotic evil',
  'unaligned', 'any alignment',
];

export default function Search({ onSelectMonster }) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ cr: '', type: '', size: '', alignment: '' });
  const [allMonsters, setAllMonsters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const apiFilters = {};
        if (filters.cr) apiFilters.challenge_rating = CR_MAP[filters.cr];
        if (filters.type) apiFilters.type = filters.type;
        if (filters.size) apiFilters.size = filters.size;
        const results = await fetchMonsterList(apiFilters);
        setAllMonsters(results);
      } catch {
        setError('Failed to load. Check your connection.');
        setAllMonsters([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [filters.cr, filters.type, filters.size]);

  const filtered = allMonsters.filter(m =>
    m.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <aside className="search-panel">
      <div className="search-panel__header">
        <h1 className="search-panel__title">
          Odo Zentarin's
        </h1>
        <p className="search-panel__subtitle">Reports of Warfare</p>
      </div>

      <div className="search-panel__controls">
        <input
          type="search"
          className="search-input"
          placeholder="Search monsters..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Search monsters by name"
        />

        <div className="search-filters">
          <label className="filter-group">
            <span className="filter-label">CR</span>
            <select
              className="filter-select"
              value={filters.cr}
              onChange={e => setFilters(f => ({ ...f, cr: e.target.value }))}
            >
              {CR_OPTIONS.map(cr => (
                <option key={cr} value={cr}>{cr === '' ? 'Any CR' : `CR ${cr}`}</option>
              ))}
            </select>
          </label>

          <label className="filter-group">
            <span className="filter-label">Type</span>
            <select
              className="filter-select"
              value={filters.type}
              onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
            >
              {TYPE_OPTIONS.map(t => (
                <option key={t} value={t}>
                  {t === '' ? 'Any Type' : t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-group">
            <span className="filter-label">Size</span>
            <select
              className="filter-select"
              value={filters.size}
              onChange={e => setFilters(f => ({ ...f, size: e.target.value }))}
            >
              {SIZE_OPTIONS.map(s => (
                <option key={s} value={s}>{s === '' ? 'Any Size' : s}</option>
              ))}
            </select>
          </label>

          <label className="filter-group">
            <span className="filter-label">Alignment</span>
            <select
              className="filter-select"
              value={filters.alignment}
              onChange={e => setFilters(f => ({ ...f, alignment: e.target.value }))}
            >
              {ALIGNMENT_OPTIONS.map(a => (
                <option key={a} value={a}>
                  {a === '' ? 'Any' : a.charAt(0).toUpperCase() + a.slice(1)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="search-results">
        {loading && (
          <div className="search-status">
            <span className="search-spinner">◈</span> Consulting the archives...
          </div>
        )}
        {error && <div className="search-status search-status--error">{error}</div>}
        {!loading && !error && filtered.length === 0 && (
          <div className="search-status">No creatures found.</div>
        )}
        {!loading && !error && filtered.length > 0 && (
          <p className="search-count">{filtered.length} creature{filtered.length !== 1 ? 's' : ''}</p>
        )}
        <ul className="monster-list">
          {filtered.map(m => (
            <li key={m.index} className="monster-list__item">
              <button
                className="monster-list__btn"
                onClick={() => onSelectMonster(m.index)}
              >
                {m.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
