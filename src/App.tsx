import "./App.css";
import { useDeferredValue, useMemo, useReducer, useState } from "react";
import compiledWords from "./compiled-words.json" with { type: "json" };
import { Grid } from "./Grid";
import { connections } from "./gridConnections";
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
			return (`${action.value}                `).substring(0, 16);
		}
		default:
			return state;
	}
}

function App() {
	const [state, dispatch] = useReducer(reducer, "abcdefghijklmnop");
	const [visualizedPath, setVisualizedPath] = useState<number[] | null>(null);
	const deferredState = useDeferredValue(state);
	const words = useMemo(
		() =>
			findWords(
				connections,
				deferredState.split(""),
				compiledWords as string[],
			),
		[deferredState],
	);
	return (
		<>
			<Grid items={state} dispatch={dispatch} visualizedPath={visualizedPath} />
			<button
				type="button"
				onClick={() => {
					const letters = "abcdefghijklmnopqrstuvwxyz";
					let randomTiles = "";
					for (let i = 0; i < 16; i++) {
						const randomIndex = Math.floor(Math.random() * letters.length);
						randomTiles += letters.charAt(randomIndex);
					}
					dispatch({ type: "set-all", value: randomTiles });
				}}
			>
				Randomize
			</button>
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
