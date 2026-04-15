import { useState } from 'react'
import { motion } from 'framer-motion'
import useGameStore from '../store/gameStore'
import { getRandomEvents } from '../data/events'

const RISK_COLORS = {
  healing_spring: 'border-green-500/40 hover:border-green-400',
  battle_hardened: 'border-blue-500/40 hover:border-blue-400',
  ancient_relic: 'border-amber-500/40 hover:border-amber-400',
  trainers_rest: 'border-green-500/40 hover:border-green-400',
  lucky_find: 'border-yellow-500/40 hover:border-yellow-400',
  mysterious_herb: 'border-emerald-500/40 hover:border-emerald-400',
  cursed_fog: 'border-red-500/40 hover:border-red-400',
  ambush: 'border-red-500/40 hover:border-red-400',
  double_edge: 'border-orange-500/40 hover:border-orange-400',
}

export default function RandomizerEvent() {
  const { applyEvent, setPhase, playerParty } = useGameStore()
  const [events] = useState(() => getRandomEvents(3))
  const [chosen, setChosen] = useState(null)
  const [choosingCreature, setChoosingCreature] = useState(false)
  const [pendingEvent, setPendingEvent] = useState(null)

  const handlePick = (event) => {
    if (chosen !== null) return

    if (event.needsChoice) {
      setPendingEvent(event)
      setChoosingCreature(true)
      return
    }

    setChosen(event.id)
    const result = event.apply(useGameStore.getState())
    applyEvent(result)
    setTimeout(() => setPhase('buffpick'), 1200)
  }

  const handleCreatureChoice = (idx) => {
    if (!pendingEvent) return
    setChosen(pendingEvent.id)
    setChoosingCreature(false)
    const result = pendingEvent.apply(useGameStore.getState(), idx)
    applyEvent(result)
    setTimeout(() => setPhase('buffpick'), 1200)
  }

  const isNegative = (id) => ['cursed_fog', 'ambush', 'double_edge'].includes(id)

  return (
    <motion.div
      className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-950 via-indigo-950/15 to-gray-950 p-4 relative overflow-hidden"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(99,102,241,0.06),transparent_60%)]" />

      <motion.h2
        className="text-3xl md:text-4xl font-black text-white mb-2 relative z-10 font-[var(--font-display)] tracking-wide"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        A Path Appears...
      </motion.h2>
      <p className="text-gray-500 mb-8 relative z-10">Choose your fate</p>

      {choosingCreature ? (
        <div className="flex flex-col items-center gap-4 relative z-10">
          <p className="text-white text-lg font-semibold">{pendingEvent.name}: Choose a creature to heal</p>
          <div className="flex gap-4">
            {playerParty.map((c, i) => (
              <motion.button
                key={i}
                onClick={() => handleCreatureChoice(i)}
                className="p-5 bg-gray-900/80 border border-gray-700/50 rounded-2xl hover:border-green-500/50 transition-all cursor-pointer backdrop-blur-sm"
                whileHover={{ scale: 1.05, y: -4 }}
              >
                <img src={c.img} alt={c.name} className="w-20 h-20 object-contain mb-2" />
                <p className="text-white font-semibold text-center">{c.name}</p>
                <p className="text-sm text-gray-400 text-center">{c.hp}/{c.maxHp} HP</p>
                <div className="mt-1.5 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${c.hp / c.maxHp > 0.5 ? 'bg-green-500' : c.hp / c.maxHp > 0.25 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${(c.hp / c.maxHp) * 100}%` }} />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 relative z-10">
          {events.map((event, i) => (
            <motion.button
              key={event.id}
              onClick={() => handlePick(event)}
              disabled={chosen !== null}
              className={`p-6 rounded-2xl border-2 w-72 text-left transition-all cursor-pointer backdrop-blur-sm ${
                chosen === event.id
                  ? 'border-yellow-400 bg-yellow-400/10 shadow-xl shadow-yellow-500/20'
                  : chosen !== null
                  ? 'border-gray-800 bg-gray-900/30 opacity-30'
                  : `bg-gray-900/50 ${RISK_COLORS[event.id] || 'border-gray-700/50 hover:border-gray-400'}`
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              whileHover={chosen === null ? { y: -6, scale: 1.02 } : {}}
            >
              <span className="text-3xl mb-3 block">{event.icon}</span>
              <h3 className="text-lg font-bold text-white mb-1">{event.name}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{event.description}</p>
              {isNegative(event.id) && (
                <span className="inline-block mt-3 text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20 font-semibold uppercase tracking-wider">Risk</span>
              )}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  )
}
