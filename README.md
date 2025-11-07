# Indian Road Laws Learning Game

An interactive educational game built with Next.js to help users learn Indian road driving laws through engaging scenarios and quizzes.

## Architecture Overview

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── game/              # Game routes
│   │   ├── page.tsx       # Game lobby
│   │   └── [scenarioId]/  # Individual scenario pages
│   ├── results/           # Results and leaderboard
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── game/             # Game-specific components
│   ├── ui/               # Reusable UI components
│   └── layout/           # Layout components
├── store/                # Zustand state management
│   └── gameStore.ts      # Game state store
├── types/                # TypeScript type definitions
│   └── game.ts           # Game-related types
├── data/                 # Game data and scenarios
│   └── scenarios.ts      # Road law scenarios
└── lib/                  # Utility functions
    └── utils.ts          # Helper functions
```

## Features

- **Interactive Scenarios**: Real-world driving situations with multiple choice questions
- **Progress Tracking**: Track learning progress and scores
- **Level System**: Progressive difficulty levels
- **Immediate Feedback**: Instant feedback on answers with explanations
- **Score System**: Points and achievements
- **Responsive Design**: Works on all devices

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Run the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- **Next.js 16** - React framework with App Router, Turbopack, and PPR
- **React 19** - Latest React with improved performance
- **TypeScript 5.7** - Type safety with latest features
- **Global CSS** - Custom CSS styling with CSS variables
- **Zustand 5** - State management with persistence
- **Framer Motion** - Animations and transitions
- **Lucide React** - Modern icon library
- **pnpm** - Fast, disk space efficient package manager

## Requirements

- **Node.js**: 20.9.0 or later
- **pnpm**: Latest version recommended

## Next.js 16 Features

This project leverages Next.js 16 features:
- **Turbopack**: Faster development builds (enabled by default)
- **Partial Prerendering (PPR)**: Incremental static generation for better performance
- **React 19**: Latest React features and optimizations
- **Enhanced Metadata API**: Improved SEO and social sharing
- **ESLint Flat Config**: Modern ESLint configuration format

