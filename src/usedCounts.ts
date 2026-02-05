import { GRID_SIZE } from "./constants";
import type { FoundWord } from "./word-find";

export function generateUsedCounts(words: FoundWord[], size = GRID_SIZE * GRID_SIZE): [start: number, total: number][] {
	const usedCounts: [number, number][] = [];
	for (let i = 0; i < size; i++) {
		usedCounts.push([0, 0]);
	}
	for (const entry of words) {
		usedCounts[entry.paths[0][0]][0]++;
		for (const p of entry.paths[0]) {
			usedCounts[p][1]++;
		}
	}
	return usedCounts;
}
