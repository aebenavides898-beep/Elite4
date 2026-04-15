import { motion } from 'framer-motion'
import useGameStore from '../store/gameStore'

export default function TitleScreen() {
  const setPhase = useGameStore(s => s.setPhase)

  return (
    <motion.div
      className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,40,200,0.08),transparent_70%)]" />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-red-600/5 rounded-full blur-3xl" />
      </div>

      <motion.div className="relative z-10 flex flex-col items-center">
        <motion.h1
          className="text-6xl md:text-8xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 mb-2 font-[var(--font-display)]"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          CREATURE
        </motion.h1>
        <motion.h1
          className="text-5xl md:text-7xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-8 font-[var(--font-display)]"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        >
          GAUNTLET
        </motion.h1>
        <motion.div
          className="w-32 h-0.5 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-8"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        />
        <motion.p
          className="text-gray-400 text-base md:text-lg mb-10 text-center px-4 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Choose your creatures. Survive the gauntlet. Defeat the Sovereign.
        </motion.p>
        <motion.button
          className="px-14 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xl font-bold rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all cursor-pointer border border-white/10"
          onClick={() => setPhase('selection')}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          START GAUNTLET
        </motion.button>
        <motion.p
          className="text-gray-600 text-xs mt-6 tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          4 Trainers &middot; 13 Creatures &middot; 1 Champion
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
