import creature1 from '../assets/img/creature1.png'
import creature2 from '../assets/img/creature2.png'
import creature3 from '../assets/img/creature3.png'
import creature4 from '../assets/img/creature4.png'
import creature5 from '../assets/img/creature5.png'
import creature6 from '../assets/img/creature6.png'
import creature7 from '../assets/img/creature7.png'
import creature8 from '../assets/img/creature8.png'
import creature9 from '../assets/img/creature9.png'
import creature10 from '../assets/img/creature10.png'
import creature11 from '../assets/img/creature11.png'
import creature12 from '../assets/img/creature12.png'
import creature13 from '../assets/img/creature13.png'

export const STARTERS = [
  {
    id: 'floravyn',
    name: 'Floravyn',
    img: creature1,
    type: 'Grass',
    baseHp: 110,
    baseAtk: 55,
    baseDef: 50,
    moves: [
      { name: 'Vine Whip', damage: 40, accuracy: 100, type: 'Grass' },
      { name: 'Petal Storm', damage: 55, accuracy: 90, type: 'Grass' },
      { name: 'Entangle', damage: 30, accuracy: 100, type: 'Grass', effect: 'stun', effectChance: 0.3 },
      { name: 'Bloom Heal', damage: 0, accuracy: 100, type: 'Grass', heal: 30 },
      { name: 'Razor Leaf', damage: 35, accuracy: 100, type: 'Grass', effect: 'defDebuff', effectChance: 0.25, debuffAmount: 0.15 },
      { name: 'Photosynthesis', damage: 0, accuracy: 100, type: 'Grass', heal: 20, effect: 'defBoost', boostAmount: 0.15, boostDuration: 2 },
    ],
  },
  {
    id: 'blazerick',
    name: 'Blazerick',
    img: creature2,
    type: 'Fire',
    baseHp: 100,
    baseAtk: 70,
    baseDef: 40,
    moves: [
      { name: 'Ember Slash', damage: 45, accuracy: 100, type: 'Fire' },
      { name: 'Inferno Roar', damage: 65, accuracy: 85, type: 'Fire' },
      { name: 'Mane Flare', damage: 50, accuracy: 100, type: 'Fire', effect: 'burn', effectChance: 0.2 },
      { name: 'Wild Charge', damage: 80, accuracy: 80, type: 'Fire', effect: 'recoil', recoilPct: 0.2 },
      { name: 'Flame Lash', damage: 35, accuracy: 100, type: 'Fire', effect: 'atkDebuff', effectChance: 0.3, debuffAmount: 0.15 },
      { name: 'Heat Wave', damage: 45, accuracy: 90, type: 'Fire', effect: 'burn', effectChance: 0.35 },
    ],
  },
  {
    id: 'tidalhorn',
    name: 'Tidalhorn',
    img: creature3,
    type: 'Water',
    baseHp: 120,
    baseAtk: 50,
    baseDef: 60,
    moves: [
      { name: 'Aqua Ram', damage: 45, accuracy: 100, type: 'Water' },
      { name: 'Crystal Surge', damage: 55, accuracy: 100, type: 'Water' },
      { name: 'Bubble Barrier', damage: 0, accuracy: 100, type: 'Water', effect: 'shield', shieldAmount: 0.25 },
      { name: 'Tidal Crash', damage: 70, accuracy: 85, type: 'Water' },
      { name: 'Whirlpool', damage: 30, accuracy: 100, type: 'Water', effect: 'stun', effectChance: 0.25 },
      { name: 'Aqua Drain', damage: 40, accuracy: 100, type: 'Water', heal: 15 },
    ],
  },
]

