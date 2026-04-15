export const BUFF_POOL = [
  {
    id: 'iron_shell',
    name: 'Iron Shell',
    description: 'All your creatures gain +15 DEF permanently',
    apply: (party) => party.map(c => ({ ...c, def: c.def + 15, baseDef: c.baseDef + 15 })),
  },
  {
    id: 'battle_fury',
    name: 'Battle Fury',
    description: 'All your creatures gain +10 ATK permanently',
    apply: (party) => party.map(c => ({ ...c, atk: c.atk + 10, baseAtk: c.baseAtk + 10 })),
  },
  {
    id: 'vital_core',
    name: 'Vital Core',
    description: 'All your creatures gain +20 max HP permanently',
    apply: (party) => party.map(c => ({ ...c, maxHp: c.maxHp + 20, hp: c.hp + 20, baseHp: c.baseHp + 20 })),
  },
  {
    id: 'swift_strike',
    name: 'Swift Strike',
    description: 'Your creatures always attack first this run',
    global: true,
  },
  {
    id: 'vampiric_edge',
    name: 'Vampiric Edge',
    description: 'Attacks heal you for 10% of damage dealt',
    global: true,
  },
  {
    id: 'fortunes_eye',
    name: "Fortune's Eye",
    description: 'Crit chance increased by 15% (crits deal 2x damage)',
    global: true,
  },
  {
    id: 'elemental_surge',
    name: 'Elemental Surge',
    description: 'Type advantage multiplier increases to 1.75x',
    global: true,
  },
  {
    id: 'second_wind',
    name: 'Second Wind',
    description: 'One creature auto-revives once per run with 30% HP',
    global: true,
  },
  {
    id: 'focus_shard',
    name: 'Focus Shard',
    description: 'All moves with accuracy below 90% are boosted to 90%',
    global: true,
  },
  {
    id: 'berserker_oath',
    name: 'Berserker Oath',
    description: 'ATK +30% but DEF -15%',
    apply: (party) => party.map(c => ({
      ...c,
      atk: Math.round(c.atk * 1.3),
      baseAtk: Math.round(c.baseAtk * 1.3),
      def: Math.round(c.def * 0.85),
      baseDef: Math.round(c.baseDef * 0.85),
    })),
  },
]

export function getRandomBuffs(count, excludeIds = []) {
  const available = BUFF_POOL.filter(b => !excludeIds.includes(b.id))
  const shuffled = [...available].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
