<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { EditorView, basicSetup } from 'codemirror';
	import { javascript } from '@codemirror/lang-javascript';
	import { oneDark } from '@codemirror/theme-one-dark';
	import { EditorState } from '@codemirror/state';
	import { TEMPLATES } from '$lib/strategies.js';
	import { validateStrategy } from '$lib/strategies.js';

	interface Props {
		onSubmit: (name: string, code: string) => void;
		disabled?: boolean;
		initialName?: string;
		initialCode?: string;
	}

	let { onSubmit, disabled = false, initialName = '', initialCode = '' }: Props = $props();

	let strategyName = $state('My Strat');
	let selectedTemplate = $state(-1);
	let code = $state(TEMPLATES[0].code);
	let validation = $state<{ valid: boolean; error?: string }>({ valid: true });
	let editorContainer: HTMLDivElement;
	let view: EditorView | undefined;

	// Initialize from props once
	let initialized = false;

	$effect(() => {
		if (!initialized) {
			initialized = true;
			if (initialName) strategyName = initialName;
			if (initialCode) code = initialCode;
		}
	});

	$effect(() => {
		validation = validateStrategy(code);
	});

	// Sync initialName/initialCode from shared URL
	$effect(() => {
		if (initialName) {
			strategyName = initialName;
		}
	});

	$effect(() => {
		if (initialCode && view) {
			code = initialCode;
			view.dispatch({
				changes: { from: 0, to: view.state.doc.length, insert: initialCode }
			});
			selectedTemplate = -1;
		}
	});

	function handleTemplateChange(e: Event) {
		const idx = parseInt((e.target as HTMLSelectElement).value);
		selectedTemplate = idx;
		if (idx >= 0 && view) {
			const template = TEMPLATES[idx];
			code = template.code;
			view.dispatch({
				changes: { from: 0, to: view.state.doc.length, insert: template.code }
			});
		}
	}

	function handleSubmit() {
		if (!strategyName.trim() || !validation.valid || disabled) return;
		onSubmit(strategyName.trim(), code);
	}

	onMount(() => {
		const startDoc = code;
		const state = EditorState.create({
			doc: startDoc,
			extensions: [
				basicSetup,
				javascript(),
				oneDark,
				EditorView.updateListener.of((update) => {
					if (update.docChanged) {
						code = update.state.doc.toString();
					}
				}),
				EditorView.theme({
					'&': { height: '300px', fontSize: '14px' },
					'.cm-scroller': { overflow: 'auto' }
				})
			]
		});
		view = new EditorView({ state, parent: editorContainer });
	});

	onDestroy(() => {
		view?.destroy();
	});
</script>

<div class="editor-wrapper">
	<div class="editor-header">
		<input
			type="text"
			class="name-input"
			placeholder="Name your strategy..."
			bind:value={strategyName}
			{disabled}
		/>
		<select class="template-select" value={selectedTemplate} onchange={handleTemplateChange}>
			<option value={-1}>Load template...</option>
			{#each TEMPLATES as template, i}
				<option value={i}>{template.name} — {template.description}</option>
			{/each}
		</select>
	</div>

	<div class="cm-wrapper" bind:this={editorContainer}></div>

	{#if !validation.valid && validation.error}
		<div class="error">{validation.error}</div>
	{/if}

	<div class="editor-footer">
		<button
			class="submit-btn"
			onclick={handleSubmit}
			disabled={!strategyName.trim() || !validation.valid || disabled}
		>
			{#if disabled}
				Running...
			{:else}
				Submit & Run Tournament
			{/if}
		</button>
	</div>
</div>

<style>
	.editor-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.editor-header {
		display: flex;
		gap: 0.75rem;
	}

	.name-input {
		flex: 1;
		padding: 0.5rem 0.75rem;
		background: #0d1117;
		border: 1px solid #30363d;
		border-radius: 6px;
		color: #e1e4e8;
		font-size: 0.9rem;
	}

	.name-input::placeholder {
		color: #484f58;
	}

	.template-select {
		padding: 0.5rem 0.75rem;
		background: #0d1117;
		border: 1px solid #30363d;
		border-radius: 6px;
		color: #e1e4e8;
		font-size: 0.85rem;
		max-width: 280px;
	}

	.cm-wrapper {
		border: 1px solid #30363d;
		border-radius: 6px;
		overflow: hidden;
	}

	.error {
		padding: 0.5rem 0.75rem;
		background: #3d1114;
		border: 1px solid #da3633;
		border-radius: 6px;
		color: #f85149;
		font-size: 0.85rem;
		font-family: monospace;
	}

	.editor-footer {
		display: flex;
		justify-content: flex-end;
	}

	.submit-btn {
		padding: 0.6rem 1.25rem;
		background: #238636;
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.15s;
	}

	.submit-btn:hover:not(:disabled) {
		opacity: 0.85;
	}

	.submit-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