export const OPPONENTS = [
  {
    battle: 1,
    trainerName: 'Botanist Rex',
    tagline: 'Nature always wins.',
    party: [
      {
        id: 'bloomara',
        name: 'Bloomara',
        img: creature4,
        type: 'Grass',
        baseHp: 90,
        baseAtk: 52,
        baseDef: 45,
        moves: [
          { name: 'Orchid Strike', damage: 38, accuracy: 100, type: 'Grass' },
          { name: 'Pollen Burst', damage: 50, accuracy: 85, type: 'Grass' },
          { name: 'Vine Trap', damage: 35, accuracy: 100, type: 'Grass', effect: 'slow', effectChance: 0.25 },
          { name: 'Floral Mend', damage: 0, accuracy: 100, type: 'Grass', heal: 25 },
          { name: 'Thorn Jab', damage: 28, accuracy: 100, type: 'Grass', effect: 'defDebuff', effectChance: 0.2, debuffAmount: 0.1 },
        ],
      },
    ],
  },
  {
    battle: 2,
    trainerName: 'Cipher Nova',
    tagline: 'Calculated. Precise. Inevitable.',
    party: [
      {
        id: 'voltrex',
        name: 'Voltrex',
        img: creature5,
        type: 'Fire',
        baseHp: 95,
        baseAtk: 65,
        baseDef: 38,
        moves: [
          { name: 'Circuit Slash', damage: 42, accuracy: 100, type: 'Fire' },
          { name: 'Plasma Bite', damage: 58, accuracy: 88, type: 'Fire' },
          { name: 'Data Burn', damage: 45, accuracy: 100, type: 'Fire', effect: 'burn', effectChance: 0.25 },
          { name: 'Overclock', damage: 0, accuracy: 100, type: 'Fire', effect: 'atkBoost', boostAmount: 0.2, boostDuration: 3 },
          { name: 'Short Circuit', damage: 55, accuracy: 85, type: 'Fire', effect: 'atkDebuff', effectChance: 0.3, debuffAmount: 0.15 },
        ],
      },
      {
        id: 'bytedrift',
        name: 'Bytedrift',
        img: creature6,
        type: 'Water',
        baseHp: 100,
        baseAtk: 55,
        baseDef: 55,
        moves: [
          { name: 'Neural Sting', damage: 40, accuracy: 100, type: 'Water' },
          { name: 'Pulse Wave', damage: 52, accuracy: 100, type: 'Water' },
          { name: 'Static Veil', damage: 0, accuracy: 100, type: 'Water', effect: 'shield', shieldAmount: 0.3 },
          { name: 'Frequency Shock', damage: 60, accuracy: 80, type: 'Water' },
          { name: 'Data Leech', damage: 35, accuracy: 100, type: 'Water', heal: 15 },
        ],
      },
    ],
  },
  {
    battle: 3,
    trainerName: 'Warden Kael',
    tagline: "You've come far. It ends here.",
    party: [
      {
        id: 'verdantrex',
        name: 'Verdantrex',
        img: creature7,
        type: 'Grass',
        baseHp: 130,
        baseAtk: 65,
        baseDef: 55,
        moves: [
          { name: 'Flora Slam', damage: 55, accuracy: 100, type: 'Grass' },
          { name: 'Bloom Crush', damage: 70, accuracy: 85, type: 'Grass' },
          { name: 'Overgrow', damage: 0, accuracy: 100, type: 'Grass', effect: 'atkBoost', boostAmount: 0.25, condition: 'lowHp' },
          { name: 'Ancient Mend', damage: 0, accuracy: 100, type: 'Grass', heal: 40 },
          { name: 'Root Crush', damage: 45, accuracy: 100, type: 'Grass', effect: 'defDebuff', effectChance: 0.35, debuffAmount: 0.2 },
        ],
      },
      {
        id: 'inferbloom',
        name: 'Inferbloom',
        img: creature8,
        type: 'Fire',
        baseHp: 115,
        baseAtk: 72,
        baseDef: 48,
        moves: [
          { name: 'Ember Eye', damage: 50, accuracy: 100, type: 'Fire' },
          { name: 'Solar Flare', damage: 70, accuracy: 80, type: 'Fire' },
          { name: 'Thorn Burn', damage: 45, accuracy: 100, type: 'Fire', effect: 'burn', effectChance: 0.3 },
          { name: 'Blazing Core', damage: 0, accuracy: 100, type: 'Fire', effect: 'atkBoost', boostAmount: 0.3, oneUse: true },
          { name: 'Eruption', damage: 85, accuracy: 75, type: 'Fire', effect: 'recoil', recoilPct: 0.25 },
        ],
      },
      {
        id: 'wavecrusher',
        name: 'Wavecrusher',
        img: creature9,
        type: 'Water',
        baseHp: 140,
        baseAtk: 60,
        baseDef: 70,
        moves: [
          { name: 'Tide Slam', damage: 52, accuracy: 100, type: 'Water' },
          { name: 'Armored Surge', damage: 65, accuracy: 100, type: 'Water' },
          { name: 'Shell Fortress', damage: 0, accuracy: 100, type: 'Water', effect: 'defBoost', boostAmount: 0.4, boostDuration: 2 },
          { name: 'Crashing Wave', damage: 80, accuracy: 75, type: 'Water' },
          { name: 'Pressure Wave', damage: 40, accuracy: 100, type: 'Water', effect: 'atkDebuff', effectChance: 0.4, debuffAmount: 0.2 },
        ],
      },
    ],
  },
  {
    battle: 4,
    trainerName: 'The Undying Sovereign',
    tagline: 'You were never meant to reach me.',
    party: [
      {
        id: 'wraithstag',
        name: 'Wraithstag',
        img: creature10,
        type: 'Legendary',
        baseHp: 160,
        baseAtk: 70,
        baseDef: 65,
        moves: [
          { name: 'Spectral Gore', damage: 60, accuracy: 100, type: 'Legendary' },
          { name: 'Soul Pierce', damage: 80, accuracy: 85, type: 'Legendary' },
          { name: 'Runic Ward', damage: 0, accuracy: 100, type: 'Legendary', effect: 'shield', shieldAmount: 0.4 },
          { name: 'Ethereal Mend', damage: 0, accuracy: 100, type: 'Legendary', heal: 50 },
          { name: 'Phantom Rend', damage: 55, accuracy: 100, type: 'Legendary', effect: 'defDebuff', effectChance: 0.4, debuffAmount: 0.2 },
          { name: 'Soul Siphon', damage: 45, accuracy: 100, type: 'Legendary', heal: 20 },
        ],
      },
      {
        id: 'auroryx',
        name: 'Auroryx',
        img: creature11,
        type: 'Legendary',
        baseHp: 150,
        baseAtk: 80,
        baseDef: 55,
        moves: [
          { name: 'Prism Strike', damage: 65, accuracy: 100, type: 'Legendary' },
          { name: 'Nova Burst', damage: 85, accuracy: 80, type: 'Legendary' },
          { name: 'Radiant Pulse', damage: 70, accuracy: 100, type: 'Legendary', effect: 'stun', effectChance: 0.2 },
          { name: 'Phoenix Mend', damage: 0, accuracy: 100, type: 'Legendary', heal: 45 },
          { name: 'Blinding Flare', damage: 40, accuracy: 100, type: 'Legendary', effect: 'atkDebuff', effectChance: 0.5, debuffAmount: 0.25 },
        ],
      },
      {
        id: 'nexarach',
        name: 'Nexarach',
        img: creature12,
        type: 'Legendary',
        baseHp: 170,
        baseAtk: 65,
        baseDef: 70,
        moves: [
          { name: 'Void Fang', damage: 58, accuracy: 100, type: 'Legendary' },
          { name: 'Neon Crush', damage: 75, accuracy: 100, type: 'Legendary' },
          { name: 'Web Bind', damage: 0, accuracy: 100, type: 'Legendary', effect: 'stun', effectChance: 0.35 },
          { name: 'Eldritch Drain', damage: 50, accuracy: 100, type: 'Legendary', heal: 25 },
          { name: 'Venomous Bite', damage: 40, accuracy: 100, type: 'Legendary', effect: 'burn', effectChance: 0.35 },
        ],
      },
      {
        id: 'lumivyre',
        name: 'Lumivyre',
        img: creature13,
        type: 'Legendary',
        baseHp: 180,
        baseAtk: 85,
        baseDef: 60,
        moves: [
          { name: 'Dragon Pulse', damage: 70, accuracy: 100, type: 'Legendary' },
          { name: 'Spectrum Blast', damage: 90, accuracy: 78, type: 'Legendary' },
          { name: 'Celestial Mend', damage: 0, accuracy: 100, type: 'Legendary', heal: 60 },
          { name: 'Void Rend', damage: 100, accuracy: 70, type: 'Legendary', effect: 'recoil', recoilPct: 0.15 },
          { name: 'Cosmic Drain', damage: 60, accuracy: 100, type: 'Legendary', heal: 30 },
          { name: 'Star Collapse', damage: 120, accuracy: 65, type: 'Legendary', effect: 'recoil', recoilPct: 0.3 },
        ],
      },
    ],
  },
]

