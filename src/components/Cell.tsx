import { useBoardStore } from "../store";

export function Cell({
	cell,
}: {
	cell: { value: number; x: number; y: number };
}) {
	const { activeCell, setActiveCell } = useBoardStore((state) => ({
		activeCell: state.activeCell,
		setActiveCell: state.setActiveCell,
	}));
	const handleClick = () => {
		setActiveCell({ x: cell.x, y: cell.y });
	};
	const activeClass =
		activeCell?.x === cell.x && activeCell?.y === cell.y ? " active" : "";
	return (
		<div onClick={handleClick} className={"cell" + activeClass}>
			{cell.value || ""}
		</div>
	);
}
