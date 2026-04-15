import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useGameStore from '../store/gameStore'
import { OPPONENTS, BG_IMG, TRAINER_IMG, getTypeMultiplier, createBattleCreature } from '../data/creatures'
import { TypeBadge } from './CreatureSelect'

const MOVE_TYPE_COLORS = {
  Fire: 'from-red-700 to-red-900 hover:from-red-600 hover:to-red-800',
  Grass: 'from-green-700 to-green-900 hover:from-green-600 hover:to-green-800',
  Water: 'from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800',
  Legendary: 'from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800',
}

export default function BattleScreen() {
  const {
    playerParty, activeCreatureIndex, currentBattle, appliedBuffs,
    switchCreature, updatePlayerCreature, setPhase, awardExp,
    enemyAtkBonus, enemyFreeAttack, extraDamageTaken,
    secondWindUsed, markSecondWindUsed,
  } = useGameStore()

  const opponent = OPPONENTS[currentBattle - 1]
  const [enemyParty, setEnemyParty] = useState([])
  const [activeEnemyIndex, setActiveEnemyIndex] = useState(0)
  const [battleLog, setBattleLog] = useState([])
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [showIntro, setShowIntro] = useState(true)
  const [floatingDmg, setFloatingDmg] = useState(null)
  const [enemyFloatingDmg, setEnemyFloatingDmg] = useState(null)
  const [shakePlayer, setShakePlayer] = useState(false)
  const [shakeEnemy, setShakeEnemy] = useState(false)
  const [effectText, setEffectText] = useState(null)
  const [battleOver, setBattleOver] = useState(false)
  const [showSwitch, setShowSwitch] = useState(false)
  const [levelUpMsg, setLevelUpMsg] = useState(null)
  const processingRef = useRef(false)

  const hasBuff = useCallback((id) => appliedBuffs.includes(id), [appliedBuffs])

  useEffect(() => {
    const swiftStrike = appliedBuffs.includes('swift_strike')
    const party = opponent.party.map(c => {
      const bc = createBattleCreature(c)
      if (enemyAtkBonus) bc.atk += enemyAtkBonus
      return bc
    })
    setEnemyParty(party)
    setActiveEnemyIndex(0)
    setBattleLog([])
    setIsPlayerTurn(swiftStrike ? true : !enemyFreeAttack)
    setShowIntro(true)
    setBattleOver(false)
    setShowSwitch(false)
    processingRef.current = false

    const timer = setTimeout(() => setShowIntro(false), 2500)
    return () => clearTimeout(timer)
  }, [currentBattle, opponent, enemyAtkBonus, enemyFreeAttack, appliedBuffs])

  const playerCreature = playerParty[activeCreatureIndex]
  const enemyCreature = enemyParty[activeEnemyIndex]

  const showEffect = useCallback((text) => {
    setEffectText(text)
    setTimeout(() => setEffectText(null), 1500)
  }, [])

  const showDamageNumber = useCallback((amount, isEnemy) => {
    if (isEnemy) {
      setEnemyFloatingDmg(amount)
      setShakeEnemy(true)
      setTimeout(() => { setEnemyFloatingDmg(null); setShakeEnemy(false) }, 800)
    } else {
      setFloatingDmg(amount)
      setShakePlayer(true)
      setTimeout(() => { setFloatingDmg(null); setShakePlayer(false) }, 800)
    }
  }, [])

  const calculateDamage = useCallback((move, attacker, defender, isPlayer) => {
    if (move.damage === 0) return 0

    let accuracy = move.accuracy
    if (isPlayer && hasBuff('focus_shard') && accuracy < 90) accuracy = 90

    const roll = Math.floor(Math.random() * 100) + 1
    if (roll > accuracy) return -1

    let typeMulti = getTypeMultiplier(move.type, defender.type)
    if (isPlayer && hasBuff('elemental_surge') && typeMulti > 1) typeMulti = 1.75

    const effectiveAtk = attacker.atk * (1 + attacker.atkBoost)
    const effectiveDef = defender.def * (1 + defender.defBoost)

    let dmg = Math.round((move.damage * effectiveAtk / Math.max(1, effectiveDef)) * typeMulti)

    if (isPlayer && hasBuff('fortunes_eye') && Math.random() < 0.15) {
      dmg *= 2
      showEffect('CRITICAL HIT!')
    }

    if (defender.shield > 0) {
      dmg = Math.round(dmg * (1 - defender.shield))
    }

    if (!isPlayer && extraDamageTaken > 0) {
      dmg = Math.round(dmg * (1 + extraDamageTaken))
    }

    return Math.max(1, dmg)
  }, [extraDamageTaken, hasBuff, showEffect])

  const checkBattleEnd = useCallback((pParty, eParty) => {
    const allPlayerDead = pParty.every(c => c.hp <= 0)
    const allEnemyDead = eParty.every(c => c.hp <= 0)

    if (allPlayerDead) {
      if (hasBuff('second_wind') && !secondWindUsed) {
        const reviveIdx = pParty.findIndex(c => c.hp <= 0)
        if (reviveIdx !== -1) {
          const target = pParty[reviveIdx]
          const revivedHp = Math.floor(target.maxHp * 0.3)
          updatePlayerCreature(reviveIdx, { hp: revivedHp, revived: true })
          markSecondWindUsed()
          switchCreature(reviveIdx)
          showEffect(`${target.name} revived!`)
          processingRef.current = false
          return false
        }
      }
      setBattleOver(true)
      setTimeout(() => setPhase('gameover'), 2000)
      return true
    }

    if (allEnemyDead) {
      setBattleOver(true)
      awardExp()
      setTimeout(() => {
        const store = useGameStore.getState()
        const leveledCreatures = store.playerParty.filter(c => c.leveledUp)
        if (leveledCreatures.length > 0) {
          const names = leveledCreatures.map(c => c.name).join(' & ')
          const lvl = leveledCreatures[0].level
          setLevelUpMsg(leveledCreatures.length > 1
            ? `${names} leveled up!`
            : `${names} leveled up to Lv.${lvl}!`
          )
          leveledCreatures.forEach(c => {
            const idx = store.playerParty.indexOf(c)
            if (idx !== -1) updatePlayerCreature(idx, { leveledUp: false })
          })
          setTimeout(() => {
            setLevelUpMsg(null)
            if (currentBattle >= 4) setPhase('win')
            else setPhase('randomizer')
          }, 2500)
        } else {
          if (currentBattle >= 4) setPhase('win')
          else setPhase('randomizer')
        }
      }, 1500)
      return true
    }

    return false
  }, [awardExp, currentBattle, hasBuff, secondWindUsed, markSecondWindUsed, setPhase, showEffect, switchCreature, updatePlayerCreature])

  const processEnemyTurn = useCallback(() => {
    if (battleOver || !enemyCreature || enemyCreature.hp <= 0) {
      processingRef.current = false
      return
    }

    setTimeout(() => {
      let ec = { ...enemyCreature }

      if (ec.burnTurns > 0) {
        ec.hp = Math.max(0, ec.hp - 5)
        ec.burnTurns--
        if (ec.burnTurns <= 0) ec.status = null
        setBattleLog(prev => [...prev, `${ec.name} took 5 burn damage!`])
        setEnemyParty(prev => {
          const p = [...prev]
          p[activeEnemyIndex] = ec
          return p
        })
        if (ec.hp <= 0) {
          const updatedEnemyParty = [...enemyParty]
          updatedEnemyParty[activeEnemyIndex] = ec
          const nextAlive = updatedEnemyParty.findIndex((c, i) => i !== activeEnemyIndex && c.hp > 0)
          if (nextAlive === -1) {
            checkBattleEnd(playerParty, updatedEnemyParty)
            processingRef.current = false
          } else {
            setTimeout(() => {
              setActiveEnemyIndex(nextAlive)
              setBattleLog(prev => [...prev, `${opponent.trainerName} sends out ${updatedEnemyParty[nextAlive].name}!`])
              setIsPlayerTurn(true)
              processingRef.current = false
            }, 1000)
          }
          return
        }
      }

      if (ec.atkBoostTurns > 0) {
        ec.atkBoostTurns--
        if (ec.atkBoostTurns <= 0) ec.atkBoost = 0
      }
      if (ec.defBoostTurns > 0) {
        ec.defBoostTurns--
        if (ec.defBoostTurns <= 0) ec.defBoost = 0
      }

      if (ec.stunned) {
        setBattleLog(prev => [...prev, `${ec.name} is stunned and can't move!`])
        setEnemyParty(prev => {
          const p = [...prev]
          p[activeEnemyIndex] = { ...ec, stunned: false }
          return p
        })
        setIsPlayerTurn(true)
        processingRef.current = false
        return
      }

      const pc = playerParty[activeCreatureIndex]
      if (!pc || pc.hp <= 0) {
        processingRef.current = false
        return
      }

      const availableMoves = ec.moves.filter(m => {
        if (m.oneUse && ec.usedOneUse?.includes(m.name)) return false
        if (m.condition === 'lowHp' && ec.hp >= ec.maxHp * 0.5) return false
        return true
      })

      if (availableMoves.length === 0) {
        setIsPlayerTurn(true)
        processingRef.current = false
        return
      }

      const weights = availableMoves.map(m => {
        let w = 1
        if (m.damage > 0) {
          const multi = getTypeMultiplier(m.type, pc.type)
          if (multi > 1) w += 0.3
        }
        if (m.heal && m.damage === 0 && ec.hp < ec.maxHp * 0.4) w += 0.4
        return w
      })
      const total = weights.reduce((a, b) => a + b, 0)
      let rand = Math.random() * total
      let moveIdx = 0
      for (let i = 0; i < weights.length; i++) {
        rand -= weights[i]
        if (rand <= 0) { moveIdx = i; break }
      }
      const move = availableMoves[moveIdx]

      if (move.heal && move.damage === 0) {
        const healed = Math.min(ec.maxHp, ec.hp + move.heal)
        const actualHeal = healed - ec.hp
        setEnemyParty(prev => {
          const p = [...prev]
          p[activeEnemyIndex] = { ...ec, hp: healed }
          return p
        })
        showDamageNumber(`+${actualHeal}`, true)
        setBattleLog(prev => [...prev, `${ec.name} used ${move.name} and healed ${actualHeal} HP!`])
        setIsPlayerTurn(true)
        processingRef.current = false
        return
      }

      if (move.effect === 'atkBoost' && move.damage === 0) {
        const newEc = {
          ...ec,
          atkBoost: ec.atkBoost + (move.boostAmount || 0.2),
          atkBoostTurns: move.boostDuration || 99,
        }
        if (move.oneUse) newEc.usedOneUse = [...(ec.usedOneUse || []), move.name]
        setEnemyParty(prev => {
          const p = [...prev]
          p[activeEnemyIndex] = newEc
          return p
        })
        setBattleLog(prev => [...prev, `${ec.name} used ${move.name} and boosted ATK!`])
        showEffect('ATK Up!')
        setIsPlayerTurn(true)
        processingRef.current = false
        return
      }

      if (move.effect === 'defBoost' && move.damage === 0) {
        setEnemyParty(prev => {
          const p = [...prev]
          p[activeEnemyIndex] = {
            ...ec,
            defBoost: ec.defBoost + (move.boostAmount || 0.2),
            defBoostTurns: move.boostDuration || 2,
          }
          return p
        })
        setBattleLog(prev => [...prev, `${ec.name} used ${move.name} and boosted DEF!`])
        showEffect('DEF Up!')
        setIsPlayerTurn(true)
        processingRef.current = false
        return
      }

      if (move.effect === 'shield' && move.damage === 0) {
        setEnemyParty(prev => {
          const p = [...prev]
          p[activeEnemyIndex] = { ...ec, shield: move.shieldAmount }
          return p
        })
        setBattleLog(prev => [...prev, `${ec.name} used ${move.name} and raised a shield!`])
        setIsPlayerTurn(true)
        processingRef.current = false
        return
      }

      if (move.effect === 'stun' && move.damage === 0) {
        const chance = move.effectChance || 0.35
        if (Math.random() < chance) {
          updatePlayerCreature(activeCreatureIndex, { stunned: true })
          setBattleLog(prev => [...prev, `${ec.name} used ${move.name} — ${pc.name} can't move next turn!`])
        } else {
          setBattleLog(prev => [...prev, `${ec.name} used ${move.name} but it failed!`])
        }
        setIsPlayerTurn(true)
        processingRef.current = false
        return
      }

      const dmg = calculateDamage(move, ec, pc, false)

      if (dmg === -1) {
        setBattleLog(prev => [...prev, `${ec.name} used ${move.name} but missed!`])
        showEffect('MISS!')
        setIsPlayerTurn(true)
        processingRef.current = false
        return
      }

      const typeMulti = getTypeMultiplier(move.type, pc.type)
      if (typeMulti > 1) showEffect('Super Effective!')
      else if (typeMulti < 1) showEffect('Not very effective...')

      const newHp = Math.max(0, pc.hp - dmg)
      const updatedPc = { ...pc, hp: newHp, shield: 0 }

      if (move.effect === 'burn' && Math.random() < (move.effectChance || 0.2)) {
        updatedPc.status = 'burn'
        updatedPc.burnTurns = 3
        setBattleLog(prev => [...prev, `${pc.name} was burned!`])
      }
      if (move.effect === 'stun' && Math.random() < (move.effectChance || 0.3)) {
        updatedPc.stunned = true
        setBattleLog(prev => [...prev, `${pc.name} was stunned!`])
      }
      if (move.effect === 'atkDebuff' && Math.random() < (move.effectChance || 0.3)) {
        updatedPc.atkBoost = Math.max(-0.5, (updatedPc.atkBoost || 0) - (move.debuffAmount || 0.15))
        setBattleLog(prev => [...prev, `${pc.name}'s ATK fell!`])
      }
      if (move.effect === 'defDebuff' && Math.random() < (move.effectChance || 0.3)) {
        updatedPc.defBoost = Math.max(-0.5, (updatedPc.defBoost || 0) - (move.debuffAmount || 0.15))
        setBattleLog(prev => [...prev, `${pc.name}'s DEF fell!`])
      }

      if (move.heal && move.damage > 0) {
        const healAmt = move.heal
        const newEcHp = Math.min(ec.maxHp, ec.hp + healAmt)
        ec = { ...ec, hp: newEcHp }
        setEnemyParty(prev => {
          const p = [...prev]
          p[activeEnemyIndex] = ec
          return p
        })
        setBattleLog(prev => [...prev, `${ec.name} drained ${healAmt} HP!`])
      }

      if (move.effect === 'recoil' && move.recoilPct) {
        const recoilDmg = Math.floor(dmg * move.recoilPct)
        ec = { ...ec, hp: Math.max(0, ec.hp - recoilDmg) }
        setEnemyParty(prev => {
          const p = [...prev]
          p[activeEnemyIndex] = ec
          return p
        })
        setBattleLog(prev => [...prev, `${ec.name} took ${recoilDmg} recoil damage!`])
      }

      updatePlayerCreature(activeCreatureIndex, updatedPc)
      showDamageNumber(dmg, false)
      setBattleLog(prev => [...prev, `${ec.name} used ${move.name} for ${dmg} damage!`])

      const updatedParty = [...playerParty]
      updatedParty[activeCreatureIndex] = updatedPc

      if (newHp <= 0) {
        setBattleLog(prev => [...prev, `${pc.name} fainted!`])
        const nextAlive = updatedParty.findIndex((c, i) => i !== activeCreatureIndex && c.hp > 0)
        if (nextAlive !== -1) {
          setTimeout(() => {
            switchCreature(nextAlive)
            setIsPlayerTurn(true)
            processingRef.current = false
          }, 1000)
          return
        }
      }

      if (!checkBattleEnd(updatedParty, enemyParty)) {
        setIsPlayerTurn(true)
        processingRef.current = false
      }
    }, 1200)
  }, [battleOver, enemyCreature, playerParty, activeCreatureIndex, activeEnemyIndex,
      calculateDamage, showDamageNumber, showEffect, updatePlayerCreature,
      switchCreature, checkBattleEnd, enemyParty, opponent.trainerName])

  useEffect(() => {
    if (!isPlayerTurn && !battleOver && !showIntro && enemyCreature && !processingRef.current) {
      processingRef.current = true
      processEnemyTurn()
    }
  }, [isPlayerTurn, battleOver, showIntro, enemyCreature, processEnemyTurn])

  const handlePlayerMove = (move) => {
    if (!isPlayerTurn || battleOver || showIntro) return
    if (!playerCreature || playerCreature.hp <= 0) return

    const pc = { ...playerCreature }

    if (pc.burnTurns > 0) {
      pc.hp = Math.max(0, pc.hp - 5)
      pc.burnTurns--
      if (pc.burnTurns <= 0) pc.status = null
      updatePlayerCreature(activeCreatureIndex, { hp: pc.hp, burnTurns: pc.burnTurns, status: pc.status })
      setBattleLog(prev => [...prev, `${pc.name} took 5 burn damage!`])
      if (pc.hp <= 0) {
        setBattleLog(prev => [...prev, `${pc.name} fainted from burn!`])
        const updatedParty = [...playerParty]
        updatedParty[activeCreatureIndex] = { ...pc, hp: 0 }
        const nextAlive = updatedParty.findIndex((c, i) => i !== activeCreatureIndex && c.hp > 0)
        if (nextAlive !== -1) {
          setTimeout(() => switchCreature(nextAlive), 800)
        } else {
          checkBattleEnd(updatedParty, enemyParty)
        }
        return
      }
    }

    if (pc.stunned) {
      setBattleLog(prev => [...prev, `${pc.name} is stunned and can't move!`])
      updatePlayerCreature(activeCreatureIndex, { stunned: false })
      setIsPlayerTurn(false)
      return
    }

    if (pc.atkBoostTurns > 0) {
      const newTurns = pc.atkBoostTurns - 1
      if (newTurns <= 0) {
        updatePlayerCreature(activeCreatureIndex, { atkBoost: 0, atkBoostTurns: 0 })
        pc.atkBoost = 0
      } else {
        updatePlayerCreature(activeCreatureIndex, { atkBoostTurns: newTurns })
      }
    }
    if (pc.defBoostTurns > 0) {
      const newTurns = pc.defBoostTurns - 1
      if (newTurns <= 0) {
        updatePlayerCreature(activeCreatureIndex, { defBoost: 0, defBoostTurns: 0 })
        pc.defBoost = 0
      } else {
        updatePlayerCreature(activeCreatureIndex, { defBoostTurns: newTurns })
      }
    }

    if (move.heal && move.damage === 0) {
      const healed = Math.min(pc.maxHp, pc.hp + move.heal)
      const actualHeal = healed - pc.hp
      updatePlayerCreature(activeCreatureIndex, { hp: healed })
      showDamageNumber(`+${actualHeal}`, false)
      setBattleLog(prev => [...prev, `${pc.name} used ${move.name} and healed ${actualHeal} HP!`])
      setIsPlayerTurn(false)
      return
    }

    if (move.effect === 'shield' && move.damage === 0) {
      updatePlayerCreature(activeCreatureIndex, { shield: move.shieldAmount })
      setBattleLog(prev => [...prev, `${pc.name} used ${move.name} and raised a shield!`])
      showEffect('Shield Up!')
      setIsPlayerTurn(false)
      return
    }

    if (move.effect === 'atkBoost' && move.damage === 0) {
      updatePlayerCreature(activeCreatureIndex, {
        atkBoost: pc.atkBoost + (move.boostAmount || 0.2),
        atkBoostTurns: move.boostDuration || 3,
      })
      setBattleLog(prev => [...prev, `${pc.name} used ${move.name} and boosted ATK!`])
      showEffect('ATK Up!')
      setIsPlayerTurn(false)
      return
    }

    if (move.effect === 'defBoost' && move.damage === 0) {
      updatePlayerCreature(activeCreatureIndex, {
        defBoost: pc.defBoost + (move.boostAmount || 0.2),
        defBoostTurns: move.boostDuration || 2,
      })
      setBattleLog(prev => [...prev, `${pc.name} used ${move.name} and boosted DEF!`])
      showEffect('DEF Up!')
      setIsPlayerTurn(false)
      return
    }

    const dmg = calculateDamage(move, pc, enemyCreature, true)

    if (dmg === -1) {
      setBattleLog(prev => [...prev, `${pc.name} used ${move.name} but missed!`])
      showEffect('MISS!')
      setIsPlayerTurn(false)
      return
    }

    const typeMulti = getTypeMultiplier(move.type, enemyCreature.type)
    if (typeMulti > 1) showEffect('Super Effective!')
    else if (typeMulti < 1) showEffect('Not very effective...')

    const newEnemyHp = Math.max(0, enemyCreature.hp - dmg)
    const updatedEnemy = { ...enemyCreature, hp: newEnemyHp, shield: 0 }

    if (move.effect === 'burn' && Math.random() < (move.effectChance || 0.2)) {
      updatedEnemy.status = 'burn'
      updatedEnemy.burnTurns = 3
      setBattleLog(prev => [...prev, `${enemyCreature.name} was burned!`])
    }
    if (move.effect === 'stun' && Math.random() < (move.effectChance || 0.3)) {
      updatedEnemy.stunned = true
      setBattleLog(prev => [...prev, `${enemyCreature.name} was stunned!`])
    }
    if (move.effect === 'slow' && Math.random() < (move.effectChance || 0.25)) {
      updatedEnemy.stunned = true
      setBattleLog(prev => [...prev, `${enemyCreature.name} was slowed!`])
    }

    if (hasBuff('vampiric_edge') && dmg > 0) {
      const vampHeal = Math.floor(dmg * 0.1)
      if (vampHeal > 0) {
        const newPcHp = Math.min(pc.maxHp, pc.hp + vampHeal)
        updatePlayerCreature(activeCreatureIndex, { hp: newPcHp })
      }
    }

    setEnemyParty(prev => {
      const p = [...prev]
      p[activeEnemyIndex] = updatedEnemy
      return p
    })
    showDamageNumber(dmg, true)
    setBattleLog(prev => [...prev, `${pc.name} used ${move.name} for ${dmg} damage!`])

    if (newEnemyHp <= 0) {
      const updatedEnemyParty = [...enemyParty]
      updatedEnemyParty[activeEnemyIndex] = updatedEnemy

      const nextAliveEnemy = updatedEnemyParty.findIndex((c, i) => i !== activeEnemyIndex && c.hp > 0)
      if (nextAliveEnemy === -1) {
        checkBattleEnd(playerParty, updatedEnemyParty)
        return
      }
      setBattleLog(prev => [...prev, `${enemyCreature.name} fainted!`])
      setTimeout(() => {
        setActiveEnemyIndex(nextAliveEnemy)
        setBattleLog(prev => [...prev, `${opponent.trainerName} sends out ${updatedEnemyParty[nextAliveEnemy].name}!`])
        setIsPlayerTurn(true)
      }, 1000)
      return
    }

    setIsPlayerTurn(false)
  }

  const handleSwitch = (idx) => {
    if (idx === activeCreatureIndex) return
    if (playerParty[idx].hp <= 0) return
    switchCreature(idx)
    setShowSwitch(false)
    setBattleLog(prev => [...prev, `Switched to ${playerParty[idx].name}!`])
    setIsPlayerTurn(false)
  }

  if (!enemyCreature || !playerCreature) return null

  const bgImg = BG_IMG[currentBattle]
  const trainerImg = TRAINER_IMG[currentBattle]
  const playerHpPct = (playerCreature.hp / playerCreature.maxHp) * 100
  const enemyHpPct = (enemyCreature.hp / enemyCreature.maxHp) * 100

  const hpColor = (pct) =>
    pct > 50 ? 'bg-green-500' : pct > 25 ? 'bg-yellow-500' : 'bg-red-500'
  const hpGlow = (pct) =>
    pct > 50 ? 'shadow-green-500/40' : pct > 25 ? 'shadow-yellow-500/40' : 'shadow-red-500/40'

  return (
    <motion.div
      className="h-full flex flex-col relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${bgImg})`, filter: 'brightness(0.7) saturate(1.2)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50" />

      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
            <motion.img
              src={trainerImg}
              alt={opponent.trainerName}
              className="w-36 h-36 md:w-44 md:h-44 object-contain mb-6 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 10 }}
            />
            <motion.h2
              className="text-3xl md:text-5xl font-black text-white mb-2 tracking-wide font-[var(--font-display)]"
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {opponent.trainerName}
            </motion.h2>
            <motion.p
              className="text-gray-300 italic text-lg md:text-xl"
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              &ldquo;{opponent.tagline}&rdquo;
            </motion.p>
            <motion.div
              className="mt-6 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <span className="text-xs text-gray-500 uppercase tracking-widest">Battle {currentBattle} of 4</span>
              <span className="text-gray-600">|</span>
              <span className="text-xs text-gray-500">{opponent.party.length} creature{opponent.party.length > 1 ? 's' : ''}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Enemy side */}
        <div className="flex justify-end items-start p-3 md:p-4 gap-3">
          <div className="bg-gray-950/70 backdrop-blur-md rounded-xl p-3 min-w-48 md:min-w-56 border border-white/5">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-bold text-white text-sm md:text-base">{enemyCreature.name}</span>
              <TypeBadge type={enemyCreature.type} />
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex-1 h-2.5 bg-gray-800 rounded-full overflow-hidden shadow-inner`}>
                <motion.div
                  className={`h-full ${hpColor(enemyHpPct)} rounded-full shadow-md ${hpGlow(enemyHpPct)}`}
                  animate={{ width: `${Math.max(0, enemyHpPct)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-xs text-gray-400 min-w-[4rem] text-right font-mono">{Math.max(0, enemyCreature.hp)}/{enemyCreature.maxHp}</span>
            </div>
            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
              {enemyCreature.status === 'burn' && <span className="text-[10px] text-orange-400 bg-orange-500/15 px-1.5 py-0.5 rounded-md border border-orange-500/20">BRN</span>}
              {enemyCreature.shield > 0 && <span className="text-[10px] text-cyan-400 bg-cyan-500/15 px-1.5 py-0.5 rounded-md border border-cyan-500/20">SHD</span>}
              {enemyCreature.atkBoost > 0 && <span className="text-[10px] text-red-400 bg-red-500/15 px-1.5 py-0.5 rounded-md border border-red-500/20">ATK+</span>}
              {enemyCreature.defBoost > 0 && <span className="text-[10px] text-blue-400 bg-blue-500/15 px-1.5 py-0.5 rounded-md border border-blue-500/20">DEF+</span>}
            </div>
            <div className="flex items-center gap-1 mt-1.5">
              {opponent.party.map((_, i) => (
                <span key={i} className={`inline-block w-2.5 h-2.5 rounded-full ${
                  enemyParty[i]?.hp > 0 ? 'bg-red-500 shadow-sm shadow-red-500/50' : 'bg-gray-700'
                }`} />
              ))}
            </div>
          </div>
          <div className="relative">
            <motion.img
              src={enemyCreature.img}
              alt={enemyCreature.name}
              className="w-28 h-28 md:w-44 md:h-44 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              animate={shakeEnemy ? { x: [0, -12, 12, -12, 8, -4, 0] } : {}}
              transition={{ duration: 0.4 }}
            />
            {enemyCreature.status === 'burn' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-orange-500/30 to-transparent rounded-full pointer-events-none"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              />
            )}
            <AnimatePresence>
              {enemyFloatingDmg && (
                <motion.span
                  className={`absolute top-0 left-1/2 -translate-x-1/2 text-2xl md:text-3xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${
                    String(enemyFloatingDmg).startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}
                  initial={{ y: 0, opacity: 1, scale: 1.4 }}
                  animate={{ y: -55, opacity: 0, scale: 0.7 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9 }}
                >
                  {String(enemyFloatingDmg).startsWith('+') ? enemyFloatingDmg : `-${enemyFloatingDmg}`}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Effect text */}
        <AnimatePresence>
          {effectText && (
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.3, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', damping: 8 }}
            >
              <span className="text-2xl md:text-4xl font-black text-yellow-300 drop-shadow-[0_0_25px_rgba(250,204,21,0.9)] tracking-wider">
                {effectText}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Level up */}
        <AnimatePresence>
          {levelUpMsg && (
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 8 }}
            >
              <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black px-8 py-4 rounded-2xl font-bold text-xl md:text-2xl shadow-2xl shadow-yellow-500/50 border border-yellow-300/50">
                LEVEL UP!
                <div className="text-sm font-semibold mt-1 opacity-80">{levelUpMsg}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1" />

        {/* Player side */}
        <div className="flex items-end p-3 md:p-4 gap-3">
          <div className="relative">
            <motion.img
              src={playerCreature.img}
              alt={playerCreature.name}
              className="w-28 h-28 md:w-44 md:h-44 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              animate={shakePlayer ? { x: [0, -12, 12, -12, 8, -4, 0] } : {}}
              transition={{ duration: 0.4 }}
            />
            {playerCreature.status === 'burn' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-orange-500/30 to-transparent rounded-full pointer-events-none"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              />
            )}
            <AnimatePresence>
              {floatingDmg && (
                <motion.span
                  className={`absolute top-0 left-1/2 -translate-x-1/2 text-2xl md:text-3xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${
                    String(floatingDmg).startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}
                  initial={{ y: 0, opacity: 1, scale: 1.4 }}
                  animate={{ y: -55, opacity: 0, scale: 0.7 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9 }}
                >
                  {String(floatingDmg).startsWith('+') ? floatingDmg : `-${floatingDmg}`}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="bg-gray-950/70 backdrop-blur-md rounded-xl p-3 min-w-48 md:min-w-56 border border-white/5">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-bold text-white text-sm md:text-base">{playerCreature.name}</span>
              <TypeBadge type={playerCreature.type} />
              <span className="text-xs text-yellow-400 font-bold bg-yellow-400/10 px-1.5 py-0.5 rounded">Lv.{playerCreature.level}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2.5 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  className={`h-full ${hpColor(playerHpPct)} rounded-full shadow-md ${hpGlow(playerHpPct)}`}
                  animate={{ width: `${Math.max(0, playerHpPct)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-xs text-gray-400 min-w-[4rem] text-right font-mono">{Math.max(0, playerCreature.hp)}/{playerCreature.maxHp}</span>
            </div>
            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
              {playerCreature.status === 'burn' && <span className="text-[10px] text-orange-400 bg-orange-500/15 px-1.5 py-0.5 rounded-md border border-orange-500/20">BRN</span>}
              {playerCreature.shield > 0 && <span className="text-[10px] text-cyan-400 bg-cyan-500/15 px-1.5 py-0.5 rounded-md border border-cyan-500/20">SHD</span>}
              {playerCreature.atkBoost > 0 && <span className="text-[10px] text-red-400 bg-red-500/15 px-1.5 py-0.5 rounded-md border border-red-500/20">ATK+</span>}
              {playerCreature.defBoost > 0 && <span className="text-[10px] text-blue-400 bg-blue-500/15 px-1.5 py-0.5 rounded-md border border-blue-500/20">DEF+</span>}
            </div>
            {/* EXP bar */}
            <div className="mt-1.5">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-500 font-semibold">EXP</span>
                <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300"
                    style={{ width: `${playerCreature.level >= 10 ? 100 : (playerCreature.exp / (50 + playerCreature.level * 50)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-1.5">
              {playerParty.map((c, i) => (
                <span key={i} className={`inline-block w-2.5 h-2.5 rounded-full ${
                  c.hp > 0 ? 'bg-green-500 shadow-sm shadow-green-500/50' : 'bg-gray-700'
                }`} />
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="relative z-10 bg-gray-950/90 backdrop-blur-md border-t border-white/5 p-3">
          {showSwitch ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-400 font-semibold">Switch to:</p>
              <div className="flex gap-2">
                {playerParty.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => handleSwitch(i)}
                    disabled={c.hp <= 0 || i === activeCreatureIndex}
                    className={`flex-1 p-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                      c.hp <= 0 ? 'bg-gray-900 text-gray-600 border border-gray-800' :
                      i === activeCreatureIndex ? 'bg-gray-800 text-gray-400 border border-gray-700' :
                      'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <img src={c.img} alt={c.name} className="w-8 h-8 object-contain" />
                    <div className="text-left">
                      <div>{c.name}</div>
                      <div className="text-xs text-gray-400">{c.hp}/{c.maxHp} HP</div>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => setShowSwitch(false)} className="text-sm text-gray-500 hover:text-white cursor-pointer transition-colors">Cancel</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {playerCreature.moves.map((move) => {
                  const typeGrad = MOVE_TYPE_COLORS[move.type] || MOVE_TYPE_COLORS.Legendary
                  return (
                    <motion.button
                      key={move.name}
                      onClick={() => handlePlayerMove(move)}
                      disabled={!isPlayerTurn || battleOver}
                      className={`p-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${
                        !isPlayerTurn || battleOver
                          ? 'bg-gray-900 text-gray-600 border-gray-800'
                          : `bg-gradient-to-r ${typeGrad} text-white active:scale-95 shadow-lg border-white/10`
                      }`}
                      whileTap={isPlayerTurn && !battleOver ? { scale: 0.93 } : {}}
                    >
                      <div className="flex items-center justify-between">
                        <span>{move.name}</span>
                      </div>
                      <div className="text-xs opacity-70 mt-0.5">
                        {move.damage > 0 ? `${move.damage} dmg` : move.heal ? `+${move.heal} HP` : 'Buff'}
                        {move.accuracy < 100 && ` · ${move.accuracy}%`}
                        {move.effect === 'burn' && ' · Burn'}
                        {move.effect === 'stun' && ' · Stun'}
                        {move.effect === 'slow' && ' · Slow'}
                      </div>
                    </motion.button>
                  )
                })}
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setShowSwitch(true)}
                  disabled={!isPlayerTurn || battleOver}
                  className="text-sm text-blue-400 hover:text-blue-300 disabled:text-gray-600 cursor-pointer font-semibold transition-colors"
                >
                  Switch Creature
                </button>
                <div className="flex items-center gap-3">
                  {appliedBuffs.length > 0 && (
                    <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">{appliedBuffs.length} buff{appliedBuffs.length > 1 ? 's' : ''}</span>
                  )}
                  <span className={`text-sm font-bold ${battleOver ? 'text-white' : isPlayerTurn ? 'text-green-400' : 'text-yellow-400 animate-pulse'}`}>
                    {battleOver ? 'Battle Over!' : isPlayerTurn ? 'Your turn' : 'Enemy turn...'}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Battle log */}
        <div className="relative z-10 bg-black/80 p-2.5 h-[4.5rem] overflow-y-auto border-t border-white/5">
          {battleLog.slice(-3).map((msg, i) => (
            <motion.p
              key={`${battleLog.length}-${i}`}
              className="text-xs text-gray-400 leading-relaxed"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {msg}
            </motion.p>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
