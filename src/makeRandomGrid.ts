import { scoreGrid } from "./score";
import { findWords } from "./word-find";

const LETTERS = "abcdefghijklmnopqrstuvwxyz";

export function makeRandomGrid(size: number) {
	let randomTiles = "";
	for (let i = 0; i < size; i++) {
		const randomIndex = Math.floor(Math.random() * LETTERS.length);
		randomTiles += LETTERS.charAt(randomIndex);
	}
	return randomTiles;
}
export function makeGoodRandomGrid(
	size: number,
	{
		dict,
		connections,
		blacklistedWords,
		childCount = 2,
		iterationCount = 16,
		birthCount = 3,
	}: {
		connections: number[][];
		dict: string[];
		blacklistedWords?: { has: (input: string) => boolean } | null;
		iterationCount?: number;
		childCount?: number;
		birthCount?: number;
	},
) {
	const children: string[] = [];
	for (let i = 0; i < childCount; i++) {
		children.push(makeRandomGrid(size));
	}
	const scores: Record<string, number> = {};
	for (let iterations = 0; iterations < iterationCount; iterations++) {
		for (let i = 0; i < childCount; i++) {
			for (let j = 0; j < birthCount; j++) {
				const key = Math.floor(Math.random() * size);
				const char = LETTERS[Math.floor(Math.random() * LETTERS.length)];
				const newChild =
					children[i].substring(0, key) + char + children[i].substring(key + 1);
				children.push(newChild);
			}
		}
		for (const c of children) {
			if (scores[c] === undefined){
				const find = findWords(connections, c.split(''), dict);
				scores[c] = scoreGrid(find, size, blacklistedWords);
			}
		}
		children.sort((a, b) => scores[b] - scores[a]);
		children.splice(childCount);
	}
	return children[0];
}
