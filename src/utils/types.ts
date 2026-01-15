export type ArmorClass = {
    type: string;
    value: number;
    desc?: string;
}

export type Speed = {    
    burrow?: string;
    climb?: string;
    fly?: string;
    swim?: string;
    walk?: string;
    hover?: boolean;
}

export type Proficiency = {
    value: number;
    proficiency: {
        index: string;
        name: string;
        url: string;
    }
}

export type Condition = {
    index: string;
    name: string;
    url: string;
}

export type Senses = {
    passive_perception: number;
    blindsight?: string;
    darkvision?: string;
    tremorsense?: string;
    truesight?: string;
}

export type DcType = {
    index: string;
    name: string;
    url: string;
}

export type Damage = {
    damage_type: DamageType;
    damage_dice: string;
}

export type DamageType = {
    index: string;
    name: string;
}

export type Dc = {
    dc_type: DcType;
    dc_value: number;
    success_type: string;
}

export type Usage = {
    type: string;
    times: number;
    rest_types?: string[];
}

export type Ability = {
    index: string;
    name: string;
    url: string;
}

export type SpecialAbilities = {
    name: string;
    desc: string;
    usage?: Usage;
    damage: Damage[];
    dc?: Dc;
    spellcasting?: Spellcasting;
}

export type Slots = {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
    "6": number;
    "7": number;
    "8": number;
    "9": number;
}

export type Spells = {
    name: string;
    level: number;
    url: string;
}

export type Spellcasting = {
    level: number;
    ability: Ability;
    dc: number;
    modifier: number;
    components_required: string[];
    school: string;
    slots: Slots;
    spells: Spells[];
 }


export type Action = {
    name: string;
    count: string;
    type: string;
}

export type ActionOptions = {
    choose: number;
    type: string;
    from: OptionSetType;
}

export type Items = {
    option_type: string;
    action_name: string;
    count: number;
    type: string;
}

export type Options = {
    option_type: string;
    items: Items[];
}

export type OptionSetType = {
    option_set_type: string;
    options: Options[];
}

export type Actions = {
    damage: Damage[];
    name: string;
    desc: string;
    multiattack_type?: string;
    attack_bonus?: number;
    action_options?: ActionOptions[];
    actions: Action[];
}

export type LegendaryActions = {
    name: string;
    desc: string;
    damage: Damage[];
    dc?: Dc;
}