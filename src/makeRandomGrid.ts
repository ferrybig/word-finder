import { scoreGrid } from "./score";
import { generateUsedCounts } from "./usedCounts";
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
		childCount = 4,
		iterationCount = 64,
		birthCount = 1,
	}: {
		connections: number[][];
		dict: string[];
		blacklistedWords?: { has: (input: string) => boolean } | null;
		iterationCount?: number;
		childCount?: number;
		birthCount?: number;
	},
) {
	console.time("makeGoodRandomGrid");
	const children: string[] = [];
	for (let i = 0; i < childCount; i++) {
		children.push(makeRandomGrid(size));
	}
	const scores: Record<string, {score: number, used: [number, number][]}> = {};
	for (let iterations = 0; iterations < iterationCount; iterations++) {
		for (const grid of children) {
			if (scores[grid] === undefined){
				const find = findWords(connections, grid, dict);
				scores[grid] = {
					score: scoreGrid(find, grid, blacklistedWords),
					used: generateUsedCounts(find, grid.length),
				};
			}
		}
		for (let i = 0; i < childCount; i++) {
			for (let j = 0; j < birthCount; j++) {
				// const key = Math.floor(Math.random() * size);
				// A better way to choose the key is to use the used counts to prefer changing rarely used letters
				let total = 0;
				for (const [, count] of scores[children[i]].used) {
					total += count === 0 ? 10 : 1/count;
				}
				let rnd = Math.random() * total;
				let key = 0;
				for (; key < scores[children[i]].used.length && rnd > 0; key++) {
					const count = scores[children[i]].used[key][1];
					rnd -= count === 0 ? 10 : 1/count;
				}
				key--;
				const char = LETTERS[Math.floor(Math.random() * LETTERS.length)];
				const newChild =
					children[i].substring(0, key) + char + children[i].substring(key + 1);
				children.push(newChild);
			}
		}
		for (const grid of children) {
			if (scores[grid] === undefined){
				const find = findWords(connections, grid, dict);
				scores[grid] = {
					score: scoreGrid(find, grid, blacklistedWords),
					used: generateUsedCounts(find, grid.length),
				};
			}
		}
		children.sort((a, b) => scores[b].score - scores[a].score);
		children.splice(childCount);
	}
	console.log("Called findWords", Object.values(scores).length, "times");
	console.timeEnd("makeGoodRandomGrid");
	return children[0];
}
