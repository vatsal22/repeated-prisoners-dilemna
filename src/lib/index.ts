export type { Move, HistoryEntry, StrategyFunction, Strategy, RoundResult, MatchResult, LeaderboardEntry, ScoringMode } from './types.js';
export { PAYOFF, ROUNDS_PER_MATCH } from './types.js';
export { compileStrategy, validateStrategy, getBuiltinStrategies, TEMPLATES } from './strategies.js';
export { runMatch, runTournament } from './engine.js';
export { computeLeaderboard } from './scoring.js';
