<script lang="ts">
	import type { MatchResult } from '$lib/types.js';

	interface Props {
		strategyName: string;
		matches: MatchResult[];
		onWatch: (match: MatchResult) => void;
	}

	let { strategyName, matches, onWatch }: Props = $props();

	const stats = $derived.by(() => {
		let totalPoints = 0;
		let wins = 0;
		let losses = 0;
		let ties = 0;

		const matchups: {
			opponent: string;
			myScore: number;
			theirScore: number;
			result: 'W' | 'L' | 'T';
			match: MatchResult;
		}[] = [];

		for (const m of matches) {
			const isFirst = m.strategy1 === strategyName;
			const myScore = isFirst ? m.totalScores[0] : m.totalScores[1];
			const theirScore = isFirst ? m.totalScores[1] : m.totalScores[0];
			const opponent = isFirst ? m.strategy2 : m.strategy1;

			totalPoints += myScore;
			let result: 'W' | 'L' | 'T';
			if (myScore > theirScore) {
				wins++;
				result = 'W';
			} else if (myScore < theirScore) {
				losses++;
				result = 'L';
			} else {
				ties++;
				result = 'T';
			}
			matchups.push({ opponent, myScore, theirScore, result, match: m });
		}

		matchups.sort((a, b) => b.myScore - a.myScore);

		const best = matchups.length > 0 ? matchups[0] : null;
		const worst = matchups.length > 0 ? matchups[matchups.length - 1] : null;

		// Calculate weighted score: 60% total points + 40% win/loss
		const totalScore = Math.round(totalPoints * 0.6 + (wins * 3 + ties) * 100 * 0.4);

		return { totalPoints, totalScore, wins, losses, ties, matchups, best, worst };
	});
</script>

<div class="results">
	<h2>Results: {strategyName}</h2>

	<div class="stats-grid">
		<div class="stat-card">
			<div class="stat-value">{stats.totalPoints.toLocaleString()}</div>
			<div class="stat-label">Total Points</div>
		</div>
		<div class="stat-card">
			<div class="stat-value">{stats.totalScore.toLocaleString()}</div>
			<div class="stat-label">Total Score</div>
		</div>
		<div class="stat-card">
			<div class="stat-value record">
				<span class="win">{stats.wins}W</span>
				<span class="loss">{stats.losses}L</span>
				<span class="tie">{stats.ties}T</span>
			</div>
			<div class="stat-label">Record</div>
		</div>
		{#if stats.best}
			<div class="stat-card">
				<div class="stat-value best">vs {stats.best.opponent}</div>
				<div class="stat-label">Best Matchup ({stats.best.myScore}-{stats.best.theirScore})</div>
			</div>
		{/if}
		{#if stats.worst}
			<div class="stat-card">
				<div class="stat-value worst">vs {stats.worst.opponent}</div>
				<div class="stat-label">Worst Matchup ({stats.worst.myScore}-{stats.worst.theirScore})</div>
			</div>
		{/if}
	</div>

	{#if stats.matchups.length > 0}
		<h3>All Matchups</h3>
		<div class="matchup-table-wrapper">
			<table class="matchup-table">
				<thead>
					<tr>
						<th>Opponent</th>
						<th>Score</th>
						<th>Result</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#each stats.matchups as m}
						<tr>
							<td>{m.opponent}</td>
							<td class="score-cell">{m.myScore} - {m.theirScore}</td>
							<td>
								<span
									class="result-badge"
									class:win={m.result === 'W'}
									class:loss={m.result === 'L'}
									class:tie={m.result === 'T'}
								>
									{m.result}
								</span>
							</td>
							<td>
								<button class="watch-btn" onclick={() => {
									onWatch(m.match);
									setTimeout(() => {
										document.getElementById('visualizer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
									}, 100);
								}}>Watch</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<style>
	.results {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	h2 {
		font-size: 1.1rem;
		color: #f0f6fc;
		margin: 0;
	}

	h3 {
		font-size: 0.95rem;
		color: #f0f6fc;
		margin: 0;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 0.75rem;
	}

	.stat-card {
		background: #0d1117;
		border: 1px solid #21262d;
		border-radius: 6px;
		padding: 0.75rem;
		text-align: center;
	}

	.stat-value {
		font-size: 1.1rem;
		font-weight: 700;
		color: #f0f6fc;
	}

	.stat-label {
		font-size: 0.75rem;
		color: #8b949e;
		margin-top: 0.25rem;
	}

	.record {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
	}

	.win {
		color: #3fb950;
	}

	.loss {
		color: #f85149;
	}

	.tie {
		color: #8b949e;
	}

	.best {
		color: #3fb950;
		font-size: 0.9rem;
	}

	.worst {
		color: #f85149;
		font-size: 0.9rem;
	}

	.matchup-table-wrapper {
		overflow-x: auto;
	}

	.matchup-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.85rem;
	}

	.matchup-table th {
		text-align: left;
		padding: 0.5rem 0.4rem;
		color: #8b949e;
		font-weight: 600;
		font-size: 0.75rem;
		text-transform: uppercase;
		border-bottom: 1px solid #30363d;
	}

	.matchup-table td {
		padding: 0.45rem 0.4rem;
		border-bottom: 1px solid #21262d;
	}

	.score-cell {
		font-family: monospace;
	}

	.result-badge {
		display: inline-block;
		padding: 0.1rem 0.4rem;
		border-radius: 3px;
		font-size: 0.75rem;
		font-weight: 700;
	}

	.result-badge.win {
		background: #1a3a1a;
	}

	.result-badge.loss {
		background: #3d1114;
	}

	.result-badge.tie {
		background: #21262d;
	}

	.watch-btn {
		padding: 0.2rem 0.5rem;
		background: #21262d;
		border: 1px solid #30363d;
		border-radius: 4px;
		color: #8b949e;
		font-size: 0.75rem;
		cursor: pointer;
		transition: all 0.15s;
	}

	.watch-btn:hover {
		background: #30363d;
		color: #e1e4e8;
	}
</style>
