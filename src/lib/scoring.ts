import type { Strategy, MatchResult, LeaderboardEntry, ScoringMode } from './types.js';

export function computeLeaderboard(
	strategies: Strategy[],
	matches: MatchResult[],
	mode: ScoringMode,
	userStrategyName?: string
): LeaderboardEntry[] {
	const entries = new Map<string, LeaderboardEntry>();

	for (const s of strategies) {
		entries.set(s.name, {
			name: s.name,
			score: 0,
			totalPoints: 0,
			wins: 0,
			losses: 0,
			ties: 0,
			isUser: s.name === userStrategyName
		});
	}

	for (const match of matches) {
		const e1 = entries.get(match.strategy1);
		const e2 = entries.get(match.strategy2);
		if (!e1 || !e2) continue;

		e1.totalPoints += match.totalScores[0];
		e2.totalPoints += match.totalScores[1];

		if (match.winner === match.strategy1) {
			e1.wins++;
			e2.losses++;
		} else if (match.winner === match.strategy2) {
			e2.wins++;
			e1.losses++;
		} else {
			e1.ties++;
			e2.ties++;
		}
	}

	const result = Array.from(entries.values());

	for (const entry of result) {
		switch (mode) {
			case 'total':
				entry.score = entry.totalPoints;
				break;
			case 'winloss':
				entry.score = entry.wins * 3 + entry.ties * 1;
				break;
			case 'weighted':
				entry.score = Math.round(entry.totalPoints * 0.6 + (entry.wins * 3 + entry.ties) * 100 * 0.4);
				break;
		}
	}

	result.sort((a, b) => b.score - a.score);
	return result;
}
