# Architecture Documentation

## Overview

This is a frontend-only interactive educational game built with Next.js 16 (App Router) to help users learn Indian road driving laws through engaging scenarios and quizzes.

## Technology Stack

- **Framework**: Next.js 16 with App Router, Turbopack, and PPR
- **Language**: TypeScript 5.7
- **React**: React 19
- **Styling**: Global CSS with custom utility classes and CSS variables
- **State Management**: Zustand 5 with persistence
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Package Manager**: pnpm
- **Node.js**: 20.9.0 or later

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with navigation
│   ├── page.tsx                 # Home/Landing page
│   ├── globals.css              # Global styles
│   ├── game/                    # Game routes
│   │   ├── page.tsx             # Scenario selection page
│   │   └── [scenarioId]/        # Dynamic scenario routes
│   │       ├── page.tsx         # Gameplay page
│   │       └── results/         # Results page
│   │           └── page.tsx
│   ├── results/                 # Overall results/statistics
│   │   └── page.tsx
│   └── stats/                   # Detailed statistics
│       └── page.tsx
│
├── components/                  # React components
│   ├── game/                   # Game-specific components
│   │   ├── ScenarioCard.tsx    # Scenario selection card
│   │   ├── QuestionCard.tsx     # Question display and interaction
│   │   ├── ProgressTracker.tsx  # Progress visualization
│   │   └── ScoreDisplay.tsx     # Score and results display
│   ├── ui/                     # Reusable UI components
│   │   ├── Button.tsx          # Button component
│   │   ├── Card.tsx            # Card container
│   │   └── Badge.tsx           # Badge component
│   └── layout/                 # Layout components
│       └── Navigation.tsx      # Main navigation bar
│
├── store/                      # State management
│   └── gameStore.ts            # Zustand store for game state
│
├── types/                      # TypeScript definitions
│   └── game.ts                 # Game-related types
│
├── data/                       # Game data
│   └── scenarios.ts            # Scenario and question data
│
└── lib/                        # Utility functions
    └── utils.ts                # Helper functions
```

## Architecture Patterns

### 1. State Management (Zustand)

The game uses Zustand for state management with persistence:

- **Game State**: Current scenario, question index, selected answers
- **Progress Tracking**: Completed scenarios, scores, time spent
- **User Statistics**: Overall performance, category progress, achievements
- **Persistence**: User progress is saved to localStorage

**Key Store Methods**:
- `startScenario()`: Initialize a new scenario
- `selectAnswer()`: Select an answer option
- `submitAnswer()`: Submit and validate answer
- `completeScenario()`: Finalize scenario and update stats
- `calculateScore()`: Compute current score

### 2. Component Architecture

#### UI Components (`components/ui/`)
Reusable, styled components following a design system:
- **Button**: Multiple variants (primary, secondary, danger, success, outline)
- **Card**: Container with elevation variants
- **Badge**: Status indicators with color variants

#### Game Components (`components/game/`)
Specialized components for game functionality:
- **ScenarioCard**: Displays scenario info and allows selection
- **QuestionCard**: Interactive question with answer options
- **ProgressTracker**: Visual progress indicator
- **ScoreDisplay**: Results visualization

### 3. Data Model

#### Scenario Structure
```typescript
Scenario {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  questions: Question[]
  category: string
  tags: string[]
  estimatedTime: number
}
```

#### Question Structure
```typescript
Question {
  id: string
  type: 'multiple-choice' | 'true-false' | 'scenario-based'
  question: string
  options: AnswerOption[]
  points: number
  category: string
  lawReference?: string
}
```

### 4. Routing Strategy

Using Next.js App Router:
- **Static Routes**: `/`, `/game`, `/results`, `/stats`
- **Dynamic Routes**: `/game/[scenarioId]` for individual scenarios
- **Nested Routes**: `/game/[scenarioId]/results` for scenario results

### 5. User Flow

1. **Home Page** (`/`): Introduction and feature overview
2. **Scenario Selection** (`/game`): Browse and filter scenarios
3. **Gameplay** (`/game/[scenarioId]`): Interactive question-answer flow
4. **Results** (`/game/[scenarioId]/results`): Scenario-specific results
5. **Statistics** (`/results`, `/stats`): Overall performance tracking

## Key Features

### Interactive Learning
- Real-world driving scenarios
- Multiple choice questions with immediate feedback
- Explanations for each answer
- Legal references to Indian traffic laws

### Progress Tracking
- Score calculation per scenario
- Category-based progress tracking
- Time tracking
- Completion status

### User Experience
- Smooth animations with Framer Motion
- Responsive design (mobile-first)
- Visual progress indicators
- Clear feedback on answers

## State Persistence

User progress is persisted using Zustand's persist middleware:
- Completed scenarios
- User statistics
- Category progress

Data is stored in browser localStorage, allowing users to resume their learning across sessions.

## Styling Approach

- **Global CSS**: Custom CSS file with utility classes
- **CSS Variables**: Color system using CSS custom properties
- **Custom Theme**: Primary, success, danger, and other color palettes
- **Animations**: Custom keyframes for fade-in, slide-up, bounce-in
- **Responsive**: Mobile-first responsive design with media queries

## Future Enhancements

Potential additions:
- User authentication
- Leaderboards
- Achievement system
- More scenarios and questions
- Difficulty progression
- Study mode vs. quiz mode
- Image/video support for scenarios
- Multi-language support

## Performance Considerations

- **Turbopack**: Next.js 16's default bundler for faster development builds
- **Partial Prerendering (PPR)**: Incremental static generation for instant page loads
- **Code Splitting**: Next.js automatic code splitting with React 19 optimizations
- **Image Optimization**: Next.js Image component (when images are added)
- **State Optimization**: Zustand's selective subscriptions
- **Animation Performance**: Framer Motion hardware acceleration
- **React 19**: Improved rendering performance and concurrent features

## Development Guidelines

1. **Type Safety**: All components and functions are typed with TypeScript 5.7
2. **Component Structure**: Follow Next.js 16 App Router conventions
3. **State Management**: Use Zustand 5 store for global state with persistence
4. **Styling**: Use CSS utility classes from globals.css, extend with custom CSS as needed
5. **Animations**: Use Framer Motion for interactive animations
6. **Package Management**: Use pnpm for dependency management
7. **Metadata**: Use Next.js 16 Metadata API for SEO and social sharing
8. **Client Components**: Mark interactive components with 'use client' directive
9. **Server Components**: Default to server components for better performance
10. **ESLint**: Follow ESLint flat config format (Next.js 16 default)

