import type { Strategy, StrategyFunction, Move, HistoryEntry } from './types.js';

export interface StrategyTemplate {
	name: string;
	description: string;
	code: string;
}

export const TEMPLATES: StrategyTemplate[] = [
	{
		name: 'Tit for Tat',
		description: 'Cooperate first, then copy opponent\'s last move',
		code: `function strategy(opponentLastMove, history) {
  if (opponentLastMove === null) return 'C';
  return opponentLastMove;
}`
	},
	{
		name: 'Always Cooperate',
		description: 'Always cooperate no matter what',
		code: `function strategy(opponentLastMove, history) {
  return 'C';
}`
	},
	{
		name: 'Always Defect',
		description: 'Always defect no matter what',
		code: `function strategy(opponentLastMove, history) {
  return 'D';
}`
	},
	{
		name: 'Grudger',
		description: 'Cooperate until opponent defects, then always defect',
		code: `function strategy(opponentLastMove, history) {
  if (history.some(h => h.opponentMove === 'D')) return 'D';
  return 'C';
}`
	},
	{
		name: 'Tit for Two Tats',
		description: 'Defect only if opponent defected twice in a row',
		code: `function strategy(opponentLastMove, history) {
  if (history.length < 2) return 'C';
  const last = history[history.length - 1];
  const prev = history[history.length - 2];
  if (last.opponentMove === 'D' && prev.opponentMove === 'D') return 'D';
  return 'C';
}`
	},
	{
		name: 'Random',
		description: 'Randomly cooperate or defect with 50/50 chance',
		code: `function strategy(opponentLastMove, history) {
  return Math.random() < 0.5 ? 'C' : 'D';
}`
	},
	{
		name: 'Tester',
		description: 'Defect on first move to test, then play Tit for Tat if punished, exploit if not',
		code: `function strategy(opponentLastMove, history) {
  // First move: defect to test
  if (history.length === 0) return 'D';
  // If opponent retaliated, play Tit for Tat
  if (history.length >= 2 && history[1].opponentMove === 'D') {
    return opponentLastMove;
  }
  // Opponent didn't retaliate — alternate C and D to exploit
  return history.length % 2 === 0 ? 'D' : 'C';
}`
	},
	{
	name: 'Pavlov',
	description: 'Win-Stay, Lose-Shift: Repeat if last round went well, switch if it went poorly',
	code: `function strategy(opponentLastMove, history) {
	// First move: cooperate
	if (history.length === 0) return 'C';
	
	// Get my last move
	const myLastMove = history[history.length - 1].myMove;
	
	// Win-Stay, Lose-Shift logic
	// "Win" = mutual cooperation OR I defected while they cooperated
	if ((myLastMove === 'C' && opponentLastMove === 'C') || 
		(myLastMove === 'D' && opponentLastMove === 'C')) {
		return myLastMove; // Stay - repeat what worked
	}
	
	// "Lose" = I cooperated while they defected OR mutual defection
	// Switch to the other move
	return myLastMove === 'C' ? 'D' : 'C';
	}`
	},
{
  name: 'Generous Tit for Tat',
  description: 'Like Tit for Tat but occasionally forgives defections (~10% chance)',
  code: `function strategy(opponentLastMove, history) {
  if (opponentLastMove === null) return 'C';
  
  // If opponent cooperated, cooperate
  if (opponentLastMove === 'C') return 'C';
  
  // If opponent defected, usually retaliate but occasionally forgive
  return Math.random() < 0.1 ? 'C' : 'D';
}`
},
{
  name: 'Gradual',
  description: 'Escalating punishment followed by cooperation. Defect N times after Nth betrayal, then cooperate twice',
  code: `function strategy(opponentLastMove, history) {
  // Count how many times opponent has defected
  const defectionCount = history.filter(h => h.opponentMove === 'D').length;
  
  if (defectionCount === 0) return 'C';
  
  // Count moves since last opponent defection
  let movesSinceDefection = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    movesSinceDefection++;
    if (history[i].opponentMove === 'D') break;
  }
  
  // Punishment phase: defect N times after Nth defection
  if (movesSinceDefection <= defectionCount) return 'D';
  
  // Reconciliation phase: cooperate twice after punishment
  if (movesSinceDefection <= defectionCount + 2) return 'C';
  
  // Back to normal cooperation
  return 'C';
}`
},
{
  name: 'Detective',
  description: 'Test with C,D,C,C sequence. If opponent always cooperated, exploit them. Otherwise play Tit for Tat',
  code: `function strategy(opponentLastMove, history) {
  // Test sequence: C, D, C, C
  if (history.length === 0) return 'C';
  if (history.length === 1) return 'D';
  if (history.length === 2) return 'C';
  if (history.length === 3) return 'C';
  
  // After test, check if opponent cooperated in all 4 rounds
  if (history.length === 4) {
    const opponentAlwaysCooperated = history.every(h => h.opponentMove === 'C');
    if (opponentAlwaysCooperated) {
      // They're a sucker - exploit them
      return 'D';
    }
  }
  
  // Check if we decided they're a sucker in round 4
  if (history.length > 4 && history.slice(0, 4).every(h => h.opponentMove === 'C')) {
    return 'D'; // Keep exploiting
  }
  
  // Otherwise play Tit for Tat
  return opponentLastMove;
}`
},
{
  name: 'Soft Grudger',
  description: 'After betrayal, punish for 4 rounds then forgive. Punishment doubles if betrayed again',
  code: `function strategy(opponentLastMove, history) {
  if (history.length === 0) return 'C';
  
  // Find all opponent defections and calculate punishment
  let inPunishment = false;
  let punishmentRemaining = 0;
  let betrayalCount = 0;
  
  for (let i = 0; i < history.length; i++) {
    if (history[i].opponentMove === 'D') {
      betrayalCount++;
      // Punishment length: 4 * (2^(betrayalCount-1))
      // 1st betrayal: 4 rounds, 2nd: 8 rounds, 3rd: 16 rounds, etc.
      punishmentRemaining = 4 * Math.pow(2, betrayalCount - 1);
      inPunishment = true;
    } else if (inPunishment && punishmentRemaining > 0) {
      punishmentRemaining--;
      if (punishmentRemaining === 0) {
        inPunishment = false;
      }
    }
  }
  
  // If we're in punishment mode, defect
  if (punishmentRemaining > 0) return 'D';
  
  // Otherwise cooperate
  return 'C';
}`
},
{
  name: 'Adaptive',
  description: 'Adjusts cooperation probability based on opponent\'s historical cooperation rate',
  code: `function strategy(opponentLastMove, history) {
  if (history.length === 0) return 'C';
  
  // Calculate opponent's cooperation rate
  const opponentCoops = history.filter(h => h.opponentMove === 'C').length;
  const coopRate = opponentCoops / history.length;
  
  // Base cooperation probability on their rate
  // If they cooperate 80%+, we cooperate 90%
  // If they cooperate 50%, we cooperate 60%
  // If they cooperate 20%, we cooperate 30%
  const ourCoopProbability = 0.5 + (coopRate * 0.5);
  
  // Add momentum - slightly favor what we did last time
  const myLastMove = history[history.length - 1].myMove;
  const momentum = myLastMove === 'C' ? 0.1 : -0.1;
  
  return Math.random() < (ourCoopProbability + momentum) ? 'C' : 'D';
}`
},
{
  name: 'Omega Tit for Tat',
  description: 'High randomness early for probing, gradually becomes pure Tit for Tat',
  code: `function strategy(opponentLastMove, history) {
  if (opponentLastMove === null) return 'C';
  
  // Assume a game of ~100-200 rounds, decay randomness over time
  const totalRounds = 150; // assumed game length
  const currentRound = history.length + 1;
  
  // Randomness starts at 30% and decays to 0% by round 50
  const randomness = Math.max(0, 0.3 * (1 - currentRound / 50));
  
  // With decreasing probability, make a random move
  if (Math.random() < randomness) {
    return Math.random() < 0.5 ? 'C' : 'D';
  }
  
  // Otherwise play Tit for Tat
  return opponentLastMove;
}`
},
{
  name: 'Pattern Predictor',
  description: 'Detects patterns in opponent moves and predicts their next action',
  code: `function strategy(opponentLastMove, history) {
  if (history.length < 6) return opponentLastMove || 'C';
  
  // Get last 6 opponent moves
  const recent = history.slice(-6).map(h => h.opponentMove);
  
  // Pattern 1: Alternating (CDCDCD)
  let isAlternating = true;
  for (let i = 1; i < recent.length; i++) {
    if (recent[i] === recent[i-1]) {
      isAlternating = false;
      break;
    }
  }
  if (isAlternating) {
    // Predict they'll alternate again, counter it
    return opponentLastMove === 'C' ? 'D' : 'C';
  }
  
  // Pattern 2: Copying my moves (Tit for Tat)
  if (history.length >= 3) {
    const myMoves = history.slice(-3).map(h => h.myMove);
    const theirMoves = history.slice(-2, -2+2).map(h => h.opponentMove);
    if (myMoves[0] === theirMoves[0] && myMoves[1] === theirMoves[1]) {
      // They're copying me with 1-round delay
      // Cooperate to encourage mutual cooperation
      return 'C';
    }
  }
  
  // Pattern 3: Runs (DDD or CCC)
  const last3 = recent.slice(-3);
  if (last3.every(m => m === 'D')) {
    // They're on a defection run, defect back
    return 'D';
  }
  if (last3.every(m => m === 'C')) {
    // They're cooperating, cooperate
    return 'C';
  }
  
  // No clear pattern, fall back to Tit for Tat
  return opponentLastMove;
}`
},
{
  name: 'Champion',
  description: 'Generous early game to build reputation, strategic late game based on score',
  code: `function strategy(opponentLastMove, history) {
  if (history.length === 0) return 'C';
  
  const totalRounds = 150; // assumed game length
  const currentRound = history.length + 1;
  const gameProgress = currentRound / totalRounds;
  
  // Early game (first 20%): Be generous
  if (gameProgress < 0.2) {
    // Generous Tit for Tat - forgive 30% of defections
    if (opponentLastMove === 'D') {
      return Math.random() < 0.3 ? 'C' : 'D';
    }
    return 'C';
  }
  
  // Late game (after 20%): Strategic based on score
  // Calculate current score
  let myScore = 0;
  let theirScore = 0;
  history.forEach(h => {
    if (h.myMove === 'C' && h.opponentMove === 'C') {
      myScore += 3; theirScore += 3;
    } else if (h.myMove === 'C' && h.opponentMove === 'D') {
      myScore += 0; theirScore += 5;
    } else if (h.myMove === 'D' && h.opponentMove === 'C') {
      myScore += 5; theirScore += 0;
    } else {
      myScore += 1; theirScore += 1;
    }
  });
  
  // If ahead or tied, play Tit for Tat to maintain
  if (myScore >= theirScore) {
    return opponentLastMove;
  }
  
  // If behind, be more aggressive
  // Defect more often to catch up
  return opponentLastMove === 'C' ? 'D' : 'D';
}`
},
{
  name: 'Counter-Punisher',
  description: 'Detects punishing strategies and plays extra carefully to avoid triggering them',
  code: `function strategy(opponentLastMove, history) {
  if (history.length === 0) return 'C';
  if (history.length < 5) return 'C';
  
  // Detect if opponent is a punisher (grudger, soft grudger, etc.)
  // Test: Did a single defection lead to prolonged retaliation?
  let isPunisher = false;
  
  for (let i = 0; i < history.length - 3; i++) {
    if (history[i].myMove === 'D') {
      // Check if opponent defected for next 3+ rounds
      const nextMoves = history.slice(i+1, i+4).map(h => h.opponentMove);
      if (nextMoves.filter(m => m === 'D').length >= 2) {
        isPunisher = true;
        break;
      }
    }
  }
  
  // If opponent is a punisher, play very cooperatively
  if (isPunisher) {
    return 'C';
  }
  
  // If not a punisher, test for exploitation opportunity
  // Check if they're too nice (always cooperating)
  const recent5 = history.slice(-5);
  if (recent5.every(h => h.opponentMove === 'C')) {
    // Test with a defection every 10 rounds
    if (history.length % 10 === 0) return 'D';
  }
  
  // Default to Tit for Tat
  return opponentLastMove;
}`
},
{
  name: 'Suspicious Tit for Tat with Forgiveness',
  description: 'Starts defecting, then plays Tit for Tat with increasing forgiveness as trust builds',
  code: `function strategy(opponentLastMove, history) {
  // First move: defect (suspicious)
  if (history.length === 0) return 'D';
  
  // Calculate trust level based on mutual cooperation streak
  let currentStreak = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].myMove === 'C' && history[i].opponentMove === 'C') {
      currentStreak++;
    } else {
      break;
    }
  }
  
  // Forgiveness probability increases with cooperation streak
  // 0 streak = 0% forgiveness, 10 streak = 50% forgiveness, 20+ = 80%
  const forgiveness = Math.min(0.8, currentStreak * 0.05);
  
  // Play Tit for Tat with earned forgiveness
  if (opponentLastMove === 'D') {
    // Forgive with probability based on trust
    return Math.random() < forgiveness ? 'C' : 'D';
  }
  
  return 'C';
}`
}
];

