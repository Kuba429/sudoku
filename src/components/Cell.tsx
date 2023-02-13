import { useBoardStore } from "../store";
import { boardType } from "./Board";

export type position = { x: number; y: number };
export type cellType = boardType[number][number] & position;

export function Cell({ cell }: { cell: cellType }) {
	const { activeCell, setActiveCell, commonZone, invalid } = useBoardStore(
		(state) => ({
			activeCell: state.activeCell,
			setActiveCell: state.setActiveCell,
			commonZone: state.commonZone,
			invalid: state.invalid,
		})
	);
	const handleClick = () => {
		console.log(cell);
		if (!cell.canChange) return;
		setActiveCell({ x: cell.x, y: cell.y });
	};
	return (
		<div
			onClick={handleClick}
			className={getCellClasses(cell, activeCell, commonZone, invalid)}
		>
			{cell.value || ""}
		</div>
	);
}

function getCellClasses(
	cell: cellType,
	activeCell: position | null,
	commonZone: position[],
	invalid: position[]
) {
	const classes: string[] = ["cell"];
	const { x, y } = cell;
	if (activeCell?.x === x && activeCell?.y === y) classes.push("active");
	if (x === 2 || x === 5) classes.push("border-right");
	if (x === 3 || x === 6) classes.push("border-left");
	if (y === 3 || y === 6) classes.push("border-top");
	if (y === 2 || y === 5) classes.push("border-bottom");
	if (commonZone.findIndex((c) => c.x === x && c.y === y) !== -1)
		classes.push("common-zone");
	if (invalid.findIndex((c) => c.x === x && c.y === y) !== -1)
		classes.push("invalid");
	return classes.join(" ");
}
