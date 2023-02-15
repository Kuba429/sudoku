import { getInvalid, useBoardStore } from "../store";
import { Cell, cellType } from "./Cell";

export function Board() {
	const { board } = useBoardStore((state) => ({ board: state.board }));
	return (
		<div className="board">
			{board.map((row, y) =>
				row.map((cell, x) => (
					<Cell
						cell={{
							...cell,
							x,
							y,
						}}
						key={`${x}x${y}`}
					/>
				))
			)}
		</div>
	);
}

export function getBoard() {
	const board: { value: number; canChange: boolean }[][] = solveBoard(
		new Array(9)
			.fill(0)
			.map(() =>
				new Array(9).fill(0).map(() => ({ value: 0, canChange: true }))
			)
	)!;
	// shuffle the board
	const flatBoard = board.flat();
	const SHUFFLES = 20;
	for (let i = 0; i < SHUFFLES; i++) {
		// get 0th, 3rd or 6th column or row
		const p1 = Math.floor(Math.random() * 3) * 3;
		// get a column/row greater by 1 or 2 than the previous one
		// this is to assure the rows/columns are in the same 3x3 square; ex p1=1, p2=3
		// as long as the columns/rows are in the same square, swapping them won't invalidate the board
		const p2 = p1 + Number(Math.random() > 0.5) + 1;
		// decide whether to shuffle rows or columns
		if (Math.random() > 0.5) {
			// shuffle rows
			const buff = board[p1];
			board[p1] = board[p2];
			board[p2] = buff;
		} else {
			// shuffle columns
			board.forEach((row) => {
				const buff = row[p1];
				row[p1] = row[p2];
				row[p2] = buff;
			});
		}
		// swap every occurrence of 2 random values
		const target1 = Math.floor(Math.random() * 9) + 1;
		const target2 = ((target1 + Math.floor(Math.random() * 8)) % 9) + 1;
		flatBoard.forEach((c) => {
			if (c.value === target1) c.value = target2;
			else if (c.value === target2) c.value = target1;
		});
	}
	const SET_CELLS = 35;
	// make SET_CELLS unchangeable
	for (let i = 0; i < SET_CELLS; ) {
		const idx = Math.floor(Math.random() * flatBoard.length);
		if (!flatBoard[idx].canChange) continue;
		flatBoard[idx].canChange = false;
		i++;
	}
	flatBoard.forEach((c) => {
		if (c.canChange) c.value = 0;
	});

	if (!solveBoard(board)) throw new Error("Unsolvable board");
	return board;
}

export function solveBoard(ogBoard: boardType) {
	const board: cellType[][] = ogBoard.map((row, y) =>
		row.map((cell, x) => ({ ...cell, y, x }))
	);
	const flatBoard = board.flat().filter((c) => c.canChange);
	flatBoard.forEach((c) => (c.value = 0));
	let pointer = 0;
	while (pointer < flatBoard.length) {
		if (pointer < 0) {
			console.log("couldn't solve a board");
			return null;
		}
		const cell = flatBoard[pointer];
		if (cell.value === 9) {
			cell.value = 0;
			pointer--;
			continue;
		}
		cell.value++;
		if (
			getInvalid(cell.value, [], { x: cell.x, y: cell.y }, board).length
		) {
			continue;
		}
		pointer++;
	}
	return board;
}
export type boardType = ReturnType<typeof getBoard>;
