<script lang="ts">
	let cooperateCount = $state(0);
	let defectCount = $state(0);

	function cooperate() {
		cooperateCount++;
	}

	function defect() {
		defectCount++;
	}
</script>

<div class="grid">
	<section class="panel editor-panel">
		<h2>Strategy Editor</h2>
		<p class="placeholder">Code editor coming soon — write your strategy in JavaScript</p>
	</section>

	<section class="panel leaderboard-panel">
		<h2>Leaderboard</h2>
		<p class="placeholder">Top strategies will appear here after tournaments run</p>
	</section>
</div>

<section class="panel demo-panel">
	<h2>Quick Demo</h2>
	<p>What do you choose?</p>
	<div class="buttons">
		<button class="btn cooperate" onclick={cooperate}>🤝 Cooperate</button>
		<button class="btn defect" onclick={defect}>💀 Defect</button>
	</div>
	<div class="scores">
		<span>Cooperations: {cooperateCount}</span>
		<span>Defections: {defectCount}</span>
	</div>
</section>

<style>
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.panel {
		background: #161b22;
		border: 1px solid #21262d;
		border-radius: 8px;
		padding: 1.5rem;
	}

	h2 {
		font-size: 1.1rem;
		margin-bottom: 0.75rem;
		color: #f0f6fc;
	}

	.placeholder {
		color: #484f58;
		font-style: italic;
	}

	.demo-panel {
		text-align: center;
	}

	.buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin: 1rem 0;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 6px;
		font-size: 1rem;
		cursor: pointer;
		font-weight: 600;
		transition: opacity 0.15s;
	}

	.btn:hover {
		opacity: 0.85;
	}

	.cooperate {
		background: #238636;
		color: white;
	}

	.defect {
		background: #da3633;
		color: white;
	}

	.scores {
		display: flex;
		gap: 2rem;
		justify-content: center;
		color: #8b949e;
	}
</style>
