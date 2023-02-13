import { getInvalid, useBoardStore } from "../store";
import { Cell, cellType } from "./Cell";

export function Board() {
	const { board, setBoard } = useBoardStore((state) => ({
		board: state.board,
		setBoard: state.setBoard,
	}));
	const handleSolve = () => {
		const solved = solveBoard(board);
		solved && setBoard(solved);
	};
	return (
		<>
			<button onClick={handleSolve}>solve</button>
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
		</>
	);
}

export function getBoard() {
	return new Array(9)
		.fill(0)
		.map(() =>
			new Array(9).fill(0).map(() => ({ value: 0, canChange: true }))
		);
}

export function solveBoard(ogBoard: boardType) {
	const board: cellType[][] = ogBoard.map((row, y) =>
		row.map((cell, x) => ({ ...cell, y, x }))
	);
	const flatBoard = board.flat().filter((c) => c.canChange);
	flatBoard.forEach((c) => (c.value = 0));
	let pointer = 0;
	while (pointer < flatBoard.length) {
		if (pointer < 0) return null;
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
