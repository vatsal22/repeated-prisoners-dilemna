<script lang="ts">
	interface Props {
		completed: number;
		total: number;
		isRunning: boolean;
	}

	let { completed, total, isRunning }: Props = $props();

	const percent = $derived(total > 0 ? Math.round((completed / total) * 100) : 0);
</script>

{#if isRunning}
	<div class="runner">
		<div class="runner-text">
			Running match {completed} of {total}...
		</div>
		<div class="progress-bar">
			<div class="progress-fill" style="width: {percent}%"></div>
		</div>
	</div>
{/if}

<style>
	.runner {
		padding: 1rem;
		background: #161b22;
		border: 1px solid #30363d;
		border-radius: 8px;
	}

	.runner-text {
		font-size: 0.85rem;
		color: #8b949e;
		margin-bottom: 0.5rem;
	}

	.progress-bar {
		height: 6px;
		background: #21262d;
		border-radius: 3px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: #238636;
		border-radius: 3px;
		transition: width 0.1s ease;
	}
</style>
