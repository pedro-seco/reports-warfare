const mongoose = require('mongoose');
const { Schema } = mongoose;

const DamageSchema = new Schema({
  damage_dice:  { type: String },              
  damage_bonus: { type: Number, default: 0 },
  damage_type:  { type: String },              
}, { _id: false });

const DCSchema = new Schema({
  dc_type:    { type: String, required: true }, 
  dc_value:   { type: Number, required: true },
  success_type: { type: String, enum: ['none', 'half', 'other'], default: 'none' },
}, { _id: false });

const ActionSchema = new Schema({
  name:         { type: String, required: true },
  desc:         { type: String, required: true },
  // For attacks
  attack_bonus: { type: Number },
  attack_type:  { type: String, enum: ['melee_weapon', 'ranged_weapon', 'melee_spell', 'ranged_spell'] },
  reach:        { type: String },              // e.g. "5 ft."
  range:        { type: String },              // e.g. "60/240 ft."
  targets:      { type: String },              // e.g. "one target"
  damage:       [DamageSchema],
  dc:           DCSchema,

  // For multi-attack or complex actions
  actions:      [{ type: Schema.Types.Mixed }],
  usage: {
    type:       { type: String, enum: ['per_day', 'recharge_on_roll', 'recharge_after_rest', 'at_will'] },
    times:      { type: Number },              // for per_day
    min_value:  { type: Number },              // for recharge_on_roll (e.g. 5 = "Recharge 5-6")
  },
}, { _id: false });

const SpellEntrySchema = new Schema({
  name:   { type: String, required: true },
  url:    { type: String },                    // dnd5eapi ref, if seeded from API
  notes:  { type: String },                    // optional per-instance note
}, { _id: false });