import trainer1 from '../assets/img/trainer1.png'
import trainer2 from '../assets/img/trainer2.png'
import trainer3 from '../assets/img/trainer3.png'
import champion from '../assets/img/champion.png'
import bg1 from '../assets/img/bg1.png.jpg'
import bg2 from '../assets/img/bg2.png'
import bg3 from '../assets/img/bg3.png'
import bg4 from '../assets/img/bg4.png'

export const TRAINER_IMG = [null, trainer1, trainer2, trainer3, champion]
export const BG_IMG = [null, bg1, bg2, bg3, bg4]

export const EXP_PER_BATTLE = [0, 80, 120, 180, 250]

export function expToNextLevel(level) {
  if (level >= 10) return Infinity
  return 50 + level * 50
}

export function getTypeMultiplier(attackerType, defenderType) {
  if (attackerType === 'Legendary' || defenderType === 'Legendary') return 1
  if (attackerType === 'Fire' && defenderType === 'Grass') return 1.5
  if (attackerType === 'Grass' && defenderType === 'Water') return 1.5
  if (attackerType === 'Water' && defenderType === 'Fire') return 1.5
  if (attackerType === 'Fire' && defenderType === 'Water') return 0.75
  if (attackerType === 'Grass' && defenderType === 'Fire') return 0.75
  if (attackerType === 'Water' && defenderType === 'Grass') return 0.75
  return 1
}

export function createBattleCreature(base, level = 1) {
  const lvlBonus = level - 1
  return {
    ...base,
    level,
    exp: 0,
    maxHp: base.baseHp + lvlBonus * 5,
    hp: base.baseHp + lvlBonus * 5,
    atk: base.baseAtk + lvlBonus * 5,
    def: base.baseDef + lvlBonus * 3,
    status: null,
    burnTurns: 0,
    shield: 0,
    atkBoost: 0,
    atkBoostTurns: 0,
    defBoost: 0,
    defBoostTurns: 0,
    stunned: false,
    usedOneUse: [],
    revived: false,
  }
}
