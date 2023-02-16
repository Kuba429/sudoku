import { create } from "zustand";
import { boardType, getBoard, solveBoard } from "./components/Board";
import { cellType, position } from "./components/Cell";

const memoizedSolvedBoards: boardType[] = []; // TODO make it not be a global variable. Maybe include it in store. idk tho it isn't reactive 🤷
interface BoardState {
	board: boardType;
	activeCell: cellType | null;
	commonZone: position[];
	invalid: position[];
	setActiveCell: (props: cellType) => void;
	setCellValue: (newValue: number) => void;
	setBoard: (newBoard: boardType) => void;
}
export const useBoardStore = create<BoardState>((set) => ({
	board: getBoard(),
	activeCell: null,
	commonZone: [],
	invalid: [],
	setBoard: (board) =>
		set(() => {
			memoizedSolvedBoards.length = 0;
			memoizedSolvedBoards.push(board);
			return { board };
		}),
	setActiveCell: (cell) =>
		set(() => ({
			activeCell: cell,
			commonZone: getCommonZone({ x: cell.x, y: cell.y }),
		})),
	setCellValue: (newValue) =>
		set((state) => {
			if (!state.activeCell) return {};
			const itemToChange =
				state.board[state.activeCell.y][state.activeCell.x];
			if (!itemToChange.canChange) return {};
			itemToChange.value = newValue;
			state.invalid = getInvalid(
				newValue,
				state.invalid,
				state.activeCell,
				state.board
			);
			return {
				board: state.board,
				invalid: state.invalid,
			};
		}),
}));

function wouldBeSolvable(x: number, y: number, board: boardType) {
	// check whether the board would be solvable assuming this value won't change
	if (memoizedSolvedBoards.some((b) => b[y][x].value === board[y][x].value))
		return true;
	// if none of the known solved boards contains the cell, check if the board exists. If it does, add it to the list
	const tempBoard = board.map((r) =>
		r.map((c) => {
			if (c.value !== 0) return { ...c, canChange: false };
			return c;
		})
	);
	const res = solveBoard(tempBoard);
	if (!!res) memoizedSolvedBoards.push(res);
	return !!res;
}

export function isValid(x: number, y: number, board: boardType) {
	return (
		board[y][x].value === 0 || // 0 is always valid
		(!isColliding(x, y, board) && wouldBeSolvable(x, y, board))
	);
}

function isColliding(x: number, y: number, board: boardType) {
	return getCommonZone({ x, y }).some(
		(cell) =>
			(cell.x !== x || cell.y !== y) && // ignore the cell that's being currently checked
			board[cell.y][cell.x].value === board[y][x].value
	);
}

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
	if (!wouldBeSolvable(activeCell.x, activeCell.y, board))
		invalid.push(activeCell);
	return invalid;
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
