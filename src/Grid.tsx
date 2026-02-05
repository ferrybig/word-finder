import { GRID_SIZE } from "./constants";

interface VisualizePathSection {
	start: number;
	end: number;
}
function VisualizePathSection({ start, end }: VisualizePathSection) {
	const startX = start % GRID_SIZE;
	const startY = Math.floor(start / GRID_SIZE);
	const endX = end % GRID_SIZE;
	const endY = Math.floor(end / GRID_SIZE);
	return (
		<line
			x1={`${startX * 100 + 50}`}
			y1={`${startY * 100 + 50}`}
			x2={`${endX * 100 + 50}`}
			y2={`${endY * 100 + 50}`}
			style={{ stroke: "red", strokeWidth: 5, strokeLinecap: "round" }}
		/>
	);
}
interface VisualizePathHead {
	index: number;
}
function VisualizePathHead({ index }: VisualizePathHead) {
	const x = index % GRID_SIZE;
	const y = Math.floor(index / GRID_SIZE);
	return (
		<circle
			cx={`${x * 100 + 50}`}
			cy={`${y * 100 + 50}`}
			r={20}
			style={{ stroke: "red", strokeWidth: 5, fill: "transparent" }}
		/>
	);
}
interface VisualizePath {
	path: number[];
}
function VisualizePath({ path }: VisualizePath) {
	return (
		<svg
			style={{ gridArea: `1 / 1 / span ${GRID_SIZE} / span ${GRID_SIZE}`, pointerEvents: "none" }}
			viewBox={`0 0 ${GRID_SIZE * 100} ${GRID_SIZE * 100}`}
		>
			{path.map((tile, index) =>
				index === 0 ? (
					<VisualizePathHead key={tile} index={tile} />
				) : (
					<VisualizePathSection key={tile} start={path[index - 1]} end={tile} />
				),
			)}
		</svg>
	);
}
interface Input {
	value: string;
	i: number;
	dispatch: (action: { type: "set"; key: number; value: string }) => void;
}
function Input({ value, i, dispatch }: Input) {
	return (
		<input
			className="tile"
			style={{
				gridArea: `${Math.floor(i / GRID_SIZE) + 1} / ${(i % GRID_SIZE) + 1} / span 1 / span 1`,
				fontSize: '48px',
				textTransform: 'uppercase',
			}}
			type="text"
			maxLength={2}
			value={value}
			onChange={(e) =>
				dispatch({ type: "set", key: i, value: e.target.value })
			}
			onFocus={(e) => e.target.select()}
		/>
	);
}
interface Inputs {
	items: string;
	dispatch: (action: { type: "set"; key: number; value: string }) => void;
}
function Inputs({ items, dispatch }: Inputs) {
	return (
		<>
			{Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
				<Input key={i} i={i} value={items.charAt(i)} dispatch={dispatch} />
			))}
		</>
	);
}

interface UsedCount {
	used: [start: number, total: number][];
}
function UsedCount ({ used }: UsedCount) {
	return (
		<>
			{used.map(([start], index) => (
				<span
					key={index}
					//className="used-count"
					style={{
						gridArea: `${Math.floor(index / GRID_SIZE) + 1} / ${(index % GRID_SIZE) + 1} / span 1 / span 1`,
						justifySelf: "flex-start",
						alignSelf: "flex-end",
						pointerEvents: "none",
						backgroundColor: "rgba(255, 0, 0, 0.5)",
						borderRadius: "50%",
						width: "20px",
						height: "20px",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						color: "black",
						fontSize: "12px",
					}}
				>
					{start}
				</span>
			))}
			{used.map(([, total], index) => (
				<span
					key={index}
					//className="used-count"
					style={{
						gridArea: `${Math.floor(index / GRID_SIZE) + 1} / ${(index % GRID_SIZE) + 1} / span 1 / span 1`,
						justifySelf: "flex-end",
						alignSelf: "flex-end",
						pointerEvents: "none",
						//backgroundColor: "rgba(0, 255, 0, 0.5)",
						width: "15px",
						height: "15px",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						color: "black",
						fontSize: "9px",
					}}
				>
					{total}
				</span>
			))}
		</>
	);
}

export interface Grid {
	visualizedPath: number[] | null;
	used: [start: number, total: number][];
	items: string;
	dispatch: (action: { type: "set"; key: number; value: string }) => void;
}

export function Grid({ items, dispatch, visualizedPath, used }: Grid) {
	return (
		<div className="grid" style={{
			gridTemplateColumns: `repeat(${GRID_SIZE}, 100px)`,
			gridTemplateRows: `repeat(${GRID_SIZE}, 100px)`
		}}>
			<Inputs items={items} dispatch={dispatch} />
			<UsedCount used={used} />
			{visualizedPath && <VisualizePath path={visualizedPath} />}
		</div>
	);
}
