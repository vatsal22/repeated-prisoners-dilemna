import type { Strategy } from './types.js';
import { compileStrategy } from './strategies.js';

const STORAGE_KEY = 'pd-user-strategies';

interface StoredStrategy {
	name: string;
	code: string;
}

export function saveStrategies(strategies: Strategy[]): void {
	const toStore: StoredStrategy[] = strategies
		.filter((s) => !s.isBuiltin)
		.map((s) => ({ name: s.name, code: s.code }));
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
	} catch {
		// localStorage full or unavailable
	}
}

export function loadStrategies(): Strategy[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const stored: StoredStrategy[] = JSON.parse(raw);
		return stored.map((s) => ({
			name: s.name,
			code: s.code,
			fn: compileStrategy(s.code),
			isBuiltin: false
		}));
	} catch {
		return [];
	}
}
