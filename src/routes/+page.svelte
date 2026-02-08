<script lang="ts">
	import { onMount } from 'svelte';
	import Editor from '$lib/components/Editor.svelte';
	import Leaderboard from '$lib/components/Leaderboard.svelte';
	import TournamentRunner from '$lib/components/TournamentRunner.svelte';
	import Results from '$lib/components/Results.svelte';
	import Visualizer from '$lib/components/Visualizer.svelte';
	import HowToPlay from '$lib/components/HowToPlay.svelte';
	import { getBuiltinStrategies, compileStrategy, validateStrategy } from '$lib/strategies.js';
	import { runTournament } from '$lib/engine.js';
	import { loadStrategies, saveStrategies } from '$lib/persistence.js';
	import { encodeStrategy, decodeStrategy } from '$lib/sharing.js';
	import type { MatchResult, ScoringMode } from '$lib/types.js';
	import {
		getStrategies,
		getMatches,
		getScoringMode,
		setScoringMode,
		getIsRunning,
		setIsRunning,
		getProgress,
		setProgress,
		getUserStrategyName,
		setUserStrategyName,
		getSelectedMatch,
		setSelectedMatch,
		getLeaderboard,
		getUserMatches,
		addStrategy,
		setStrategies,
		setMatches,
		getSelectedStrategyForResults,
		setSelectedStrategyForResults,
		getSelectedStrategyMatches
	} from '$lib/state.svelte.js';

	let sharedName = $state('');
	let sharedCode = $state('');
	let showCopied = $state(false);

	onMount(() => {
		// Load builtins
		const builtins = getBuiltinStrategies();
		for (const b of builtins) addStrategy(b);

		// Load saved user strategies
		const saved = loadStrategies();
		for (const s of saved) {
			addStrategy(s);
			setUserStrategyName(s.name);
		}

		// Check URL for shared strategy
		const decoded = decodeStrategy(window.location.href);
		if (decoded) {
			sharedName = decoded.name;
			sharedCode = decoded.code;
			// Clean the URL
			const url = new URL(window.location.href);
			url.searchParams.delete('strategy');
			window.history.replaceState({}, '', url.toString());
		}
	});

	async function handleSubmit(name: string, code: string) {
		const validation = validateStrategy(code);
		if (!validation.valid) return;

		const fn = compileStrategy(code);
		const userStrategy = { name, code, fn, isBuiltin: false };

		// Remove old user strategy if exists
		const oldName = getUserStrategyName();
		if (oldName) {
			const strategies = getStrategies().filter((s) => s.name !== oldName);
			setStrategies(strategies);
		}

		addStrategy(userStrategy);
		setUserStrategyName(name);
		saveStrategies(getStrategies());

		// Run tournament
		setIsRunning(true);
		setProgress(0, 0);

		const allStrategies = getStrategies();
		const results = await runTournament(allStrategies, (completed, total) => {
			setProgress(completed, total);
		});

		setMatches(results);
		setIsRunning(false);
	}

	function handleScoringChange(mode: ScoringMode) {
		setScoringMode(mode);
	}

	function handleViewResults(strategyName: string) {
		setSelectedStrategyForResults(strategyName);
	}

	function handleWatchMatch(match: MatchResult) {
		setSelectedMatch(match);
	}

	function handleCloseVisualizer() {
		setSelectedMatch(null);
	}

	function handleShare() {
		const name = getUserStrategyName();
		if (!name) return;
		const strategy = getStrategies().find((s) => s.name === name);
		if (!strategy) return;
		const url = encodeStrategy(strategy.name, strategy.code);
		navigator.clipboard.writeText(url).then(() => {
			showCopied = true;
			setTimeout(() => (showCopied = false), 2000);
		});
	}
</script>

<HowToPlay />

<div class="grid">
	<section class="panel editor-panel">
		<h2>Strategy Editor</h2>
		<Editor
			onSubmit={handleSubmit}
			disabled={getIsRunning()}
			initialName={sharedName}
			initialCode={sharedCode}
		/>
		{#if getUserStrategyName()}
			<div class="share-row">
				<button class="share-btn" onclick={handleShare}>
					{showCopied ? 'Copied!' : 'Share Strategy'}
				</button>
			</div>
		{/if}
	</section>

	<section class="panel leaderboard-panel">
		<Leaderboard
			entries={getLeaderboard()}
			scoringMode={getScoringMode()}
			onScoringChange={handleScoringChange}
			onViewResults={handleViewResults}
			matches={getMatches()}
		/>
	</section>
</div>

<TournamentRunner
	completed={getProgress().completed}
	total={getProgress().total}
	isRunning={getIsRunning()}
/>

{#if getSelectedStrategyForResults() && getSelectedStrategyMatches().length > 0 && getSelectedStrategyForResults() !== getUserStrategyName()}
	<section class="panel">
		<div class="results-header">
			<h2>Strategy Results</h2>
			<button class="close-btn" onclick={() => setSelectedStrategyForResults(null)}>
				Close
			</button>
		</div>
		<Results
			strategyName={getSelectedStrategyForResults()!}
			matches={getSelectedStrategyMatches()}
			onWatch={handleWatchMatch}
		/>
	</section>
{/if}

{#if getSelectedMatch()}
	<section class="panel">
		<Visualizer match={getSelectedMatch()!} onClose={handleCloseVisualizer} />
	</section>
{/if}


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
		margin-bottom: 1.5rem;
	}

	h2 {
		font-size: 1.1rem;
		margin-bottom: 0.75rem;
		color: #f0f6fc;
	}

	.share-row {
		margin-top: 0.75rem;
		display: flex;
		justify-content: flex-end;
	}

	.share-btn {
		padding: 0.4rem 0.8rem;
		background: #21262d;
		border: 1px solid #30363d;
		border-radius: 6px;
		color: #8b949e;
		font-size: 0.85rem;
		cursor: pointer;
		transition: all 0.15s;
	}

	.share-btn:hover {
		color: #e1e4e8;
		background: #30363d;
	}

	.results-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.close-btn {
		padding: 0.3rem 0.6rem;
		background: #21262d;
		border: 1px solid #30363d;
		border-radius: 4px;
		color: #8b949e;
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.15s;
	}

	.close-btn:hover {
		background: #30363d;
		color: #e1e4e8;
	}

	@media (max-width: 768px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
