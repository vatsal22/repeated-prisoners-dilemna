<script lang="ts">
	import type { ScoringMode } from '$lib/types.js';

	interface Props {
		mode: ScoringMode;
		onChange: (mode: ScoringMode) => void;
	}

	let { mode, onChange }: Props = $props();

	const modes: { value: ScoringMode; label: string; tooltip: string }[] = [
		{ value: 'total', label: 'Total Points', tooltip: 'Sum of all points scored across matches' },
		{ value: 'winloss', label: 'Win/Loss', tooltip: '3 pts per win, 1 pt per tie' },
		{ value: 'weighted', label: 'Weighted', tooltip: '60% total points + 40% win/loss' }
	];
</script>

<div class="scoring-toggle">
	{#each modes as m}
		<button
			class="toggle-btn"
			class:active={mode === m.value}
			onclick={() => onChange(m.value)}
			title={m.tooltip}
		>
			{m.label}
		</button>
	{/each}
</div>

<style>
	.scoring-toggle {
		display: flex;
		background: #0d1117;
		border: 1px solid #30363d;
		border-radius: 6px;
		overflow: hidden;
	}

	.toggle-btn {
		flex: 1;
		padding: 0.4rem 0.75rem;
		background: transparent;
		border: none;
		color: #8b949e;
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.15s;
	}

	.toggle-btn:not(:last-child) {
		border-right: 1px solid #30363d;
	}

	.toggle-btn.active {
		background: #21262d;
		color: #f0f6fc;
		font-weight: 600;
	}

	.toggle-btn:hover:not(.active) {
		color: #e1e4e8;
	}
</style>
