import { useBoardStore } from "../store";
import { boardType } from "./Board";

export function Cell({
	cell,
}: {
	//cell: { value: number; canChange: boolean; x: number; y: number };
	cell: boardType[number][number] & { x: number; y: number };
}) {
	const { activeCell, setActiveCell } = useBoardStore((state) => ({
		activeCell: state.activeCell,
		setActiveCell: state.setActiveCell,
	}));
	const handleClick = () => {
		if (!cell.canChange) return;
		setActiveCell({ x: cell.x, y: cell.y });
	};
	return (
		<div
			onClick={handleClick}
			className={getCellClasses(cell.x, cell.y, activeCell)}
		>
			{cell.value || ""}
		</div>
	);
}

function getCellClasses(
	x: number,
	y: number,
	activeCell: { x: number; y: number } | null
) {
	let classes: string[] = ["cell"];
	if (activeCell?.x === x && activeCell?.y === y) classes.push("active");
	if (x === 2 || x === 5) classes.push("border-right");
	if (x === 3 || x === 6) classes.push("border-left");
	if (y === 3 || y === 6) classes.push("border-top");
	if (y === 2 || y === 5) classes.push("border-bottom");
	return classes.join(" ");
}
