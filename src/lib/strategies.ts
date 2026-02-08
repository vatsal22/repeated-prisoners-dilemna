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
