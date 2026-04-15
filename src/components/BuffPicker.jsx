import { useState } from 'react'
import { motion } from 'framer-motion'
import useGameStore from '../store/gameStore'
import { getRandomBuffs, BUFF_POOL } from '../data/buffs'

const BUFF_ICONS = {
  iron_shell: '🛡️',
  battle_fury: '⚔️',
  vital_core: '❤️',
  swift_strike: '⚡',
  vampiric_edge: '🩸',
  fortunes_eye: '🎯',
  elemental_surge: '🔥',
  second_wind: '🌬️',
  focus_shard: '💎',
  berserker_oath: '💀',
}

export default function BuffPicker() {
  const { applyBuff, appliedBuffs, setPhase, advanceBattle, extraBuffSlot } = useGameStore()
  const count = extraBuffSlot ? 4 : 3
  const [buffs] = useState(() => getRandomBuffs(count, appliedBuffs))
  const [chosen, setChosen] = useState(null)

  const handlePick = (buff) => {
    if (chosen !== null) return
    setChosen(buff.id)
    applyBuff(buff)
    setTimeout(() => {
      advanceBattle()
      useGameStore.setState({ extraBuffSlot: false })
      setPhase('battle')
    }, 1200)
  }

  const getBuffName = (id) => {
    const buff = BUFF_POOL.find(b => b.id === id)
    return buff ? buff.name : id.replace(/_/g, ' ')
  }

  return (
    <motion.div
      className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-950 via-purple-950/15 to-gray-950 p-4 relative overflow-hidden"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.06),transparent_60%)]" />

      <motion.h2
        className="text-3xl md:text-4xl font-black text-white mb-2 relative z-10 font-[var(--font-display)] tracking-wide"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Choose a Buff
      </motion.h2>
      <p className="text-gray-500 mb-8 relative z-10">Power up your team for the battles ahead</p>

      <div className="flex flex-col md:flex-row gap-4 relative z-10">
        {buffs.map((buff, i) => (
          <motion.button
            key={buff.id}
            onClick={() => handlePick(buff)}
            disabled={chosen !== null}
            className={`p-6 rounded-2xl border-2 w-64 text-left transition-all cursor-pointer backdrop-blur-sm ${
              chosen === buff.id
                ? 'border-purple-400 bg-purple-400/15 shadow-xl shadow-purple-500/30'
                : chosen !== null
                ? 'border-gray-800 bg-gray-900/30 opacity-30'
                : 'border-gray-700/50 bg-gray-900/50 hover:border-purple-400/60 hover:bg-gray-800/50'
            }`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            whileHover={chosen === null ? { y: -6, scale: 1.02 } : {}}
          >
            <span className="text-2xl mb-2 block">{BUFF_ICONS[buff.id] || '✨'}</span>
            <h3 className="text-lg font-bold text-white mb-1.5">{buff.name}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{buff.description}</p>
          </motion.button>
        ))}
      </div>

      {appliedBuffs.length > 0 && (
        <motion.div
          className="mt-8 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-gray-600 mb-2 text-center uppercase tracking-wider font-semibold">Active Buffs</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {appliedBuffs.map(id => (
              <span key={id} className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs text-purple-300 font-medium">
                {BUFF_ICONS[id] || '✨'} {getBuffName(id)}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
