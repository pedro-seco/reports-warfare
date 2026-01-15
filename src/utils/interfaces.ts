import type { Dispatch, SetStateAction } from "react";
import type { Actions, ArmorClass, Condition, LegendaryActions, Proficiency, Senses, SpecialAbilities, Speed } from "./types";

export interface MonsterDetail {
  index: string;
  name: string;
  size: string;
  type: string;
  alignment: string;
  armor_class: ArmorClass[];
  hit_points: number;
  hit_dice:string;
  hit_points_roll: string;
  speed: Speed;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  proficiencies?: Proficiency[];
  damage_vulnerabilites?: string[];
  damage_resistances?: string[];
  damage_immunities?: string[];
  condition_immunities?: Condition[];
  senses: Senses;
  languages?: string;
  challenge_rating: number;
  proficiency_bonus: number;
  xp: number;
  special_abilities?: SpecialAbilities[];
  actions: Actions[];
  legendary_actions: LegendaryActions[];
  image: string;
  url: string;
}

export interface SearchBarProps {
  setResults: Dispatch<SetStateAction<MonsterSummary[]>>
}

export interface MonsterSummary{
    index: string;
    name: string;
    url: string;
}


export interface SearchResultProps {
    result: MonsterSummary;
}

export interface ResultsListProps {
  results: MonsterSummary[]
}

export interface MonsterListProps {
    monsters: MonsterSummary[];
    loading: boolean;
}