<script lang="ts">
	let expanded = $state(false);

	function toggle() {
		expanded = !expanded;
	}
</script>

<div class="how-to-play">
	<button class="toggle-btn" onclick={toggle}>
		<span class="icon">{expanded ? '▼' : '▶'}</span>
		<h2>How to Play</h2>
	</button>

	{#if expanded}
		<div class="content">
			<section>
				<h3>🎮 The Game</h3>
				<p>
					The <strong>Prisoner's Dilemma</strong> is a classic game theory scenario. In each round,
					you and your opponent simultaneously choose to either:
				</p>
				<ul>
					<li><strong>Cooperate (C)</strong> - Work together</li>
					<li><strong>Defect (D)</strong> - Betray the other player</li>
				</ul>

				<div class="payoff-table">
					<h4>Payoff Matrix (per round)</h4>
					<table>
						<thead>
							<tr>
								<th><strong>You</strong> / Opponent</th>
								<th>Cooperate</th>
								<th>Defect</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><strong>Cooperate</strong></td>
								<td class="good">Both get <strong>3 pts</strong></td>
								<td class="bad">You: <strong>0</strong>, Them: <strong>5</strong></td>
							</tr>
							<tr>
								<td><strong>Defect</strong></td>
								<td class="exploit">You: <strong>5</strong>, Them: <strong>0</strong></td>
								<td class="neutral">Both get <strong>1 pt</strong></td>
							</tr>
						</tbody>
					</table>
				</div>

				<p class="insight">
					💡 <strong>The dilemma:</strong> Mutual cooperation (3,3) is better than mutual defection
					(1,1), but defecting while your opponent cooperates (5,0) is even better. However, if
					everyone defects, everyone loses!
				</p>
			</section>

			<section>
				<h3>✍️ Writing a Strategy</h3>
				<p>Your strategy is a JavaScript function that decides what to do each round:</p>
				<pre><code>function strategy(opponentLastMove, history) &#123;
  // opponentLastMove: 'C', 'D', or null (first round)
  // history: array of &#123;myMove, opponentMove&#125;

  return 'C'; // or 'D'
&#125;</code></pre>
			</section>

			<section>
				<h3>🏆 Tournament Format</h3>
				<p>
					When you submit a strategy, it enters a <strong>round-robin tournament</strong>:
				</p>
				<ul>
					<li>Your strategy plays <strong>up to 1000 rounds</strong> against every other strategy</li>
					<li>Each matchup is independent (no memory between opponents)</li>
					<li>All strategies compete simultaneously</li>
				</ul>
			</section>

			<section>
				<h3>📊 Scoring Modes</h3>
				<p>Three ways to rank strategies. Toggle between them to see different winners:</p>

				<div class="scoring-mode">
					<h4>1. Total Points (Classic Axelrod)</h4>
					<p>Sum of all points earned across all matches.</p>
					<p class="mode-detail">
						<strong>Best for:</strong> Finding strategies that maximize overall cooperation and mutual
						benefit. Rewards consistency.
					</p>
				</div>

				<div class="scoring-mode">
					<h4>2. Win/Loss Record</h4>
					<p>Win = 3 pts, Tie = 1 pt, Loss = 0 pts (like soccer standings).</p>
					<p class="mode-detail">
						<strong>Best for:</strong> Finding strategies that beat the most opponents, regardless of
						margin. Rewards competitive strategies.
					</p>
				</div>

				<div class="scoring-mode">
					<h4>3. Weighted Score</h4>
					<p>Hybrid: 60% total points + 40% win/loss record.</p>
					<p class="mode-detail">
						<strong>Best for:</strong> Balancing cooperation (total points) with competitiveness
						(wins). Often reveals well-rounded strategies.
					</p>
				</div>
			</section>

			<section>
				<h3>🎯 Strategy Tips</h3>
				<ul>
					<li>
						<strong>Always defecting</strong> beats naive cooperators but loses to everyone else
					</li>
					<li><strong>Always cooperating</strong> gets exploited by defectors</li>
					<li><strong>Tit for Tat</strong> is hard to beat but not unbeatable</li>
					<li>
						<strong>Forgiveness</strong> can help recover from mistakes or noise (try Tit for Two
						Tats)
					</li>
					<li><strong>Testing</strong> your opponent early can reveal their strategy</li>
					<li>Consider the <strong>meta-game</strong>: what strategies will others submit?</li>
				</ul>
			</section>

			<section>
				<h3>🚀 The Challenge</h3>
				<p class="challenge">
					Can you discover a strategy better than the classic <strong>Tit for Tat</strong>? When
					everyone knows the textbook strategies and can specifically counter them, what actually
					wins?
				</p>
			</section>
		</div>
	{/if}
</div>

<style>
	.how-to-play {
		background: #161b22;
		border: 1px solid #21262d;
		border-radius: 8px;
		margin-bottom: 1.5rem;
		overflow: hidden;
	}

	.toggle-btn {
		width: 100%;
		padding: 1rem 1.5rem;
		background: transparent;
		border: none;
		color: #f0f6fc;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		transition: background 0.15s;
	}

	.toggle-btn:hover {
		background: #21262d;
	}

	.icon {
		font-size: 0.9rem;
		color: #8b949e;
	}

	h2 {
		margin: 0;
		font-size: 1.2rem;
		font-weight: 600;
	}

	.content {
		padding: 0 1.5rem 1.5rem 1.5rem;
		color: #c9d1d9;
	}

	section {
		margin-bottom: 2rem;
	}

	section:last-child {
		margin-bottom: 0;
	}

	h3 {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		color: #58a6ff;
	}

	h4 {
		font-size: 0.95rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #f0f6fc;
	}

	p {
		margin-bottom: 0.75rem;
		line-height: 1.6;
		font-size: 0.9rem;
	}

	ul {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
		line-height: 1.8;
		font-size: 0.9rem;
	}

	li {
		margin-bottom: 0.4rem;
	}

	strong {
		color: #f0f6fc;
	}

	.payoff-table {
		margin: 1rem 0;
		padding: 1rem;
		background: #0d1117;
		border-radius: 6px;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 0.5rem;
		font-size: 0.85rem;
	}

	th {
		padding: 0.5rem;
		text-align: left;
		color: #8b949e;
		font-weight: 500;
		border-bottom: 1px solid #21262d;
	}

	td {
		padding: 0.6rem 0.5rem;
		border-bottom: 1px solid #21262d;
	}

	tbody tr:last-child td {
		border-bottom: none;
	}

	.good {
		color: #3fb950;
	}

	.bad {
		color: #f85149;
	}

	.exploit {
		color: #d29922;
	}

	.neutral {
		color: #8b949e;
	}

	.insight {
		padding: 0.75rem;
		background: #1c2128;
		border-left: 3px solid #58a6ff;
		border-radius: 4px;
		margin: 1rem 0;
		font-size: 0.9rem;
	}

	pre {
		background: #0d1117;
		padding: 1rem;
		border-radius: 6px;
		overflow-x: auto;
		margin: 0.75rem 0;
	}

	code {
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: 0.85rem;
		color: #c9d1d9;
	}

	.scoring-mode {
		margin: 1rem 0;
		padding: 0.75rem;
		background: #0d1117;
		border-radius: 6px;
		border-left: 3px solid #8b949e;
	}

	.scoring-mode h4 {
		margin-bottom: 0.4rem;
		color: #58a6ff;
	}

	.scoring-mode p {
		margin-bottom: 0.4rem;
	}

	.mode-detail {
		font-size: 0.85rem;
		color: #8b949e;
		font-style: italic;
	}

	.challenge {
		padding: 1rem;
		background: linear-gradient(135deg, #1c2128 0%, #0d1117 100%);
		border: 1px solid #30363d;
		border-radius: 6px;
		text-align: center;
		font-size: 0.95rem;
		color: #f0f6fc;
	}
</style>
