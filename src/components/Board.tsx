import { useEffect } from "react";
import { useBoardStore } from "../store";
import { Cell } from "./Cell";

export function Board() {
	const { board, activeCell } = useBoardStore((state) => ({
		board: state.board,
		activeCell: state.activeCell,
	}));
	useEffect(() => console.log(activeCell), [activeCell]);
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
	return new Array(9)
		.fill(0)
		.map(() =>
			new Array(9).fill(0).map(() => ({ value: 0, canChange: true }))
		);
}

export type boardType = ReturnType<typeof getBoard>;
