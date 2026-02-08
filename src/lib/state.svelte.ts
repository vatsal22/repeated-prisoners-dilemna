import type { Strategy, MatchResult, ScoringMode } from './types.js';
import { computeLeaderboard } from './scoring.js';

let strategies = $state<Strategy[]>([]);
let matches = $state<MatchResult[]>([]);
let scoringMode = $state<ScoringMode>('total');
let isRunning = $state(false);
let progress = $state({ completed: 0, total: 0 });
let userStrategyName = $state<string | null>(null);
let selectedMatch = $state<MatchResult | null>(null);
let selectedStrategyForResults = $state<string | null>(null);

const leaderboard = $derived(
	computeLeaderboard(strategies, matches, scoringMode, userStrategyName ?? undefined)
);

const userMatches = $derived(
	userStrategyName
		? matches.filter(
				(m) => m.strategy1 === userStrategyName || m.strategy2 === userStrategyName
			)
		: []
);

const selectedStrategyMatches = $derived(
	selectedStrategyForResults
		? matches.filter(
				(m) => m.strategy1 === selectedStrategyForResults || m.strategy2 === selectedStrategyForResults
			)
		: []
);

export function getStrategies() {
	return strategies;
}

export function getMatches() {
	return matches;
}

export function getScoringMode() {
	return scoringMode;
}

export function setScoringMode(mode: ScoringMode) {
	scoringMode = mode;
}

export function getIsRunning() {
	return isRunning;
}

export function setIsRunning(running: boolean) {
	isRunning = running;
}

export function getProgress() {
	return progress;
}

export function setProgress(completed: number, total: number) {
	progress = { completed, total };
}

export function getUserStrategyName() {
	return userStrategyName;
}

export function setUserStrategyName(name: string | null) {
	userStrategyName = name;
}

export function getSelectedMatch() {
	return selectedMatch;
}

export function setSelectedMatch(match: MatchResult | null) {
	selectedMatch = match;
}

export function getLeaderboard() {
	return leaderboard;
}

export function getUserMatches() {
	return userMatches;
}

export function getSelectedStrategyForResults() {
	return selectedStrategyForResults;
}

export function setSelectedStrategyForResults(name: string | null) {
	selectedStrategyForResults = name;
}

export function getSelectedStrategyMatches() {
	return selectedStrategyMatches;
}

export function addStrategy(strategy: Strategy) {
	// Remove existing strategy with same name
	strategies = strategies.filter((s) => s.name !== strategy.name);
	strategies = [...strategies, strategy];
}

export function removeStrategy(name: string) {
	strategies = strategies.filter((s) => s.name !== name);
	matches = matches.filter((m) => m.strategy1 !== name && m.strategy2 !== name);
}

export function setStrategies(newStrategies: Strategy[]) {
	strategies = newStrategies;
}

export function setMatches(newMatches: MatchResult[]) {
	matches = newMatches;
}

export function reset() {
	strategies = [];
	matches = [];
	userStrategyName = null;
	selectedMatch = null;
	selectedStrategyForResults = null;
	progress = { completed: 0, total: 0 };
}