export function compileStrategy(code: string): StrategyFunction {
	// Extract the function body from "function strategy(...) { ... }"
	// We wrap it so `new Function` returns the strategy function
	const wrapped = `
		${code}
		return strategy;
	`;
	const factory = new Function(wrapped);
	return factory() as StrategyFunction;
}

export function validateStrategy(code: string): { valid: boolean; error?: string } {
	try {
		const fn = compileStrategy(code);
		if (typeof fn !== 'function') {
			return { valid: false, error: 'Code must define a function called "strategy"' };
		}
		// Test with null (first move)
		const firstMove = fn(null, []);
		if (firstMove !== 'C' && firstMove !== 'D') {
			return { valid: false, error: `Strategy must return 'C' or 'D', got: ${JSON.stringify(firstMove)}` };
		}
		// Test with a sample history
		const sampleHistory: HistoryEntry[] = [{ myMove: 'C', opponentMove: 'D' }];
		const secondMove = fn('D' as Move, sampleHistory);
		if (secondMove !== 'C' && secondMove !== 'D') {
			return { valid: false, error: `Strategy must return 'C' or 'D', got: ${JSON.stringify(secondMove)}` };
		}
		return { valid: true };
	} catch (e) {
		return { valid: false, error: (e as Error).message };
	}
}

export function getBuiltinStrategies(): Strategy[] {
	return TEMPLATES.map((t) => ({
		name: t.name,
		code: t.code,
		fn: compileStrategy(t.code),
		isBuiltin: true
	}));
}
