import type { MonsterDetailInterface } from "../../utils/interfaces";

interface MonsterDetailProps {
    monster: MonsterDetailInterface;
    onBack: () => void;
    onNext?: () => void;
    onPrevious?: () => void;
    canNext?: boolean;
    canPrevious?: boolean;
}

export const MonsterDetail: React.FC<MonsterDetailProps> = ({
    monster,
    onBack,
    onNext,
    onPrevious,
    canNext = false,
    canPrevious = false
}) => {

    return (
        <div>
            <div>
                <button onClick={onBack}> Back </button>
                <div>
                    {monster.name}
                </div>
            </div>
            <div>
                {canPrevious && (
                    <button onClick={(e) => {e.stopPropagation(); onPrevious?.();}}>
                        Previous Monster
                    </button>
                )}
                {canNext && (
                    <button onClick={(e) => {e.stopPropagation(); onNext?.();}}>
                        Next Monster
                    </button>
                )}
            </div>
            <div>
                {monster.name} {monster.alignment} {monster.type}
            </div>
        </div>

    )
}