const monsterSchema = new Schema({

  // ── Identity ──────────────────────────────────────────────────────────────
  name:    { type: String, required: true, trim: true },
  index:   { type: String, trim: true },       // slug/key for API lookups, e.g. "adult-red-dragon"
  source:  { type: String },                   // e.g. "Monster Manual"
  page:    { type: Number },
  image:   { type: String },                   // URL to art/token

  // ── Classification ────────────────────────────────────────────────────────
  size:      {
    type: String,
    enum: ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'],
    required: true,
  },
  type:      { type: String, required: true },  // e.g. "dragon", "undead"
  subtype:   { type: String },                  // e.g. "any race", "shapechanger"
  alignment: { type: String },                  // e.g. "chaotic evil", "unaligned"
  tags:      [{ type: String }],                // custom campaign tags

  // ── Core combat stats ─────────────────────────────────────────────────────
  armor_class: [{
    value: { type: Number, required: true },
    type:  { type: String },                   // e.g. "natural", "armor", "dex"
    armor: [{ name: String, index: String }],  // equipped armor pieces
    spell: { name: String, index: String },    // for Mage Armor / spells
    condition: { name: String, index: String },
    _id: false,
  }],

  hit_points:       { type: Number, required: true },
  hit_dice:         { type: String },           // e.g. "18d20+126"
  hit_points_roll:  { type: String },           // alias kept for API compat

  speed: {
    walk:   { type: String },
    burrow: { type: String },
    climb:  { type: String },
    fly:    { type: String },
    swim:   { type: String },
    hover:  { type: Boolean, default: false },  // true if fly speed requires hovering
  },

  // ── Ability scores ────────────────────────────────────────────────────────
  strength:     { type: Number, required: true, min: 1 },
  dexterity:    { type: Number, required: true, min: 1 },
  constitution: { type: Number, required: true, min: 1 },
  intelligence: { type: Number, required: true, min: 1 },
  wisdom:       { type: Number, required: true, min: 1 },
  charisma:     { type: Number, required: true, min: 1 },

  proficiency_bonus: { type: Number },          // explicit override; derived from CR if omitted

  // ── Proficiencies (saving throws & skills) ────────────────────────────────
  saving_throws: [{
    ability: { type: String, required: true },  // "STR", "DEX", etc.
    bonus:   { type: Number, required: true },
    _id: false,
  }],

  skills: [{
    name:  { type: String, required: true },    // e.g. "Perception"
    bonus: { type: Number, required: true },
    _id: false,
  }],

  // ── Damage & condition modifiers ──────────────────────────────────────────
  damage_vulnerabilities: [{ type: String }],
  damage_resistances:     [{ type: String }],
  damage_immunities:      [{ type: String }],
  condition_immunities:   [{ type: String }],   // e.g. "charmed", "frightened"

  // ── Senses ────────────────────────────────────────────────────────────────
  senses: {
    blindsight:        { type: String },
    darkvision:        { type: String },
    tremorsense:       { type: String },
    truesight:         { type: String },
    passive_perception: { type: Number },
  },

  languages:        { type: String },           // free text, e.g. "Common, Draconic"
  telepathy:        { type: Number },           // range in ft, if any

  // ── CR & XP ───────────────────────────────────────────────────────────────
  challenge_rating: { type: Number, required: true }, // 0.125 = 1/8, 0.25 = 1/4, etc.
  xp:               { type: Number },

  // ── Special traits ────────────────────────────────────────────────────────
  special_abilities: [ActionSchema],

  // ── Spellcasting (standard — uses spell slots) ────────────────────────────
  spellcasting: {
    level:              { type: Number },        // spellcaster level
    ability:            { type: String },        // e.g. "INT"
    dc:                 { type: Number },
    attack_bonus:       { type: Number },
    components_required: [{ type: String }],     // ["V", "S", "M"]
    school:             { type: String },        // "Wizard", "Cleric", etc.
    slots: {                                     // spell slots per level
      level_1:  { type: Number, default: 0 },
      level_2:  { type: Number, default: 0 },
      level_3:  { type: Number, default: 0 },
      level_4:  { type: Number, default: 0 },
      level_5:  { type: Number, default: 0 },
      level_6:  { type: Number, default: 0 },
      level_7:  { type: Number, default: 0 },
      level_8:  { type: Number, default: 0 },
      level_9:  { type: Number, default: 0 },
    },
    spells: {                                    // spells known per slot level
      cantrips: [SpellEntrySchema],
      level_1:  [SpellEntrySchema],
      level_2:  [SpellEntrySchema],
      level_3:  [SpellEntrySchema],
      level_4:  [SpellEntrySchema],
      level_5:  [SpellEntrySchema],
      level_6:  [SpellEntrySchema],
      level_7:  [SpellEntrySchema],
      level_8:  [SpellEntrySchema],
      level_9:  [SpellEntrySchema],
    },
  },

  // ── Innate spellcasting (at-will / X/day, no slots) ──────────────────────
  innate_spellcasting: {
    ability:       { type: String },
    dc:            { type: Number },
    attack_bonus:  { type: Number },
    components_required: [{ type: String }],
    spells: {
      at_will:   [SpellEntrySchema],
      per_day_3: [SpellEntrySchema],             // 3/day each
      per_day_2: [SpellEntrySchema],             // 2/day each
      per_day_1: [SpellEntrySchema],             // 1/day each
    },
  },

  // ── Actions ───────────────────────────────────────────────────────────────
  actions:       [ActionSchema],
  bonus_actions: [ActionSchema],
  reactions:     [ActionSchema],

  // ── Legendary mechanics ───────────────────────────────────────────────────
  legendary_desc:    { type: String },           // intro paragraph for legendary actions
  legendary_actions: [ActionSchema],
  legendary_resistances: { type: Number },       // number of uses per day

  // ── Mythic mechanics (e.g. Tiamat, Tarrasque variants) ───────────────────
  mythic_desc:    { type: String },
  mythic_actions: [ActionSchema],

  // ── Lair ─────────────────────────────────────────────────────────────────
  lair_actions:    [{ desc: { type: String }, _id: false }],
  regional_effects:[{ desc: { type: String }, _id: false }],

}, {
  timestamps: true,
});

// ── Indexes ──────────────────────────────────────────────────────────────────
monsterSchema.index({ name: 'text', tags: 'text' });
monsterSchema.index({ challenge_rating: 1 });
monsterSchema.index({ type: 1 });
monsterSchema.index({ size: 1 });
monsterSchema.index({ alignment: 1 });
monsterSchema.index({ index: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Monster', monsterSchema);
