import { motion } from 'framer-motion'
import useGameStore from '../store/gameStore'
import { OPPONENTS } from '../data/creatures'

export default function GameOver() {
  const resetGame = useGameStore(s => s.resetGame)
  const currentBattle = useGameStore(s => s.currentBattle)
  const trainerName = OPPONENTS[currentBattle - 1]?.trainerName || 'Unknown'

  return (
    <motion.div
      className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-red-950/20 via-gray-950 to-gray-950 p-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.06),transparent_60%)]" />

      <motion.div
        initial={{ rotate: -15, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 8 }}
        className="text-7xl md:text-8xl mb-4 relative z-10"
      >
        💀
      </motion.div>
      <motion.h1
        className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800 mb-3 relative z-10 font-[var(--font-display)]"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        DEFEATED
      </motion.h1>
      <motion.div
        className="w-24 h-0.5 bg-gradient-to-r from-transparent via-red-500/50 to-transparent mb-4"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5 }}
      />
      <motion.p
        className="text-lg text-gray-400 mb-2 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Your creatures fell to {trainerName} in battle {currentBattle}.
      </motion.p>
      <motion.p
        className="text-gray-600 mb-10 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        The Gauntlet claims another challenger...
      </motion.p>

      <motion.button
        className="px-12 py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-red-500/20 transition-all cursor-pointer relative z-10 border border-red-400/10"
        onClick={resetGame}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        TRY AGAIN
      </motion.button>
    </motion.div>
  )
}
