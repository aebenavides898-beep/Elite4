import { create } from 'zustand'
import { createBattleCreature, EXP_PER_BATTLE, expToNextLevel } from '../data/creatures'

const useGameStore = create((set, get) => ({
  gamePhase: 'title',
  playerParty: [],
  activeCreatureIndex: 0,
  currentBattle: 1,
  appliedBuffs: [],
  enemyAtkBonus: 0,
  enemyFreeAttack: false,
  extraDamageTaken: 0,
  extraBuffSlot: false,
  secondWindUsed: false,

  setPhase: (phase) => set({ gamePhase: phase }),

  selectStarters: (creatures) => {
    const party = creatures.map(c => createBattleCreature(c))
    set({ playerParty: party, activeCreatureIndex: 0, gamePhase: 'battle' })
  },

  switchCreature: (index) => set({ activeCreatureIndex: index }),

  updatePlayerCreature: (index, updates) => set(state => {
    const party = [...state.playerParty]
    party[index] = { ...party[index], ...updates }
    return { playerParty: party }
  }),

  updateAllCreatures: (updateFn) => set(state => ({
    playerParty: state.playerParty.map(updateFn),
  })),

  applyBuff: (buff) => set(state => {
    let party = state.playerParty
    if (buff.apply) {
      party = buff.apply(party)
    }
    return {
      playerParty: party,
      appliedBuffs: [...state.appliedBuffs, buff.id],
    }
  }),

  applyEvent: (result) => set(state => ({
    ...state,
    ...result,
  })),

  awardExp: () => set(state => {
    const expGain = EXP_PER_BATTLE[state.currentBattle]
    const party = state.playerParty.map(c => {
      if (c.hp <= 0 && !c.revived) return c
      let newExp = c.exp + expGain
      let newLevel = c.level
      let newAtk = c.atk
      let newDef = c.def
      let newMaxHp = c.maxHp
      let newBaseAtk = c.baseAtk
      let newBaseDef = c.baseDef
      let newBaseHp = c.baseHp
      let leveledUp = false

      while (newLevel < 10 && newExp >= expToNextLevel(newLevel)) {
        newExp -= expToNextLevel(newLevel)
        newLevel++
        newAtk += 5
        newDef += 3
        newMaxHp += 5
        newBaseAtk += 5
        newBaseDef += 3
        newBaseHp += 5
        leveledUp = true
      }

      return {
        ...c,
        exp: newExp,
        level: newLevel,
        atk: newAtk,
        def: newDef,
        maxHp: newMaxHp,
        baseAtk: newBaseAtk,
        baseDef: newBaseDef,
        baseHp: newBaseHp,
        hp: leveledUp ? newMaxHp : c.hp,
        leveledUp,
      }
    })
    return { playerParty: party }
  }),

  markSecondWindUsed: () => set({ secondWindUsed: true }),

  advanceBattle: () => set(state => {
    const aliveIdx = state.playerParty.findIndex(c => c.hp > 0)
    return {
      currentBattle: state.currentBattle + 1,
      activeCreatureIndex: aliveIdx >= 0 ? aliveIdx : 0,
      enemyFreeAttack: false,
      extraDamageTaken: 0,
      enemyAtkBonus: 0,
    }
  }),

  resetGame: () => set({
    gamePhase: 'title',
    playerParty: [],
    activeCreatureIndex: 0,
    currentBattle: 1,
    appliedBuffs: [],
    enemyAtkBonus: 0,
    enemyFreeAttack: false,
    extraDamageTaken: 0,
    extraBuffSlot: false,
    secondWindUsed: false,
  }),
}))

export default useGameStore
