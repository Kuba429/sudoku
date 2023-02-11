import { useState } from "react";
import { Cell } from "./Cell";

export function Board() {
	const [board] = useState(getBoard());
	return (
		<div className="board">
			{board.flat().map((cell, idx) => (
				<Cell cell={cell} key={"c" + idx} />
			))}
		</div>
	);
}

function getBoard() {
	const board = new Array(9).fill(0).map(() => new Array(9).fill(0));
	return board;
}
