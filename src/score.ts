import type { FoundWord } from "./word-find";

export function scoreGrid(
	found: FoundWord[],
	size: number,
	blacklistedWords?: { has: (input: string) => boolean } | null,
) {
	let score = 0;
	let bad = 0;
	const usedTiles: number[] = [];
	for (let i = 0; i < size; i++) {
		usedTiles.push(0);
	}
	for (const entry of found) {
		const isBad = blacklistedWords?.has(entry.word);
		if (isBad) {
			bad++;
		}
		if (entry.paths.length !== 1) {
			continue;
		}
		for (const p of entry.paths[0]) {
			usedTiles[p] += isBad ? 1 : -1;
		}
		score += 2 ** entry.word.length;
	}
	// Tiles that barely get used score lower
	const lowestUsage = Math.max(0.1, Math.min(...usedTiles));
	// A better spread through the board gives an higher score
	const spread = (Math.max(...usedTiles) - Math.min(...usedTiles)) / 10 + 1;
	return bad ? -bad : (score * lowestUsage) / spread;
}
