import { useState } from 'react';
import './ui/styles/App.css';
import StatBlock from './ui/components/StatBlock';
import Search from './ui/components/Search';
import { fetchMonster } from './dndApi';


function App() {
  const [openStatblocks, setOpenStatblocks] = useState([]);
  const [monsterData, setMonsterData] = useState({});
  const [loadingSet, setLoadingSet] = useState(new Set());
  const [statblockFilter, setStatblockFilter] = useState('');

  async function handleSelectMonster(index) {
    if (openStatblocks.includes(index)) return;

    if (!monsterData[index]) {
      setLoadingSet(prev => new Set(prev).add(index));
      try {
        const data = await fetchMonster(index);
        
        setMonsterData(prev => ({ ...prev, [index]: data }));
        setOpenStatblocks(prev => [...prev, index]);
      } catch (e) {
        console.error('Failed to fetch monster:', e);
      } finally {
        setLoadingSet(prev => {
          const next = new Set(prev);
          next.delete(index);
          return next;
        });
      }
    } else {
      setOpenStatblocks(prev => [...prev, index]);
    }
  }

  function handleClose(index) {
    setOpenStatblocks(prev => prev.filter(i => i !== index));
  }

  const visibleStatblocks = openStatblocks.filter(index =>
    !monsterData[index] ||
    monsterData[index].name.toLowerCase().includes(statblockFilter.toLowerCase())
  );

  return (
    <div className="app">
      <Search onSelectMonster={handleSelectMonster} />

      <div className="statblocks-panel">
        <div className="statblocks-toolbar">
          <input
            type="search"
            className="statblocks-filter"
            placeholder="Filter open stat blocks..."
            value={statblockFilter}
            onChange={e => setStatblockFilter(e.target.value)}
            aria-label="Filter open stat blocks by name"
          />
          {openStatblocks.length > 0 && (
            <span className="statblocks-toolbar__count">
              {visibleStatblocks.length}/{openStatblocks.length}
            </span>
          )}
        </div>

        <main className="statblocks-area">
          {openStatblocks.length === 0 && loadingSet.size === 0 && (
            <div className="statblocks-empty">
              <div className="statblocks-empty__icon">☩</div>
              <p>Select a creature to reveal its stat block</p>
            </div>
          )}

          {[...loadingSet].map(index => (
            <div key={`loading-${index}`} className="statblock-skeleton">
              <div className="statblock-skeleton__bar" />
              <div className="statblock-skeleton__line" style={{ width: '60%' }} />
              <div className="statblock-skeleton__line" style={{ width: '80%' }} />
              <div className="statblock-skeleton__line" style={{ width: '70%' }} />
            </div>
          ))}

          {visibleStatblocks.map(index =>
            monsterData[index] ? (
              <StatBlock
                key={index}
                monster={monsterData[index]}
                onClose={() => handleClose(index)}
              />
            ) : null
          )}
        </main>
      </div>
    </div>
  );
}

export default App
