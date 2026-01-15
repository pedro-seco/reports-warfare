import React, { useEffect, useMemo, useState } from 'react';
import './App.css'
import { useMonster } from './hooks/useMonsters';
import type { MonsterDetailInterface, MonsterSummary } from './utils/interfaces';
import { MonsterList } from './components/ui/MonsterList';
import { MonsterDetail } from './components/ui/MonsterDetail';

export default function App() {
  const { fetchAllMonsters, getMonster, loading} = useMonster();

  const [allMonsters, setAllMonsters] = useState<MonsterSummary[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  const [selectedMonster, setSelectedMonster] = useState<MonsterDetailInterface | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadAll = async () => {
      setIsInitializing(true);
      const list = await fetchAllMonsters();
      setAllMonsters(list);
      setIsInitializing(false);
    };
    loadAll();
  }, [fetchAllMonsters]);


  const filteredMonsters = useMemo(() => {
    let result = allMonsters;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(m =>
        m.name.toLowerCase().includes(query)
      ) 
    }
    return [...result].sort((a,b) => {
      return a.name.localeCompare(b.name);
    })
  }, [allMonsters, searchQuery])

  const displayedMonsters = useMemo(() => {
    return filteredMonsters.slice();
  }, [filteredMonsters])

/*   const handleSelectMonster = async (summary: MonsterSummary ) => {
    const details = await getMonster(summary.name);
    if (details){
      setSelectedMonster(details);
    }
  } */

  const handleSearchChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }
  
  const handleBack = () => {
    setSelectedMonster(null);
  }

  const handleSelectMonster = async (summary: MonsterSummary) => {
    const details = await getMonster(summary.name);
    console.log(details);
    if (details){
      setSelectedMonster(details);
    }
  }

  const currentIndex = useMemo(() => {
    if (!selectedMonster) return -1;
    return filteredMonsters.findIndex(m => m.index === selectedMonster.index);
  }, [selectedMonster, filteredMonsters]);

  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < filteredMonsters.length - 1){
      handleSelectMonster(filteredMonsters[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0){
      handleSelectMonster(filteredMonsters[currentIndex - 1]);
    }
  }

  const isLoading = isInitializing || loading;

  return (
    <div>
      <div className='text-2xl'>
        <input
          placeholder='Pick Their Poison...'
          value={searchQuery}
          onChange={handleSearchChange}
        />  
      </div>
      <div>
        {selectedMonster && (
          <MonsterDetail
          monster={selectedMonster}
          onBack={handleBack}
          onNext={handleNext}
          onPrevious={handlePrevious}
          canNext={currentIndex < filteredMonsters.length - 1 }
          canPrevious={currentIndex > 0}
        />
        )}
        
      </div>
      <div>
        <MonsterList
          onSelect={handleSelectMonster}
          monsters={displayedMonsters}
          loading={isLoading}
        />
      </div>
    </div>
  );
}