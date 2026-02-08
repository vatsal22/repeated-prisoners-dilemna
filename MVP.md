# Prisoner's Dilemma Tournament - MVP

## Vision
**Core Question:** What strategies actually win when real people submit them? Is Tit for Tat really optimal, or can we discover better strategies through crowdsourcing? Especially with other competition formats like "all or nothing".

This isn't an educational tool to prove textbook game theory. It's an **experiment** to see what emerges when you let people compete.

## The Hook
"Submit a strategy. Battle everyone else's. Climb the leaderboard."

## MVP Scope

### What We're Building

**1. Strategy Editor**
- Code editor with JavaScript
- Template dropdown with 6-8 classic strategies
  - Tit for Tat
  - Always Cooperate / Always Defect
  - Grudger
  - Tit for Two Tats
  - Random
  - Tester
- Each template has configurable constants
- Live validation (must return 'C' or 'D')
- Strategy name input (required)

**2. Tournament Runner**
- Your strategy plays 200 rounds against every other submitted strategy
- Shows results in real-time as matches complete
- Three scoring modes (user picks one):
  - **Total Points** - sum across all matches (classic Axelrod)
  - **Win/Loss** - binary win/loss/tie per match
  - **Weighted** - win = 3pts, tie = 1pt, loss = 0 (like soccer)

**3. Live Leaderboard**
- Shows top 20 strategies for each scoring mode
- Display: rank, name, total score, W/L/T record
- Click strategy to see its code
- "Battle this strategy" button to play against it

**4. Match Visualization (Simple)**
- After submitting, pick one opponent to watch
- Simple animation: round-by-round display
  - Round N: [🤝 C] vs [💀 D] → Scores: You +0, Them +5
- Play/Pause, speed control
- Skip to interesting moments (first defection, etc)

**5. Results Page**
- Table of your matchups sorted by score
- Total points / W/L record
- Quick insights: "You performed best against: [strategies]"
- Quick insights: "You struggled against: [strategies]"

### Technical Implementation

**Stack:**
Svelte ts because:

Reactivity is built-in (perfect for leaderboard updates)
Component model without React's complexity
Still feels close to vanilla JS
Compiles to efficient vanilla JS anyway

Project Structure:
prisoner-dilemma/
├── src/
│   ├── lib/
│   │   ├── engine.ts          # Tournament runner
│   │   ├── strategies.ts      # Template strategies
│   │   ├── types.ts           # Type definitions
│   │   └── scoring.ts         # Scoring modes
│   ├── components/
│   │   ├── Editor.svelte      # Code editor
│   │   ├── Leaderboard.svelte # Results table
│   │   ├── Visualizer.svelte  # Match animation
│   │   └── Results.svelte     # Your results
│   ├── App.svelte
│   └── main.ts
├── package.json
├── tsconfig.json
└── vite.config.ts
Key types:
typescript// types.ts
export type Move = 'C' | 'D';

export interface HistoryEntry {
  me: Move;
  opponent: Move;
}

export type StrategyFunction = (
  opponentLastMove: Move | null,
  history: HistoryEntry[]
) => Move;

export interface Strategy {
  name: string;
  code: string;
  fn: StrategyFunction;
}

export interface MatchResult {
  opponent: string;
  myScore: number;
  theirScore: number;
  outcome: 'win' | 'loss' | 'tie';
}

export type ScoringMode = 'total' | 'winloss' | 'weighted';

- LocalStorage for strategies initially
- Later: Firebase/Supabase for persistence

**Strategy Execution:**
```javascript
function runStrategy(strategyFn, opponentLastMove, history) {
  try {
    const result = strategyFn(opponentLastMove, history);
    if (result !== 'C' && result !== 'D') throw new Error();
    return result;
  } catch (e) {
    return 'D'; // Broken strategies auto-defect
  }
}
```

**Tournament Format:**
- Round-robin: every strategy plays every other strategy once
- 200 rounds per matchup
- Runs in browser (Web Workers if needed)

### User Flow

1. Land on page → see leaderboard + editor
2. Pick a template or write from scratch
3. Name your strategy
4. "Submit & Run Tournament"
5. Watch matches run (shows progress)
6. See results + leaderboard position
7. Iterate or share

### MVP Features Checklist

**Must Have:**
- [ ] Code editor with syntax highlighting (CodeMirror or Monaco)
- [ ] 6 strategy templates
- [ ] Input validation
- [ ] Round-robin tournament engine
- [ ] All 3 scoring modes
- [ ] Results table
- [ ] Leaderboard (top 20)
- [ ] Basic match visualization
- [ ] Share URL (encode strategy in URL params)

**Nice to Have (if time):**
- [ ] Dark mode
- [ ] Copy strategy code button
- [ ] Download results as CSV
- [ ] "Fork this strategy" button

**Explicitly NOT in MVP:**
- User accounts / login
- Comments or discussions
- Evolution/reproduction mode
- Historical leaderboard (just current snapshot)
- Mobile optimization (desktop first)
- Strategy privacy (all public)
- Rate limiting / abuse prevention

## Success Metrics

**MVP is successful if:**
1. 50+ unique strategies submitted
2. Top 3 strategies are NOT all Tit for Tat variants
3. Different strategies win in different scoring modes
4. At least one "novel" strategy emerges that wasn't in templates

**Signals we should build more:**
- People iterate multiple times (3+ submissions)
- Strategies get shared on social media
- Discussion emerges about why X beats Y
- People request features (evolution mode, private battles, etc)

## Open Questions for MVP

1. **How do we handle the "cold start" problem?**
   - Seed with 10-20 classic strategies ourselves?
   - Or only show leaderboard after 20+ real submissions?

2. **Do we show all strategy code publicly?**
   - Pro: Transparency, learning, anti-cheating
   - Con: People can specifically counter top strategies
   - **Decision: Yes, all public. That's part of the meta.**

3. **How often does the leaderboard update?**
   - Real-time after each submission?
   - Batched every hour?
   - **Decision: Real-time for MVP. It's all client-side anyway.**

4. **Do we allow duplicate strategies?**
   - Or require each submission to be unique?
   - **Decision: Allow duplicates with different names for MVP. Filter later.**

## Future Phases (Post-MVP)

**Phase 2: Evolution Mode**
- Weekly tournaments where strategies "reproduce" based on performance
- Bottom 20% go extinct
- See population dynamics over time
- This is where it gets REALLY interesting

**Phase 3: Meta-Gaming**
- Allow private strategies (hidden code)
- Challenge system (1v1 battles)
- Strategy lineage tree (forking)
- Hall of Fame for each era

**Phase 4: Advanced Features**
- More complex environments (3+ player games, noisy channels, incomplete info)
- Tournament brackets
- Team competitions
- API for programmatic submissions

## Tech Stack

**MVP:**
- lightweight framework like svelte
- CodeMirror or Monaco Editor
- Chart.js for simple graphs
- LocalStorage → Firebase later

**Deployment:**
- GitHub Pages or Vercel (free tier)
- Custom domain optional

## Timeline Estimate

- **Weekend 1:** Core engine + editor (tournament runner, validation)
- **Weekend 2:** UI polish + visualization + leaderboard
- **Weekend 3:** Testing + bug fixes + deploy

**Total: 3 weekends to MVP**

## The Real Goal

Find out: **Is there an undiscovered strategy better than Tit for Tat?**

Or more precisely: When everyone knows about Tit for Tat and can specifically design strategies to beat it, what actually wins?

That's what makes this interesting.