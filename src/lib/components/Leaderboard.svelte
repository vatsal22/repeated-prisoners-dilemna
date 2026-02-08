<script lang="ts">
	import type { LeaderboardEntry, ScoringMode, MatchResult } from '$lib/types.js';
	import ScoringToggle from './ScoringToggle.svelte';

	interface Props {
		entries: LeaderboardEntry[];
		scoringMode: ScoringMode;
		onScoringChange: (mode: ScoringMode) => void;
		onViewResults: (strategyName: string) => void;
		matches: MatchResult[];
	}

	let { entries, scoringMode, onScoringChange, onViewResults, matches }: Props = $props();

	function getWeightedScore(entry: LeaderboardEntry): number {
		return Math.round(entry.totalPoints * 0.6 + (entry.wins * 3 + entry.ties) * 100 * 0.4);
	}
</script>

<div class="leaderboard">
	<div class="leaderboard-header">
		<h2>Leaderboard</h2>
		<ScoringToggle mode={scoringMode} onChange={onScoringChange} />
	</div>

	{#if entries.length === 0}
		<p class="placeholder">Submit a strategy to see the leaderboard</p>
	{:else}
		<div class="table-wrapper">
			<table>
				<thead>
					<tr>
						<th class="rank-col">#</th>
						<th class="name-col">Strategy</th>
						<th class="pts-col" class:highlight={scoringMode === 'total'}>Points</th>
						<th class="score-col" class:highlight={scoringMode === 'weighted'}>Score</th>
						<th class="record-col" class:highlight={scoringMode === 'winloss'}>W/L/T</th>
						<th class="action-col"></th>
					</tr>
				</thead>
				<tbody>
					{#each entries as entry, i}
						<tr class:user-row={entry.isUser}>
							<td class="rank-col">{i + 1}</td>
							<td class="name-col">
								{entry.name}
								{#if entry.isUser}
									<span class="user-badge">YOU</span>
								{/if}
							</td>
							<td class="pts-col" class:highlight={scoringMode === 'total'}>{entry.totalPoints.toLocaleString()}</td>
							<td class="score-col" class:highlight={scoringMode === 'weighted'}>{getWeightedScore(entry).toLocaleString()}</td>
							<td class="record-col" class:highlight={scoringMode === 'winloss'}>{entry.wins}/{entry.losses}/{entry.ties}</td>
							<td class="action-col">
								<button class="watch-btn" onclick={() => {
									onViewResults(entry.name);
									setTimeout(() => {
										document.getElementById('strategy-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
									}, 100);
								}}>
									View
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<style>
	.leaderboard {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.leaderboard-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	h2 {
		font-size: 1.1rem;
		color: #f0f6fc;
		margin: 0;
		white-space: nowrap;
	}

	.placeholder {
		color: #484f58;
		font-style: italic;
	}

	.table-wrapper {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.85rem;
	}

	thead {
		border-bottom: 1px solid #30363d;
	}

	th {
		text-align: left;
		padding: 0.5rem 0.4rem;
		color: #8b949e;
		font-weight: 600;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		transition: all 0.15s;
	}

	th.highlight {
		color: #58a6ff;
		font-weight: 700;
	}

	td {
		padding: 0.45rem 0.4rem;
		border-bottom: 1px solid #21262d;
		transition: all 0.15s;
	}

	td.highlight {
		color: #58a6ff;
		font-weight: 600;
	}

	.rank-col {
		width: 2rem;
		text-align: center;
	}

	.name-col {
		min-width: 100px;
	}

	.score-col,
	.pts-col {
		text-align: right;
		width: 4.5rem;
	}

	.record-col {
		text-align: center;
		width: 4.5rem;
		font-family: monospace;
	}

	.action-col {
		width: 3rem;
		text-align: center;
	}

	.user-row {
		background: #1a2233;
	}

	.user-badge {
		display: inline-block;
		padding: 0.1rem 0.35rem;
		background: #238636;
		color: white;
		border-radius: 3px;
		font-size: 0.65rem;
		font-weight: 700;
		margin-left: 0.4rem;
		vertical-align: middle;
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
