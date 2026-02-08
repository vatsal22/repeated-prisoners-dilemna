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
