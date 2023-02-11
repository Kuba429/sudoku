import { create } from "zustand";
import { boardType, getBoard } from "./components/Board";

interface BoardState {
	board: boardType;
	activeCell: { x: number; y: number } | null;
	commonZone: { x: number; y: number }[];
	setActiveCell: (props: { x: number; y: number }) => void;
	setCellValue: (newValue: number) => void;
}
export const useBoardStore = create<BoardState>((set) => ({
	board: getBoard(),
	activeCell: null,
	commonZone: [],
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
			return { board: state.board };
		}),
}));

function getCommonZone(cell: { x: number; y: number }) {
	const peers: { x: number; y: number }[] = [];
	// square
	for (let y = 0; y < 9; y++) {
		if (Math.floor(cell.y / 3) !== Math.floor(y / 3)) {
			continue;
		}
		for (let x = 0; x < 9; x++) {
			if (Math.floor(cell.x / 3) === Math.floor(x / 3)) {
				peers.push({ x, y });
			}
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
