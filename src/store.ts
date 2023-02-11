import { create } from "zustand";
import { getBoard } from "./components/Board";

interface BoardState {
	board: number[][];
	activeCell: { x: number; y: number } | null;
	setActiveCell: (props: { x: number; y: number }) => void;
}
export const useBoardStore = create<BoardState>((set) => ({
	board: getBoard(),
	activeCell: null,
	setActiveCell: ({ x, y }) =>
		set(() => ({
			activeCell: { x, y },
		})),
}));
