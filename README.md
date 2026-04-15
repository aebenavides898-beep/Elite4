# Creature Gauntlet

A turn-based roguelike creature battle game where you assemble a team of creatures and fight your way through four increasingly difficult trainers to become the ultimate champion.

## Gameplay

1. **Choose Your Starters** — Pick 2 of 3 starter creatures, each with unique types and movesets
2. **Battle Trainers** — Fight through 4 sequential battles against trainers with growing rosters
3. **Level Up** — Your creatures gain experience and grow stronger after each victory
4. **Collect Buffs** — Choose powerful permanent buffs between battles to shape your strategy
5. **Survive Events** — Random events between rounds can help or hinder your run
6. **Defeat the Sovereign** — Take on The Undying Sovereign and their 4 Legendary creatures in the final battle

## Features

- **13 unique creatures** across Fire, Grass, Water, and Legendary types
- **Type advantage system** — Fire > Grass > Water > Fire, with Legendaries immune to type matchups
- **Deep combat mechanics** — accuracy, critical hits, status effects (burn, stun, shields), stat boosts/debuffs, and recoil moves
- **10 collectible buffs** — from stat boosts like Iron Shell (+15 DEF) to run-changing relics like Second Wind (auto-revive)
- **9 random events** — Healing Springs, Ambushes, Cursed Fog, and more keep every run different
- **Weighted enemy AI** — opponents make smart decisions based on type advantages, HP thresholds, and move conditions
- **Smooth animations** — powered by Framer Motion with floating damage numbers, screen shakes, and transition effects

## Trainers

| # | Trainer | Creatures | Style |
|---|---------|-----------|-------|
| 1 | Botanist Rex | 1 | *"Nature always wins."* |
| 2 | Cipher Nova | 2 | *"Calculated. Precise. Inevitable."* |
| 3 | Warden Kael | 3 | *"You've come far. It ends here."* |
| 4 | The Undying Sovereign | 4 (Legendary) | *"You were never meant to reach me."* |

## Starter Creatures

| Creature | Type | HP | ATK | DEF | Role |
|----------|------|----|-----|-----|------|
| Floravyn | Grass | 110 | 55 | 50 | Balanced healer |
| Blazerick | Fire | 100 | 70 | 40 | Glass cannon |
| Tidalhorn | Water | 120 | 50 | 60 | Defensive tank |

## Tech Stack

- **React 19** — UI framework
- **Vite 8** — Build tool with HMR
- **Zustand** — Lightweight state management
- **Tailwind CSS 4** — Utility-first styling
- **Framer Motion** — Animations and transitions

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## License

MIT
