import { useBoardStore } from "../store";
import { boardType } from "./Board";

export function Cell({
	cell,
}: {
	cell: boardType[number][number] & { x: number; y: number };
}) {
	const {
		activeCell,
		setActiveCell,
		commonZone: commonZone,
	} = useBoardStore((state) => ({
		activeCell: state.activeCell,
		setActiveCell: state.setActiveCell,
		commonZone: state.commonZone,
	}));
	const handleClick = () => {
		if (!cell.canChange) return;
		setActiveCell({ x: cell.x, y: cell.y });
	};
	return (
		<div
			onClick={handleClick}
			className={getCellClasses(cell.x, cell.y, activeCell, commonZone)}
		>
			{cell.value || ""}
		</div>
	);
}

function getCellClasses(
	x: number,
	y: number,
	activeCell: { x: number; y: number } | null,
	commonZone: { x: number; y: number }[]
) {
	const classes: string[] = ["cell"];
	if (activeCell?.x === x && activeCell?.y === y) classes.push("active");
	if (x === 2 || x === 5) classes.push("border-right");
	if (x === 3 || x === 6) classes.push("border-left");
	if (y === 3 || y === 6) classes.push("border-top");
	if (y === 2 || y === 5) classes.push("border-bottom");
	if (commonZone.findIndex((c) => c.x === x && c.y === y) !== -1)
		classes.push("common-zone");
	return classes.join(" ");
}
