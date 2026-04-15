export const EVENT_POOL = [
  {
    id: 'healing_spring',
    name: 'Healing Spring',
    description: 'Both your creatures restore 40% max HP',
    icon: '💧',
    apply: (state) => {
      const party = state.playerParty.map(c => ({
        ...c,
        hp: Math.min(c.maxHp, c.hp + Math.floor(c.maxHp * 0.4)),
      }))
      return { playerParty: party }
    },
  },
  {
    id: 'cursed_fog',
    name: 'Cursed Fog',
    description: 'Enemy in next battle starts with +15 ATK',
    icon: '🌫️',
    apply: () => ({ enemyAtkBonus: 15 }),
  },
  {
    id: 'lucky_find',
    name: 'Lucky Find',
    description: 'Gain a 4th random buff option in the next buff selection',
    icon: '🍀',
    apply: () => ({ extraBuffSlot: true }),
  },
  {
    id: 'battle_hardened',
    name: 'Battle Hardened',
    description: 'Your creatures gain +8 DEF from the struggle',
    icon: '🛡️',
    apply: (state) => {
      const party = state.playerParty.map(c => ({
        ...c,
        def: c.def + 8,
        baseDef: c.baseDef + 8,
      }))
      return { playerParty: party }
    },
  },
  {
    id: 'ambush',
    name: 'Ambush!',
    description: 'Next battle starts with enemy getting a free first attack',
    icon: '⚔️',
    apply: () => ({ enemyFreeAttack: true }),
  },
  {
    id: 'ancient_relic',
    name: 'Ancient Relic',
    description: 'One random creature gains +20 max HP',
    icon: '🏺',
    apply: (state) => {
      const idx = Math.floor(Math.random() * state.playerParty.length)
      const party = state.playerParty.map((c, i) =>
        i === idx ? { ...c, maxHp: c.maxHp + 20, hp: c.hp + 20, baseHp: c.baseHp + 20 } : c
      )
      return { playerParty: party }
    },
  },
  {
    id: 'trainers_rest',
    name: "Trainer's Rest",
    description: 'Fully heal one chosen creature',
    icon: '🏕️',
    needsChoice: true,
    apply: (state, chosenIndex) => {
      const party = state.playerParty.map((c, i) =>
        i === chosenIndex ? { ...c, hp: c.maxHp } : c
      )
      return { playerParty: party }
    },
  },
  {
    id: 'double_edge',
    name: 'Double Edge',
    description: 'Your ATK +20% but you also take 10% more damage next battle',
    icon: '⚡',
    apply: (state) => {
      const party = state.playerParty.map(c => ({
        ...c,
        atk: Math.round(c.atk * 1.2),
        baseAtk: Math.round(c.baseAtk * 1.2),
      }))
      return { playerParty: party, extraDamageTaken: 0.1 }
    },
  },
  {
    id: 'mysterious_herb',
    name: 'Mysterious Herb',
    description: 'Random creature gets +15 to a random stat',
    icon: '🌿',
    apply: (state) => {
      const idx = Math.floor(Math.random() * state.playerParty.length)
      const stats = ['atk', 'def', 'maxHp']
      const stat = stats[Math.floor(Math.random() * stats.length)]
      const baseKey = stat === 'maxHp' ? 'baseHp' : stat === 'atk' ? 'baseAtk' : 'baseDef'
      const party = state.playerParty.map((c, i) => {
        if (i !== idx) return c
        const updated = { ...c, [stat]: c[stat] + 15, [baseKey]: c[baseKey] + 15 }
        if (stat === 'maxHp') updated.hp = updated.hp + 15
        return updated
      })
      return { playerParty: party }
    },
  },
]

export function getRandomEvents(count) {
  const shuffled = [...EVENT_POOL].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
