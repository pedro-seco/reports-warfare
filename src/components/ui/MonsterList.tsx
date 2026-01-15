import type React from "react";
import type { MonsterListProps } from "../../utils/interfaces";


export const MonsterList: React.FC<MonsterListProps> = ({monsters, loading}) => {
    return (
        <div>
            <div>
                {monsters.length === 0 && !loading && (
                    <div>
                        <p>No Monster Found</p>
                    </div>
                )}
            </div>
            <div>
                {monsters.map((m) => (
                <li key={m.index}>
                    <button
                    onClick={() => alert(`You selected ${m.name}`)}
                    >
                        {m.name}
                    </button>
                </li>
                ))}
            </div>
        </div>
        
    )
}