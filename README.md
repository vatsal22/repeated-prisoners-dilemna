# Prisoner's Dilemma Tournament

A competitive tournament platform for testing game theory strategies in the classic Prisoner's Dilemma. Write your own strategy in JavaScript, battle against built-in and community strategies, and climb the leaderboard.

## What is This?

This is an interactive web application that lets you:
- **Write custom strategies** in JavaScript to play the iterated Prisoner's Dilemma
- **Compete in tournaments** where your strategy plays 200 rounds against every other strategy
- **Analyze results** with multiple scoring modes and detailed match visualizations
- **Share strategies** via URL encoding to challenge others

### The Core Question

Is Tit for Tat really optimal? What strategies actually win when real people submit them? This platform helps discover what emerges when you let people compete with custom strategies.

## Features

### 🎮 Strategy Editor
- **CodeMirror integration** with JavaScript syntax highlighting and One Dark theme
- **7 built-in strategy templates**:
  - Tit for Tat
  - Always Cooperate
  - Always Defect
  - Grudger
  - Tit for Two Tats
  - Random
  - Tester (exploitative strategy)
- **Live validation** ensuring strategies return 'C' (cooperate) or 'D' (defect)
- **Error handling** - broken strategies automatically defect

### 🏆 Scoring Modes
Choose how to rank strategies:
- **Total Points**: Classic Axelrod format - sum of all points across matches
- **Win/Loss**: Binary outcome per match (win = 1, tie = 0.5, loss = 0)
- **Weighted**: Soccer-style scoring (win = 3pts, tie = 1pt, loss = 0)

Different strategies dominate in different scoring modes!

### 📊 Real-time Tournament
- **Round-robin format**: Every strategy plays every other strategy
- **200 rounds per match** using the standard Prisoner's Dilemma payoff matrix:
  - Both cooperate: 3 points each
  - One defects, one cooperates: 5 for defector, 0 for cooperator
  - Both defect: 1 point each
- **Progress tracking** during tournament execution
- **Async execution** with event loop yielding to prevent UI freezing

### 📈 Results & Analytics
- **Live leaderboard** showing top 20 strategies with stats (W/L/T record)
- **Detailed match results** for your strategy against each opponent
- **Match visualization** with round-by-round playback
- **Performance insights** identifying which strategies you beat/lost to
- **Strategy code viewing** - click any strategy to see its implementation

### 🔗 Sharing
- **URL encoding** to share your strategy with others
- **One-click copying** to clipboard
- **Automatic loading** of shared strategies from URL parameters

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```sh
# Clone the repository
git clone <repository-url>
cd repeated_prisoners_dilemna

# Install dependencies
npm install
```

### Development

```sh
# Start development server
npm run dev

# Or open in browser automatically
npm run dev -- --open
```

The app will be available at `http://localhost:5173`

### Building for Production

```sh
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### Type Checking

```sh
# Run TypeScript type checking
npm run check

# Run in watch mode
npm run check:watch
```

## How to Write a Strategy

Strategies are JavaScript functions with this signature:

```javascript
function strategy(opponentLastMove, history) {
  // opponentLastMove: 'C', 'D', or null (first round)
  // history: array of { myMove, opponentMove } objects

  // Must return 'C' (cooperate) or 'D' (defect)
  return 'C';
}
```

### Strategy API

**Parameters:**
- `opponentLastMove`: `'C' | 'D' | null`
  - The opponent's last move
  - `null` on the first round
- `history`: `Array<{ myMove: Move, opponentMove: Move }>`
  - Complete history of all previous rounds
  - Empty array on first round

**Returns:** `'C' | 'D'`
- `'C'` to cooperate
- `'D'` to defect

### Example: Tit for Tat

```javascript
function strategy(opponentLastMove, history) {
  // Cooperate on first move
  if (opponentLastMove === null) return 'C';
  // Copy opponent's last move
  return opponentLastMove;
}
```

### Example: Forgiving Tit for Tat

```javascript
function strategy(opponentLastMove, history) {
  if (opponentLastMove === null) return 'C';
  // 10% chance to cooperate even if opponent defected
  if (opponentLastMove === 'D' && Math.random() < 0.1) return 'C';
  return opponentLastMove;
}
```

### Safety Features
- Strategies run in a try-catch wrapper
- Invalid returns (not 'C' or 'D') automatically become 'D'
- Exceptions in strategy code automatically return 'D'
- Validation runs before tournament to catch common errors

## Technical Stack

### Frontend
- **SvelteKit** - Full-stack framework with file-based routing
- **Svelte 5** - Latest version with runes ($state, $effect, etc.)
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server

### Code Editor
- **CodeMirror 6** - Modern code editor with JavaScript language support
- **@codemirror/theme-one-dark** - Dark theme for better readability

### Deployment
- **@sveltejs/adapter-static** - Static site generation for easy deployment
- Deploy to Vercel, Netlify, GitHub Pages, or any static hosting

## Project Structure

```
src/
├── lib/
│   ├── engine.ts          # Tournament runner and match execution
│   ├── strategies.ts      # Strategy templates and compilation
│   ├── types.ts           # TypeScript type definitions
│   ├── scoring.ts         # Leaderboard calculation logic
│   ├── persistence.ts     # LocalStorage integration
│   ├── sharing.ts         # URL encoding/decoding
│   ├── state.svelte.ts    # Global reactive state management
│   └── components/
│       ├── Editor.svelte           # CodeMirror editor wrapper
│       ├── Leaderboard.svelte      # Rankings table
│       ├── ScoringToggle.svelte    # Mode selector
│       ├── TournamentRunner.svelte # Progress indicator
│       ├── Results.svelte          # Match results table
│       └── Visualizer.svelte       # Round-by-round playback
├── routes/
│   ├── +layout.svelte     # App-wide layout
│   └── +page.svelte       # Main page component
└── app.html               # HTML template
```

## Game Theory Background

The **Prisoner's Dilemma** is a fundamental concept in game theory where two players must decide whether to cooperate or defect. The payoff matrix creates a tension between individual and collective interests:

| You \ Opponent | Cooperate | Defect |
|---------------|-----------|---------|
| **Cooperate** | 3, 3      | 0, 5    |
| **Defect**    | 5, 0      | 1, 1    |

In a single round, defecting is always better. But in repeated games, cooperation can emerge through reciprocity and reputation.

### Famous Results
- Robert Axelrod's 1980 tournament found **Tit for Tat** was the winning strategy
- It's simple, nice (never defects first), forgiving, and retaliatory
- But is it still optimal when everyone knows about it?

## Future Enhancements

See [MVP.md](./MVP.md) for the full roadmap, including:

- **Evolution Mode**: Strategies reproduce based on performance, population dynamics
- **Meta-Gaming**: Private strategies, 1v1 challenges, strategy lineage trees
- **Advanced Formats**: Multi-player games, noisy channels, incomplete information
- **Backend Integration**: Firebase/Supabase for global leaderboard persistence

## Performance Notes

- Tournaments run entirely in-browser (no server required)
- Event loop yielding every 10 matches prevents UI freezing
- With 20 strategies: 190 matches × 200 rounds = 38,000 total rounds
- Typically completes in under 2 seconds on modern hardware

## Contributing

Contributions welcome! Areas for improvement:
- Additional built-in strategy templates
- Enhanced visualization options
- Performance optimizations for large tournaments
- Mobile responsive design improvements

## License

This project is open source. See repository for license details.

## Credits

Built with SvelteKit as an exploration of emergent game theory strategies through crowdsourced competition.
