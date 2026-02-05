import compiledWordsMostUsed from "./compiled-words-most-used.json" with {
	type: "json",
};
import compiledWordsOpentaal from "./compiled-words-opentaal.json" with {
	type: "json",
};

export const GRID_SIZE = 4;
/**
 * The maximum number of klinkers (vowels) that a grid can have before it starts to heavily penalize the score. The default value is 5, which means that if a grid has more than 5 klinkers, the score will be divided by 2 for each additional klinker. You can adjust this value to make the scoring more or less strict regarding the number of klinkers in the grid.
 */
export const KLINKERS_MAX = 5;
/**
 * The penalty factor for each klinker above the maximum allowed. The default value is 2, which means that for each klinker above the maximum, the score will be divided by 2. You can adjust this value to make the penalty for extra klinkers more or less severe.
 */
export const KLINKERS_PENALTY = 2;
/**
 * The dictionary to use for finding words. The "most used" dictionary is smaller, but is more familiar for the end users, while the "opentaal" dictionary is larger, but contains more obscure words. You can switch between them by changing the `true` to `false` in the line below.
 * Note that directory objects NEED to be sorted alphabetically, so if you want to use your own dictionary, make sure to sort it and save it as a JSON file in the `src` folder, and then import it here.
 */
export const dictionary: string[] = (
	true ? compiledWordsMostUsed : compiledWordsOpentaal
) as string[];
