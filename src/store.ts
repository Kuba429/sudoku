import { create } from "zustand";

interface BoardState {
	board: number[][];
}
export const useBoardStore = create<BoardState>((set) => ({
	board: [[]],
}));
