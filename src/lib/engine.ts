import type { Move, HistoryEntry, StrategyFunction, Strategy, RoundResult, MatchResult } from './types.js';
import { PAYOFF, ROUNDS_PER_MATCH } from './types.js';

export function safeExecute(
	fn: StrategyFunction,
	opponentLastMove: Move | null,
	history: HistoryEntry[]
): Move {
	try {
		const move = fn(opponentLastMove, history);
		if (move === 'C' || move === 'D') return move;
		return 'D'; // invalid return → defect
	} catch {
		return 'D'; // broken strategy → defect
	}
}

export function runMatch(s1: Strategy, s2: Strategy, rounds = ROUNDS_PER_MATCH): MatchResult {
	const history1: HistoryEntry[] = [];
	const history2: HistoryEntry[] = [];
	const roundResults: RoundResult[] = [];
	let cumScore1 = 0;
	let cumScore2 = 0;

	for (let i = 0; i < rounds; i++) {
		const lastMove1 = history2.length > 0 ? history2[history2.length - 1].myMove : null;
		const lastMove2 = history1.length > 0 ? history1[history1.length - 1].myMove : null;

		const move1 = safeExecute(s1.fn, lastMove1, history1);
		const move2 = safeExecute(s2.fn, lastMove2, history2);

		const [score1, score2] = PAYOFF[move1][move2];
		cumScore1 += score1;
		cumScore2 += score2;

		history1.push({ myMove: move1, opponentMove: move2 });
		history2.push({ myMove: move2, opponentMove: move1 });

		roundResults.push({
			round: i + 1,
			moves: [move1, move2],
			scores: [score1, score2],
			cumulativeScores: [cumScore1, cumScore2]
		});
	}

	let winner: string | null = null;
	if (cumScore1 > cumScore2) winner = s1.name;
	else if (cumScore2 > cumScore1) winner = s2.name;

	return {
		strategy1: s1.name,
		strategy2: s2.name,
		rounds: roundResults,
		totalScores: [cumScore1, cumScore2],
		winner
	};
}

export async function runTournament(
	strategies: Strategy[],
	onMatchComplete?: (completed: number, total: number) => void
): Promise<MatchResult[]> {
	const results: MatchResult[] = [];
	const totalMatches = (strategies.length * (strategies.length - 1)) / 2;
	let completed = 0;

	for (let i = 0; i < strategies.length; i++) {
		for (let j = i + 1; j < strategies.length; j++) {
			const match = runMatch(strategies[i], strategies[j]);
			results.push(match);
			completed++;
			onMatchComplete?.(completed, totalMatches);

			// Yield to event loop every 10 matches
			if (completed % 10 === 0) {
				await new Promise((resolve) => setTimeout(resolve, 0));
			}
		}
	}

	return results;
}
