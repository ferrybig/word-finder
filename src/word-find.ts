export interface FoundWord {
	word: string;
	paths: number[][];
}

function findWordRecursively(
	connections: number[][],
	data: string[],
	// Sorted dictionary
	dict: string[],
	// Minium index in dict to consider
	dictMin: number,
	// Maximum index in dict to consider
	dictMax: number,
	// Currently explored path
	currentPath: number[],
	// Next routes
	next: number[],
	// Callback when a word is found
	found: (word: string, path: number[]) => void,
) {
	//console.groupCollapsed('Current path:', currentPath.join(' → '), 'Next:', next.join(', '));
	//const currentWord = currentPath.map(i => data[i]).join('');
	for (const connection of next) {
		if (currentPath.includes(connection)) {
			continue;
		}
		try {
			currentPath.push(connection);
			const currentWord = currentPath.map((i) => data[i]).join("");
			//console.log('Exploring', currentWord, 'path:', currentPath.join(' → '));

			let newDictMin = dictMin;
			let newDictMax = dictMax;
			// Use binary search to find the an index matching the new prefix
			let foundIndex = -1;
			while (newDictMin <= newDictMax) {
				const mid = Math.floor((newDictMin + newDictMax) / 2);
				const dictWord = dict[mid].slice(0, currentWord.length);
				if (dictWord === currentWord) {
					foundIndex = mid;
					break;
				} else if (dictWord < currentWord) {
					newDictMin = mid + 1;
				} else {
					newDictMax = mid - 1;
				}
			}
			if (foundIndex === -1) {
				// No words with this prefix
				//console.log('No words with prefix', currentWord, currentPath.join(' → '));
				continue;
			}

			// Narrow down dictionary range
			let newDictMinMin = newDictMin;
			let newDictMinMax = foundIndex;
			while (newDictMinMin < newDictMinMax) {
				const mid = Math.floor((newDictMinMin + newDictMinMax) / 2);
				const dictWord = dict[mid].slice(0, currentWord.length);
				if (dictWord === currentWord) {
					newDictMinMax = mid;
				} else {
					newDictMinMin = mid + 1;
				}
			}
			newDictMin = newDictMinMin;

			let newDictMaxMin = foundIndex;
			let newDictMaxMax = newDictMax;
			while (newDictMaxMin < newDictMaxMax) {
				const mid = Math.floor((newDictMaxMin + newDictMaxMax + 1) / 2);
				const dictWord = dict[mid].slice(0, currentWord.length);
				if (dictWord === currentWord) {
					newDictMaxMin = mid;
				} else {
					newDictMaxMax = mid - 1;
				}
			}
			newDictMax = newDictMaxMin;

			// Check if we have a full word
			if (dict[newDictMin] === currentWord) {
				found(currentWord, [...currentPath]);
			}

			// Continue searching
			findWordRecursively(
				connections,
				data,
				dict,
				newDictMin,
				newDictMax,
				currentPath,
				connections[connection],
				found,
			);
		} finally {
			currentPath.pop();
		}
	}
	//console.groupEnd();
}

export function findWords(
	connections: number[][],
	data: string[],
	dict: string[],
): FoundWord[] {
	console.time("findWords");
	const foundWords: Map<string, number[][]> = new Map();
	const indexesOfData = data.map((_, i) => i);
	findWordRecursively(
		connections,
		data,
		dict,
		0,
		dict.length - 1,
		[],
		indexesOfData,
		(word, path) => {
			const res = foundWords.get(word);
			if (!res) {
				foundWords.set(word, []);
			} else {
				res.push(path);
			}
		},
	);
	const res = Array.from(foundWords.entries()).map(([word, paths]) => ({
		word,
		paths,
	}));
	console.timeEnd("findWords");
	return res;
}
