import { abilityMod, crToDisplay } from '../dndApi';

const ABILITIES = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
const ABILITY_SHORT = { strength: 'STR', dexterity: 'DEX', constitution: 'CON', intelligence: 'INT', wisdom: 'WIS', charisma: 'CHA' };

function formatSpeed(speed) {
  if (!speed) return '—';
  return Object.entries(speed)
    .filter(([, v]) => v)
    .map(([k, v]) => (k === 'walk' ? v : `${k} ${v}`))
    .join(', ');
}

function formatAC(armorClass) {
  if (!armorClass || armorClass.length === 0) return '—';
  const first = armorClass[0];
  const typeLabel = first.type === 'natural' ? ' (natural armor)'
    : first.type === 'armor' && first.armor?.length
      ? ` (${first.armor.map(a => a.name).join(', ')})`
      : first.type === 'dex' || first.type === 'flat' ? ''
      : first.type ? ` (${first.type})` : '';
  return `${first.value}${typeLabel}`;
}

function formatSenses(senses) {
  if (!senses) return '—';
  return Object.entries(senses)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k.replace(/_/g, ' ')} ${v}`)
    .join(', ');
}

export default function StatBlock({ monster, onClose }) {
  const savingThrows = (monster.proficiencies ?? []).filter(p =>
    p.proficiency.index.startsWith('saving-throw')
  );
  const skills = (monster.proficiencies ?? []).filter(p =>
    p.proficiency.index.startsWith('skill')
  );

  return (
    <article className="statblock">
      <header className="statblock__header">
        <h2 className="statblock__name">{monster.name}</h2>
        <p className="statblock__meta">
          {monster.size} {monster.type}
          {monster.subtype ? ` (${monster.subtype})` : ''},{' '}
          {monster.alignment}
        </p>
        <button className="statblock__close" onClick={onClose} aria-label="Close stat block">
          ✕
        </button>
      </header>

      <div className="statblock__divider" />

      <div className="statblock__basics">
        <Row label="Armor Class">{formatAC(monster.armor_class)}</Row>
        <Row label="Hit Points">
          {monster.hit_points} {monster.hit_dice ? `(${monster.hit_dice})` : ''}
        </Row>
        <Row label="Speed">{formatSpeed(monster.speed)}</Row>
      </div>

      <div className="statblock__divider" />

      <div className="statblock__abilities">
        {ABILITIES.map(ab => (
          <div key={ab} className="statblock__ability">
            <div className="statblock__ability-name">{ABILITY_SHORT[ab]}</div>
            <div className="statblock__ability-score">
              {monster[ab]}<br />
              <span className="statblock__ability-mod">({abilityMod(monster[ab])})</span>
            </div>
          </div>
        ))}
      </div>

      <div className="statblock__divider" />

      <div className="statblock__secondary">
        {savingThrows.length > 0 && (
          <Row label="Saving Throws">
            {savingThrows.map(p => {
              const name = p.proficiency.name.replace('Saving Throw: ', '');
              return `${name} ${p.value >= 0 ? '+' : ''}${p.value}`;
            }).join(', ')}
          </Row>
        )}
        {skills.length > 0 && (
          <Row label="Skills">
            {skills.map(p => {
              const name = p.proficiency.name.replace('Skill: ', '');
              return `${name} ${p.value >= 0 ? '+' : ''}${p.value}`;
            }).join(', ')}
          </Row>
        )}
        {monster.damage_vulnerabilities?.length > 0 && (
          <Row label="Damage Vulnerabilities">{monster.damage_vulnerabilities.join('; ')}</Row>
        )}
        {monster.damage_resistances?.length > 0 && (
          <Row label="Damage Resistances">{monster.damage_resistances.join('; ')}</Row>
        )}
        {monster.damage_immunities?.length > 0 && (
          <Row label="Damage Immunities">{monster.damage_immunities.join('; ')}</Row>
        )}
        {monster.condition_immunities?.length > 0 && (
          <Row label="Condition Immunities">
            {monster.condition_immunities.map(c => c.name).join(', ')}
          </Row>
        )}
        <Row label="Senses">{formatSenses(monster.senses)}</Row>
        <Row label="Languages">{monster.languages || '—'}</Row>
        <Row label="Challenge">
          {crToDisplay(monster.challenge_rating)}
          {monster.xp != null ? ` (${monster.xp.toLocaleString()} XP)` : ''}
        </Row>
      </div>

      {monster.special_abilities?.length > 0 && (
        <>
          <div className="statblock__divider" />
          <div className="statblock__section">
            {monster.special_abilities.map((ab, i) => (
              <Trait key={i} name={ab.name} desc={ab.desc} />
            ))}
          </div>
        </>
      )}

      {monster.actions?.length > 0 && (
        <>
          <SectionHeader>Actions</SectionHeader>
          <div className="statblock__section">
            {monster.actions.map((a, i) => (
              <Trait key={i} name={a.name} desc={a.desc} />
            ))}
          </div>
        </>
      )}

      {monster.reactions?.length > 0 && (
        <>
          <SectionHeader>Reactions</SectionHeader>
          <div className="statblock__section">
            {monster.reactions.map((r, i) => (
              <Trait key={i} name={r.name} desc={r.desc} />
            ))}
          </div>
        </>
      )}

      {monster.legendary_actions?.length > 0 && (
        <>
          <SectionHeader>Legendary Actions</SectionHeader>
          <div className="statblock__section">
            {monster.legendary_desc && (
              <p className="statblock__legendary-desc">{monster.legendary_desc}</p>
            )}
            {monster.legendary_actions.map((a, i) => (
              <Trait key={i} name={a.name} desc={a.desc} />
            ))}
          </div>
        </>
      )}
    </article>
  );
}

function Row({ label, children }) {
  return (
    <div className="statblock__row">
      <span className="statblock__row-label">{label}</span>
      <span>{children}</span>
    </div>
  );
}

function SectionHeader({ children }) {
  return <div className="statblock__section-header">{children}</div>;
}

function Trait({ name, desc }) {
  return (
    <p className="statblock__trait">
      <em className="statblock__trait-name">{name}.</em>{' '}
      <span className="statblock__trait-desc">{desc}</span>
    </p>
  );
}
