export const connections: number[][] = [];
for (let i = 0; i < 16; i++) {
	connections[i] = [];
	if (i % 4 !== 0) connections[i].push(i - 1); // left
	if (i % 4 !== 3) connections[i].push(i + 1); // right
	if (i - 4 >= 0) connections[i].push(i - 4); // up
	if (i + 4 < 16) connections[i].push(i + 4); // down
	if (i % 4 !== 0 && i - 5 >= 0) connections[i].push(i - 5); // up-left
	if (i % 4 !== 3 && i - 3 >= 0) connections[i].push(i - 3); // up-right
	if (i % 4 !== 0 && i + 3 < 16) connections[i].push(i + 3); // down-left
	if (i % 4 !== 3 && i + 5 < 16) connections[i].push(i + 5); // down-right
}
