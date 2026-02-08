<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<title>Prisoner's Dilemma Tournament</title>
	<meta name="description" content="Submit a strategy. Battle everyone else's. Climb the leaderboard." />
</svelte:head>

<div class="app">
	<header>
		<h1>Prisoner's Dilemma Tournament</h1>
		<p class="tagline">Submit a strategy. Battle everyone else's. Climb the leaderboard.</p>
	</header>

	<main>
		{@render children()}
	</main>

	<footer>
		<p>An experiment in crowdsourced game theory</p>
	</footer>
</div>

<style>
	:global(*, *::before, *::after) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
		background: #0f1117;
		color: #e1e4e8;
		line-height: 1.6;
	}

	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	header {
		text-align: center;
		padding: 2rem 1rem;
		border-bottom: 1px solid #21262d;
	}

	h1 {
		font-size: 1.8rem;
		font-weight: 700;
		color: #f0f6fc;
	}

	.tagline {
		margin-top: 0.5rem;
		color: #8b949e;
		font-size: 1rem;
	}

	main {
		flex: 1;
		max-width: 1200px;
		width: 100%;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	footer {
		text-align: center;
		padding: 1.5rem 1rem;
		border-top: 1px solid #21262d;
		color: #484f58;
		font-size: 0.85rem;
	}
</style>
