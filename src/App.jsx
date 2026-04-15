import { AnimatePresence } from 'framer-motion'
import useGameStore from './store/gameStore'
import TitleScreen from './components/TitleScreen'
import CreatureSelect from './components/CreatureSelect'
import BattleScreen from './components/BattleScreen'
import RandomizerEvent from './components/RandomizerEvent'
import BuffPicker from './components/BuffPicker'
import WinScreen from './components/WinScreen'
import GameOver from './components/GameOver'
import GlitchTransition from './components/GlitchTransition'

const SCREENS = {
  title: TitleScreen,
  selection: CreatureSelect,
  battle: BattleScreen,
  randomizer: RandomizerEvent,
  buffpick: BuffPicker,
  win: WinScreen,
  gameover: GameOver,
  glitch: GlitchTransition,
}

export default function App() {
  const gamePhase = useGameStore(s => s.gamePhase)
  const Screen = SCREENS[gamePhase]

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-950">
      <AnimatePresence mode="wait">
        <Screen key={gamePhase} />
      </AnimatePresence>
    </div>
  )
}
