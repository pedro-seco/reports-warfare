import React, { useEffect, useMemo, useState } from 'react';
import './App.css'
import { useMonster } from './hooks/useMonsters';
import type { MonsterSummary } from './utils/interfaces';
import { MonsterList } from './components/ui/MonsterList';

export default function App() {
  const { fetchAllMonsters, loading} = useMonster();

  const [allMonsters, setAllMonsters] = useState<MonsterSummary[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  // const [selectedMonster, setSelectedMonster] = useState<MonsterDetail | null>(null);
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

/*   const handleSelectedMonster = async (summary: MonsterSummary ) => {
    const details = await getMonster(summary.name);
    if (details){
      setSelectedMonster(details);
    }
  } */

  const handleSearchChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
      <div className='text-amber-950'>
        <MonsterList
          monsters={displayedMonsters}
          loading={isLoading}
        />
      </div>
    </div>
  );
}