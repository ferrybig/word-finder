import { GRID_SIZE } from "./constants";

export const connections: number[][] = [];
for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
	connections[i] = [];
	if (i % GRID_SIZE !== 0) connections[i].push(i - 1); // left
	if (i % GRID_SIZE !== GRID_SIZE - 1) connections[i].push(i + 1); // right
	if (i - GRID_SIZE >= 0) connections[i].push(i - GRID_SIZE); // up
	if (i + GRID_SIZE < GRID_SIZE * GRID_SIZE) connections[i].push(i + GRID_SIZE); // down
	if (i % GRID_SIZE !== 0 && i - GRID_SIZE - 1 >= 0) connections[i].push(i - GRID_SIZE - 1); // up-left
	if (i % GRID_SIZE !== GRID_SIZE - 1 && i - GRID_SIZE + 1 >= 0) connections[i].push(i - GRID_SIZE + 1); // up-right
	if (i % GRID_SIZE !== 0 && i + GRID_SIZE - 1 < GRID_SIZE * GRID_SIZE) connections[i].push(i + GRID_SIZE - 1); // down-left
	if (i % GRID_SIZE !== GRID_SIZE - 1 && i + GRID_SIZE + 1 < GRID_SIZE * GRID_SIZE) connections[i].push(i + GRID_SIZE + 1); // down-right
}
