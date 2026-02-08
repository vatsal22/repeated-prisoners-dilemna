<script lang="ts">
	import type { MatchResult } from '$lib/types.js';

	interface Props {
		match: MatchResult;
		onClose: () => void;
	}

	let { match, onClose }: Props = $props();

	let currentRound = $state(0);
	let isPlaying = $state(false);
	let speed = $state(1);
	let intervalId: ReturnType<typeof setInterval> | null = null;

	// Reset visualizer when match changes
	$effect(() => {
		match; // Track match changes
		reset();
	});

	const totalRounds = $derived(match.rounds.length);
	const currentData = $derived(currentRound > 0 ? match.rounds[currentRound - 1] : null);
	const recentRounds = $derived(
		match.rounds.slice(Math.max(0, currentRound - 20), currentRound)
	);

	function play() {
		if (currentRound >= totalRounds) currentRound = 0;
		isPlaying = true;
		intervalId = setInterval(() => {
			if (currentRound >= totalRounds) {
				pause();
				return;
			}
			currentRound++;
		}, 200 / speed);
	}

	function pause() {
		isPlaying = false;
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
	}

	function togglePlay() {
		if (isPlaying) pause();
		else play();
	}

	function setSpeed(s: number) {
		speed = s;
		if (isPlaying) {
			pause();
			play();
		}
	}

	function skipToFirstDefection() {
		const idx = match.rounds.findIndex((r) => r.moves[0] === 'D' || r.moves[1] === 'D');
		if (idx >= 0) {
			pause();
			currentRound = idx + 1;
		}
	}

	function skipToEnd() {
		pause();
		currentRound = totalRounds;
	}

	function reset() {
		pause();
		currentRound = 0;
	}

	function handleSlider(e: Event) {
		const val = parseInt((e.target as HTMLInputElement).value);
		currentRound = val;
	}

	function moveLabel(move: string) {
		return move === 'C' ? 'Cooperate' : 'Defect';
	}
</script>

<div class="visualizer">
	<div class="viz-header">
		<h2>{match.strategy1} vs {match.strategy2}</h2>
		<button class="close-btn" onclick={onClose}>Close</button>
	</div>

	<div class="scores-display">
		<div class="player-score p1">
			<span class="player-name">{match.strategy1}</span>
			<span class="score">{currentData ? currentData.cumulativeScores[0] : 0}</span>
		</div>
		<div class="round-indicator">
			Round {currentRound} / {totalRounds}
		</div>
		<div class="player-score p2">
			<span class="player-name">{match.strategy2}</span>
			<span class="score">{currentData ? currentData.cumulativeScores[1] : 0}</span>
		</div>
	</div>

	{#if currentData}
		<div class="move-display">
			<div class="move" class:cooperate={currentData.moves[0] === 'C'} class:defect={currentData.moves[0] === 'D'}>
				{moveLabel(currentData.moves[0])}
				<span class="move-score">+{currentData.scores[0]}</span>
			</div>
			<span class="vs">vs</span>
			<div class="move" class:cooperate={currentData.moves[1] === 'C'} class:defect={currentData.moves[1] === 'D'}>
				{moveLabel(currentData.moves[1])}
				<span class="move-score">+{currentData.scores[1]}</span>
			</div>
		</div>
	{/if}

	<div class="history-strip">
		{#each recentRounds as round}
			<div class="round-dots">
				<span class="dot" class:c={round.moves[0] === 'C'} class:d={round.moves[0] === 'D'}></span>
				<span class="dot" class:c={round.moves[1] === 'C'} class:d={round.moves[1] === 'D'}></span>
			</div>
		{/each}
	</div>

	<input
		type="range"
		class="slider"
		min="0"
		max={totalRounds}
		value={currentRound}
		oninput={handleSlider}
	/>

	<div class="controls">
		<div class="control-group">
			<button class="ctrl-btn" onclick={reset}>Reset</button>
			<button class="ctrl-btn primary" onclick={togglePlay}>
				{isPlaying ? 'Pause' : 'Play'}
			</button>
			<button class="ctrl-btn" onclick={skipToFirstDefection}>First Defection</button>
			<button class="ctrl-btn" onclick={skipToEnd}>End</button>
		</div>
		<div class="speed-group">
			{#each [1, 2, 5, 10] as s}
				<button
					class="speed-btn"
					class:active={speed === s}
					onclick={() => setSpeed(s)}
				>
					{s}x
				</button>
			{/each}
		</div>
	</div>
</div>

<style>
	.visualizer {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.viz-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	h2 {
		font-size: 1rem;
		color: #f0f6fc;
		margin: 0;
	}

	.close-btn {
		padding: 0.3rem 0.6rem;
		background: #21262d;
		border: 1px solid #30363d;
		border-radius: 4px;
		color: #8b949e;
		font-size: 0.8rem;
		cursor: pointer;
	}

	.close-btn:hover {
		color: #e1e4e8;
	}

	.scores-display {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem;
		background: #0d1117;
		border-radius: 6px;
	}

	.player-score {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.player-name {
		font-size: 0.8rem;
		color: #8b949e;
	}

	.score {
		font-size: 1.5rem;
		font-weight: 700;
		color: #f0f6fc;
		font-family: monospace;
	}

	.round-indicator {
		font-size: 0.85rem;
		color: #484f58;
	}

	.move-display {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1.5rem;
	}

	.move {
		padding: 0.5rem 1rem;
		border-radius: 6px;
		font-weight: 600;
		font-size: 0.9rem;
		text-align: center;
	}

	.move.cooperate {
		background: #1a3a1a;
		color: #3fb950;
	}

	.move.defect {
		background: #3d1114;
		color: #f85149;
	}

	.move-score {
		display: block;
		font-size: 0.75rem;
		opacity: 0.8;
	}

	.vs {
		color: #484f58;
		font-size: 0.85rem;
	}

	.history-strip {
		display: flex;
		gap: 2px;
		justify-content: center;
		min-height: 20px;
		flex-wrap: wrap;
	}

	.round-dots {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	.dot.c {
		background: #238636;
	}

	.dot.d {
		background: #da3633;
	}

	.slider {
		width: 100%;
		accent-color: #238636;
	}

	.controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.control-group {
		display: flex;
		gap: 0.4rem;
	}

	.ctrl-btn {
		padding: 0.35rem 0.7rem;
		background: #21262d;
		border: 1px solid #30363d;
		border-radius: 4px;
		color: #8b949e;
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.15s;
	}

	.ctrl-btn:hover {
		color: #e1e4e8;
		background: #30363d;
	}

	.ctrl-btn.primary {
		background: #238636;
		border-color: #238636;
		color: white;
	}

	.ctrl-btn.primary:hover {
		opacity: 0.85;
	}

	.speed-group {
		display: flex;
		gap: 0.25rem;
	}

	.speed-btn {
		padding: 0.25rem 0.5rem;
		background: transparent;
		border: 1px solid #30363d;
		border-radius: 4px;
		color: #8b949e;
		font-size: 0.75rem;
		cursor: pointer;
	}

	.speed-btn.active {
		background: #21262d;
		color: #f0f6fc;
	}
</style>
