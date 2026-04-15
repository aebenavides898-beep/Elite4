import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useGameStore from '../store/gameStore'

const GLITCH_MESSAGES = [
  'ERROR: UNEXPECTED ENTITY',
  'BOUNDARY VIOLATION DETECTED',
  'SHE WAS NOT MEANT TO BE HERE',
  'SYSTEM INTEGRITY: FAILING',
  '?????? ??????',
  'DO NOT PROCEED',
  'CONNECTION SEVERED',
  'YOU WERE NEVER MEANT TO REACH THIS FAR',
]

const CORRUPT_CHARS = '█▓▒░╔╗╚╝║═╬▄▀■□▪▫◄►▲▼◊○●◘◙♦♣♠♥'

function corruptText(text) {
  return text
    .split('')
    .map(ch =>
      Math.random() < 0.4
        ? CORRUPT_CHARS[Math.floor(Math.random() * CORRUPT_CHARS.length)]
        : ch
    )
    .join('')
}

function StaticNoise() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = 200
    canvas.height = 200

    let frame
    const draw = () => {
      const imageData = ctx.createImageData(200, 200)
      for (let i = 0; i < imageData.data.length; i += 4) {
        const v = Math.random() * 255
        imageData.data[i] = v
        imageData.data[i + 1] = v
        imageData.data[i + 2] = v
        imageData.data[i + 3] = Math.random() * 60
      }
      ctx.putImageData(imageData, 0, 0)
      frame = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'overlay' }}
    />
  )
}

