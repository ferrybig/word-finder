import "./App.css";
import { useDeferredValue, useMemo, useReducer, useState } from "react";
import { dictionary, GRID_SIZE } from "./constants";
import { Grid } from "./Grid";
import { connections } from "./gridConnections";
import { makeGoodRandomGrid, makeRandomGrid } from "./makeRandomGrid";
import { scoreGrid } from "./score";
import { generateUsedCounts } from "./usedCounts";
import { findWords } from "./word-find";

interface Path {
	path: number[];
	setVisualizedPath: (path: number[] | null) => void;
}
function Path({ path, setVisualizedPath }: Path) {
	return (
		<span
			className="path"
			onMouseEnter={() => setVisualizedPath(path)}
			onMouseLeave={() => setVisualizedPath(null)}
		>
			{path.join("→")}
		</span>
	);
}

interface Paths {
	paths: number[][];
	setVisualizedPath: (path: number[] | null) => void;
}
function Paths({ paths, setVisualizedPath }: Paths) {
	const children = [];
	for (let i = 0; i < paths.length; i++) {
		if (i > 0) {
			children.push(", ");
		}
		children.push(
			<Path
				key={paths[i].join("-")}
				path={paths[i]}
				setVisualizedPath={setVisualizedPath}
			/>,
		);
	}
	return <>{children}</>;
}

function reducer(
	state: string,
	action:
		| { type: "set"; key: number; value: string }
		| { type: "set-all"; value: string },
): string {
	switch (action.type) {
		case "set": {
			let char = state.charAt(action.key);
			for (const c of action.value.toLowerCase()) {
				if (((c >= "a" && c <= "z") || c === " ") && c !== char) {
					char = c;
					break;
				}
			}
			return (
				state.substring(0, action.key) + char + state.substring(action.key + 1)
			);
		}
		case "set-all": {
			return `${action.value}${" ".repeat(GRID_SIZE * GRID_SIZE)}`.substring(
				0,
				GRID_SIZE * GRID_SIZE,
			);
		}
		default:
			return state;
	}
}

function App() {
	const [state, dispatch] = useReducer(
		reducer,
		"abcdefghijklmnopqrstuvwxyz"
			.repeat(Math.ceil((GRID_SIZE * GRID_SIZE) / 26))
			.substring(0, GRID_SIZE * GRID_SIZE),
	);
	const [visualizedPath, setVisualizedPath] = useState<number[] | null>(null);
	const deferredState = useDeferredValue(state);
	const words = useMemo(
		() => findWords(connections, deferredState, dictionary),
		[deferredState],
	);
	const score = useMemo(
		() => scoreGrid(words, deferredState),
		[deferredState, words],
	);
	const used = useMemo(() => generateUsedCounts(words), [words]);
	return (
		<>
			<Grid
				items={state}
				dispatch={dispatch}
				visualizedPath={visualizedPath}
				used={used}
			/>
			<button
				type="button"
				onClick={() => {
					dispatch({
						type: "set-all",
						value: makeRandomGrid(GRID_SIZE * GRID_SIZE),
					});
				}}
			>
				Randomize
			</button>
			<button
				type="button"
				onClick={() => {
					dispatch({
						type: "set-all",
						value: makeGoodRandomGrid(GRID_SIZE * GRID_SIZE, {
							connections,
							dict: dictionary,
						}),
					});
				}}
			>
				Generate a good random grid
			</button>
			<p>Score: {score}</p>
			<p>Found {words.length} words:</p>
			<ul>
				{words.map((wordObj) => (
					<li key={wordObj.word}>
						{wordObj.word} (
						<Paths
							paths={wordObj.paths}
							setVisualizedPath={setVisualizedPath}
						/>
						)
					</li>
				))}
			</ul>
		</>
	);
}

export default App;
