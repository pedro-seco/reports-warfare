import { useState } from 'react';
import './styles/App.css';
import StatBlock from './components/StatBlock';
import Search from './components/Search';
import { fetchMonster } from './dndApi';


function App() {
  const [openStatblocks, setOpenStatblocks] = useState([]);
  const [monsterData, setMonsterData] = useState({});
  const [loadingSet, setLoadingSet] = useState(new Set());

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

  return (
    <div className="app">
      <Search onSelectMonster={handleSelectMonster} />

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

        {openStatblocks.map(index =>
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
  );
}

export default App