export default function GlitchTransition() {
  const setPhase = useGameStore(s => s.setPhase)
  const [stage, setStage] = useState(0)
  const [currentMsg, setCurrentMsg] = useState(0)
  const [screenTear, setScreenTear] = useState(false)
  const [blackout, setBlackout] = useState(false)
  const [corruptedTitle, setCorruptedTitle] = useState('WARDEN KAEL DEFEATED')
  const [flashColor, setFlashColor] = useState(null)

  useEffect(() => {
    const timers = []

    // Stage 0: Victory text starts corrupting (0-2s)
    const corruptInterval = setInterval(() => {
      setCorruptedTitle(prev => corruptText('WARDEN KAEL DEFEATED'))
    }, 100)
    timers.push(setTimeout(() => clearInterval(corruptInterval), 6000))

    // Stage 1: Screen tears begin (1s)
    timers.push(setTimeout(() => {
      setStage(1)
      setScreenTear(true)
    }, 1000))

    // Flash red (1.5s)
    timers.push(setTimeout(() => {
      setFlashColor('red')
      setTimeout(() => setFlashColor(null), 100)
    }, 1500))

    // Stage 2: Error messages (2s)
    timers.push(setTimeout(() => setStage(2), 2000))

    // Cycle through messages
    for (let i = 0; i < GLITCH_MESSAGES.length; i++) {
      timers.push(setTimeout(() => {
        setCurrentMsg(i)
        if (i % 2 === 0) {
          setFlashColor(i === 4 ? 'white' : 'red')
          setTimeout(() => setFlashColor(null), 80)
        }
      }, 2500 + i * 600))
    }

    // Stage 3: Heavy corruption + blackout (6.5s)
    timers.push(setTimeout(() => {
      setStage(3)
      setBlackout(true)
    }, 7000))

    // Stage 4: Final reveal text (7.5s)
    timers.push(setTimeout(() => {
      setStage(4)
      setBlackout(false)
    }, 8000))

    // Transition to battle (10s)
    timers.push(setTimeout(() => {
      setPhase('battle')
    }, 10500))

    return () => {
      timers.forEach(clearTimeout)
      clearInterval(corruptInterval)
    }
  }, [setPhase])

  return (
    <motion.div
      className="h-full w-full relative overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <StaticNoise />

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none z-40"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
        }}
      />

      {/* Screen tear effect */}
      <AnimatePresence>
        {screenTear && stage < 3 && (
          <motion.div
            className="absolute inset-0 z-30 pointer-events-none"
            animate={{
              clipPath: [
                'inset(0% 0% 0% 0%)',
                'inset(30% 0% 40% 0%)',
                'inset(0% 0% 0% 0%)',
                'inset(60% 0% 10% 0%)',
                'inset(0% 0% 0% 0%)',
                'inset(15% 0% 70% 0%)',
                'inset(0% 0% 0% 0%)',
              ],
            }}
            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
          >
            <div className="w-full h-full bg-red-900/20" style={{ transform: 'translateX(10px)' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flash overlay */}
      <AnimatePresence>
        {flashColor && (
          <motion.div
            className={`absolute inset-0 z-50 pointer-events-none ${
              flashColor === 'red' ? 'bg-red-600' : 'bg-white'
            }`}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        )}
      </AnimatePresence>

      {/* Blackout */}
      <AnimatePresence>
        {blackout && (
          <motion.div
            className="absolute inset-0 z-50 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Stage 0-1: Corrupting victory text */}
      {stage < 2 && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <motion.h1
            className="text-4xl md:text-6xl font-black text-white font-mono tracking-widest"
            animate={{
              x: stage >= 1 ? [0, -5, 8, -3, 6, -8, 0] : 0,
              skewX: stage >= 1 ? [0, -2, 3, -1, 2, 0] : 0,
            }}
            transition={{ repeat: Infinity, duration: 0.3 }}
          >
            {corruptedTitle}
          </motion.h1>
        </div>
      )}

      {/* Stage 2-3: Error messages */}
      {stage >= 2 && stage < 4 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 gap-4">
          <motion.div
            className="text-red-500 font-mono text-xl md:text-3xl font-bold text-center px-4"
            key={currentMsg}
            initial={{ opacity: 0, scale: 1.5, rotate: Math.random() * 6 - 3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.15 }}
          >
            {GLITCH_MESSAGES[currentMsg]}
          </motion.div>

          {/* Scattered glitch text fragments */}
          {stage >= 2 && Array.from({ length: 6 }).map((_, i) => (
            <motion.span
              key={`frag-${i}-${currentMsg}`}
              className="absolute text-red-900/60 font-mono text-sm"
              style={{
                top: `${15 + Math.random() * 70}%`,
                left: `${5 + Math.random() * 90}%`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0] }}
              transition={{ duration: 0.4, delay: Math.random() * 0.3 }}
            >
              {corruptText('ENTITY_BREACH')}
            </motion.span>
          ))}
        </div>
      )}

      {/* Stage 4: Final ominous reveal */}
      {stage === 4 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <motion.p
              className="text-red-600/80 font-mono text-sm md:text-base tracking-[0.3em] uppercase mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0, 1, 0.6, 1] }}
              transition={{ duration: 2 }}
            >
              Something has broken through
            </motion.p>
            <motion.h1
              className="text-5xl md:text-7xl font-black text-white"
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.5, delay: 0.5 }}
              style={{
                textShadow: '0 0 40px rgba(220, 38, 38, 0.6), 0 0 80px rgba(220, 38, 38, 0.3)',
              }}
            >
              THE UNDYING SOVEREIGN
            </motion.h1>
            <motion.p
              className="text-gray-500 italic text-lg mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              &ldquo;You were never meant to reach me.&rdquo;
            </motion.p>
          </motion.div>

          {/* Pulsing red vignette */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 40%, rgba(127, 29, 29, 0.4) 100%)',
            }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </div>
      )}

      {/* RGB split effect for stages 1-3 */}
      {stage >= 1 && stage < 4 && (
        <>
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none mix-blend-screen"
            animate={{
              x: [0, 3, -3, 2, -2, 0],
              opacity: [0, 0.3, 0.1, 0.3, 0],
            }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          >
            <div className="w-full h-full bg-red-600/10" />
          </motion.div>
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none mix-blend-screen"
            animate={{
              x: [0, -3, 3, -2, 2, 0],
              opacity: [0, 0.3, 0.1, 0.3, 0],
            }}
            transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
          >
            <div className="w-full h-full bg-cyan-600/10" />
          </motion.div>
        </>
      )}
    </motion.div>
  )
}
