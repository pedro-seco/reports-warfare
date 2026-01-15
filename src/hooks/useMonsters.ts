import { useCallback, useState } from "react";
import type { MonsterDetailInterface, MonsterSummary } from "../utils/interfaces";


export const useMonster = () => {
    const [loading, setLoading] =  useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (): Promise<MonsterSummary[]> => {
        try {
            const res = await fetch(import.meta.env.VITE_MONSTER_API_BASE_URL);
            const data = await res.json();
            console.log(data.results);
            return data.results 
        } catch (err) {console.error(err); return[]; }
    }, []);
    
    const fetchAllMonsters = useCallback(async (): Promise<MonsterSummary[]> => {
        return fetchData();
    },[fetchData] )

    const getMonster = async (name:string): Promise<MonsterDetailInterface | null> =>{
        setLoading(true);
        setError(null);
        try{
            const res = await fetch(`https://www.dnd5eapi.co/api/2014/monsters/${name.trim().toLowerCase().replace(/\s+/g,"-")}`)
            if(!res.ok){
                throw new Error('Monster not Found.')
            }
            const data = await res.json();
            return data as MonsterDetailInterface;

        } catch(err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch.');
            return null;

        } finally {setLoading(false);}
    };
    return { fetchAllMonsters, getMonster, fetchData, loading, error}
}