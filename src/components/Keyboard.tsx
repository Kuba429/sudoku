import { useBoardStore } from "../store";

export function Keyboard() {
	const numbers = new Array(9).fill(0).map((_, idx) => idx + 1);
	return (
		<div className="keyboard">
			{numbers.map((x) => (
				<NumberKey num={x} key={x} />
			))}
		</div>
	);
}

function NumberKey({ num }: { num: number }) {
	const setCellValue = useBoardStore((state) => state.setCellValue);
	return <div onClick={() => setCellValue(num)}>{num}</div>;
}
