import { solveBoard } from "./Board";
import { useBoardStore } from "../store";

export function DevSolveButton() {
	const { board, setBoard } = useBoardStore((state) => ({
		board: state.board,
		setBoard: state.setBoard,
	}));
	const handleClick = () => {
		const solved = solveBoard(
			board.map((r) =>
				r.map((c) => (c.value === 0 ? c : { ...c, canChange: false }))
			)
		);
		solved && setBoard(solved);
	};
	return <button onClick={handleClick}>Solve</button>;
}
