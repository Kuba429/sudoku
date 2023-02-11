import { create } from "zustand";
import { boardType, getBoard } from "./components/Board";

interface BoardState {
	board: boardType;
	activeCell: { x: number; y: number } | null;
	commonZone: { x: number; y: number }[];
	invalid: { x: number; y: number }[];
	setActiveCell: (props: { x: number; y: number }) => void;
	setCellValue: (newValue: number) => void;
}
export const useBoardStore = create<BoardState>((set) => ({
	board: getBoard(),
	activeCell: null,
	commonZone: [],
	invalid: [],
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
			// TODO add invalid values to state; before adding more, check if the ones already present in the array are still invalid (remove if not)
			// having done that, invalid cells are effectively updated on every input
			const newInvalid = getCommonZone({ ...state.activeCell }).filter(
				(cell) =>
					state.board[cell.y][cell.x].value !== 0 &&
					state.board[cell.y][cell.x].value === newValue
			);
			if (newInvalid.length > 3)
				state.invalid = [...state.invalid, ...newInvalid];
			return {
				board: state.board,
				invalid: state.invalid,
			};
		}),
}));
function getCommonZone(cell: { x: number; y: number }) {
	const peers: { x: number; y: number }[] = [];
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
