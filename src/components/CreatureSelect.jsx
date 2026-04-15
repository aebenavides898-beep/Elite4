import { useState } from 'react'
import { motion } from 'framer-motion'
import useGameStore from '../store/gameStore'
import { STARTERS } from '../data/creatures'

const TYPE_COLORS = {
  Fire: 'border-red-500 shadow-red-500/30',
  Grass: 'border-green-500 shadow-green-500/30',
  Water: 'border-blue-500 shadow-blue-500/30',
}

const TYPE_BG = {
  Fire: 'from-red-900/30 to-red-950/50',
  Grass: 'from-green-900/30 to-green-950/50',
  Water: 'from-blue-900/30 to-blue-950/50',
}

const TYPE_GLOW = {
  Fire: 'drop-shadow-[0_0_20px_rgba(239,68,68,0.3)]',
  Grass: 'drop-shadow-[0_0_20px_rgba(34,197,94,0.3)]',
  Water: 'drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]',
}

export default function CreatureSelect() {
  const [selected, setSelected] = useState([])
  const selectStarters = useGameStore(s => s.selectStarters)

  const toggleSelect = (creature) => {
    if (selected.find(c => c.id === creature.id)) {
      setSelected(selected.filter(c => c.id !== creature.id))
    } else if (selected.length < 2) {
      setSelected([...selected, creature])
    }
  }

  const confirm = () => {
    if (selected.length === 2) selectStarters(selected)
  }

  return (
    <motion.div
      className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-950 via-indigo-950/15 to-gray-950 p-4 relative overflow-hidden"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.06),transparent_60%)]" />

      <h2 className="text-3xl md:text-4xl font-black mb-2 text-white relative z-10 font-[var(--font-display)] tracking-wide">Choose Your Party</h2>
      <p className="text-gray-500 mb-8 relative z-10">Select 2 creatures to bring into the gauntlet</p>

      <div className="flex flex-col md:flex-row gap-5 mb-8 relative z-10">
        {STARTERS.map((creature, i) => {
          const isSelected = selected.find(c => c.id === creature.id)
          return (
            <motion.div
              key={creature.id}
              className={`relative p-5 rounded-2xl border-2 cursor-pointer bg-gradient-to-b ${TYPE_BG[creature.type]} backdrop-blur-sm ${
                isSelected
                  ? `${TYPE_COLORS[creature.type]} shadow-xl`
                  : 'border-gray-700/50 hover:border-gray-500/70'
              } transition-all w-72`}
              onClick={() => toggleSelect(creature)}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -6 }}
            >
              {isSelected && (
                <motion.div
                  className="absolute top-3 right-3 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-green-500/30"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                >
                  ✓
                </motion.div>
              )}
              <img
                src={creature.img}
                alt={creature.name}
                className={`w-32 h-32 mx-auto object-contain mb-3 transition-all ${isSelected ? TYPE_GLOW[creature.type] : ''}`}
              />
              <h3 className="text-xl font-bold text-white mb-1">{creature.name}</h3>
              <TypeBadge type={creature.type} />
              <div className="mt-3 text-sm text-gray-400 space-y-1">
                <StatBar label="HP" value={creature.baseHp} max={130} color="bg-green-500" />
                <StatBar label="ATK" value={creature.baseAtk} max={80} color="bg-red-500" />
                <StatBar label="DEF" value={creature.baseDef} max={70} color="bg-blue-500" />
              </div>
              <div className="mt-3 space-y-1 border-t border-white/5 pt-3">
                {creature.moves.map(m => (
                  <div key={m.name} className="text-xs text-gray-500 flex justify-between">
                    <span>{m.name}</span>
                    <span className="text-gray-400">{m.damage > 0 ? `${m.damage} dmg` : m.heal ? `+${m.heal} HP` : 'Buff'}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.button
        className={`px-12 py-3.5 text-lg font-bold rounded-2xl transition-all cursor-pointer relative z-10 ${
          selected.length === 2
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 border border-white/10'
            : 'bg-gray-900 text-gray-500 cursor-not-allowed border border-gray-800'
        }`}
        onClick={confirm}
        whileHover={selected.length === 2 ? { scale: 1.05, y: -2 } : {}}
        whileTap={selected.length === 2 ? { scale: 0.95 } : {}}
      >
        {selected.length === 2 ? 'BEGIN GAUNTLET' : `Select ${2 - selected.length} more`}
      </motion.button>
    </motion.div>
  )
}

function StatBar({ label, value, max, color }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="flex items-center gap-2">
      <span className="w-8 text-xs text-gray-500 font-semibold">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-xs text-white font-semibold text-right">{value}</span>
    </div>
  )
}

export function TypeBadge({ type }) {
  const colors = {
    Fire: 'bg-red-500/15 text-red-400 border-red-500/30',
    Grass: 'bg-green-500/15 text-green-400 border-green-500/30',
    Water: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    Legendary: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  }
  return (
    <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold border ${colors[type]}`}>
      {type}
    </span>
  )
}
