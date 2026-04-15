import { motion } from 'framer-motion'
import useGameStore from '../store/gameStore'
import { BUFF_POOL } from '../data/buffs'

export default function WinScreen() {
  const resetGame = useGameStore(s => s.resetGame)
  const playerParty = useGameStore(s => s.playerParty)
  const appliedBuffs = useGameStore(s => s.appliedBuffs)

  const getBuffName = (id) => {
    const buff = BUFF_POOL.find(b => b.id === id)
    return buff ? buff.name : id.replace(/_/g, ' ')
  }

  return (
    <motion.div
      className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-yellow-950/20 via-gray-950 to-gray-950 p-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(234,179,8,0.08),transparent_60%)]" />
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.02, 0.06, 0.02] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl" />
      </motion.div>

      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 8, delay: 0.3 }}
        className="text-7xl md:text-8xl mb-4 relative z-10 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]"
      >
        👑
      </motion.div>
      <motion.h1
        className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 mb-3 relative z-10 font-[var(--font-display)]"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        VICTORY!
      </motion.h1>
      <motion.div
        className="w-24 h-0.5 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent mb-4"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.7 }}
      />
      <motion.p
        className="text-lg text-gray-300 mb-8 text-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        You defeated The Undying Sovereign and conquered the Gauntlet!
      </motion.p>

      <motion.div
        className="flex gap-8 mb-8 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {playerParty.map(c => (
          <motion.div
            key={c.id}
            className="text-center"
            whileHover={{ y: -4 }}
          >
            <img
              src={c.img}
              alt={c.name}
              className="w-24 h-24 md:w-28 md:h-28 object-contain mb-2 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]"
            />
            <p className="text-white font-bold">{c.name}</p>
            <p className="text-sm text-yellow-400 font-semibold">Lv.{c.level}</p>
          </motion.div>
        ))}
      </motion.div>

      {appliedBuffs.length > 0 && (
        <motion.div
          className="mb-8 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p className="text-xs text-gray-600 mb-2 text-center uppercase tracking-wider font-semibold">Buffs Collected</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {appliedBuffs.map(id => (
              <span key={id} className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs text-purple-300 font-medium">
                {getBuffName(id)}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      <motion.button
        className="px-12 py-3.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-lg rounded-2xl shadow-xl shadow-yellow-500/25 transition-all cursor-pointer relative z-10 border border-yellow-300/20"
        onClick={resetGame}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        PLAY AGAIN
      </motion.button>
    </motion.div>
  )
}
