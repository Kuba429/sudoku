import { create } from "zustand";
import { boardType, getBoard } from "./components/Board";
import { position } from "./components/Cell";

interface BoardState {
	board: boardType;
	activeCell: position | null;
	commonZone: position[];
	invalid: position[];
	setActiveCell: (props: position) => void;
	setCellValue: (newValue: number) => void;
	setBoard: (newBoard: boardType) => void;
}
export const useBoardStore = create<BoardState>((set) => ({
	board: getBoard(),
	activeCell: null,
	commonZone: [],
	invalid: [],
	setBoard: (board) => set(() => ({ board })),
	setActiveCell: ({ x, y }) =>
		set(() => ({
			activeCell: { x, y },
			commonZone: getCommonZone({ x, y }),
		})),
	setCellValue: (newValue) =>
		set((state) => {
			if (!state.activeCell) return {};
			const itemToChange =
				state.board[state.activeCell.y][state.activeCell.x];
			if (!itemToChange.canChange) return {};
			itemToChange.value = newValue;
			return {
				board: state.board,
				invalid: getInvalid(
					newValue,
					state.invalid,
					state.activeCell,
					state.board
				),
			};
		}),
}));

export function getInvalid(
	valueToCheck: number,
	invalid: position[],
	activeCell: position,
	board: boardType
) {
	invalid = invalid.filter((cell) => !isValid(cell.x, cell.y, board));
	const newInvalid = getCommonZone({ ...activeCell }).filter(
		(cell) =>
			board[cell.y][cell.x].value !== 0 &&
			board[cell.y][cell.x].value === valueToCheck
	);
	if (newInvalid.length > 3) return invalid.concat(newInvalid);
	return invalid;
}

function isValid(x: number, y: number, board: boardType) {
	return (
		board[y][x].value === 0 || // remember there can be multiple 0s in a zone
		getCommonZone({ x, y }).every(
			(cell) =>
				(cell.x === x && cell.y === y) || // ignore the cell that's being currently checked
				board[cell.y][cell.x].value !== board[y][x].value
		)
	);
}

function getCommonZone(cell: position) {
	const peers: position[] = [];
	// square
	// what's happening:
	// cells inside a square happen to have the same Math.floor(x/3) and Math.floor(y/3) as other cells in the same square
	for (let y = 0; y < 9; y++) {
		if (Math.floor(cell.y / 3) !== Math.floor(y / 3)) continue;
		for (let x = 0; x < 9; x++) {
			if (Math.floor(cell.x / 3) !== Math.floor(x / 3)) continue;
			peers.push({ x, y });
		}
	}
	for (let i = 0; i < 9; i++) {
		// column
		peers.push({ x: cell.x, y: i });
		// row
		peers.push({ x: i, y: cell.y });
	}
	return peers;
}
