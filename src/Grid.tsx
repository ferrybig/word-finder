interface VisualizePathSection {
	start: number;
	end: number;
}
function VisualizePathSection({ start, end }: VisualizePathSection) {
	const startX = start % 4;
	const startY = Math.floor(start / 4);
	const endX = end % 4;
	const endY = Math.floor(end / 4);
	return (
		<line
			x1={`${startX * 100 + 50}`}
			y1={`${startY * 100 + 50}`}
			x2={`${endX * 100 + 50}`}
			y2={`${endY * 100 + 50}`}
			style={{ stroke: "red", strokeWidth: 10, strokeLinecap: "round" }}
		/>
	);
}
interface VisualizePathHead {
	index: number;
}
function VisualizePathHead({ index }: VisualizePathHead) {
	const x = index % 4;
	const y = Math.floor(index / 4);
	return (
		<circle
			cx={`${x * 100 + 50}`}
			cy={`${y * 100 + 50}`}
			r={20}
			style={{ fill: "red" }}
		/>
	);
}
interface VisualizePath {
	path: number[];
}
function VisualizePath({ path }: VisualizePath) {
	return (
		<svg
			style={{ gridArea: "1 / 1 / span 4 / span 4", pointerEvents: "none" }}
			viewBox="0 0 400 400"
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

export interface Grid {
	items: string;
	dispatch: (action: { type: "set"; key: number; value: string }) => void;
	visualizedPath: number[] | null;
}

export function Grid({ items, dispatch, visualizedPath }: Grid) {
	return (
		<div className="grid">
			{Array.from({ length: 16 }).map((_, i) => (
				<input
					key={i}
					className="tile"
					style={{
						gridArea: `${Math.floor(i / 4) + 1} / ${(i % 4) + 1} / span 1 / span 1`,
					}}
					type="text"
					maxLength={2}
					value={items.charAt(i)}
					onChange={(e) =>
						dispatch({ type: "set", key: i, value: e.target.value })
					}
					onFocus={(e) => e.target.select()}
				/>
			))}
			{visualizedPath && <VisualizePath path={visualizedPath} />}
		</div>
	);
}
