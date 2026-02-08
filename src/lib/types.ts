export type Move = 'C' | 'D';

export interface HistoryEntry {
	myMove: Move;
	opponentMove: Move;
}

export type StrategyFunction = (
	opponentLastMove: Move | null,
	history: HistoryEntry[]
) => Move;

export interface Strategy {
	name: string;
	code: string;
	fn: StrategyFunction;
	isBuiltin: boolean;
}

export interface RoundResult {
	round: number;
	moves: [Move, Move];
	scores: [number, number];
	cumulativeScores: [number, number];
}

export interface MatchResult {
	strategy1: string;
	strategy2: string;
	rounds: RoundResult[];
	totalScores: [number, number];
	winner: string | null; // null = tie
}

export interface LeaderboardEntry {
	name: string;
	score: number;
	totalPoints: number;
	wins: number;
	losses: number;
	ties: number;
	isUser: boolean;
}

export type ScoringMode = 'total' | 'winloss' | 'weighted';

export const PAYOFF: Record<Move, Record<Move, [number, number]>> = {
	C: {
		C: [3, 3],
		D: [0, 5]
	},
	D: {
		C: [5, 0],
		D: [1, 1]
	}
};

export const ROUNDS_PER_MATCH = 200;
