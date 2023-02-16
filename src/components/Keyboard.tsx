import { useEffect } from "react";
import { useBoardStore } from "../store";
import { DevSolveButton } from "./DevSolveButton";

export function Keyboard() {
	const numbers = new Array(10).fill(0).map((_, idx) => idx);
	numbers.push(numbers.shift()!); // move 0 to the end
	useCellValueOnKeyDown();
	return (
		<>
			<div className="keyboard">
				{numbers.map((x) => (
					<NumberKey num={x} key={"numkey" + x} />
				))}
			</div>

			{
				//	<DevSolveButton />
			}
		</>
	);
}
function NumberKey({ num }: { num: number }) {
	const setCellValue = useBoardStore((state) => state.setCellValue);
	return <div onClick={() => setCellValue(num)}>{num}</div>;
}
function isDigit(num: number) {
	return [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].findIndex((i) => i === num) !== -1;
}

function useCellValueOnKeyDown() {
	const setCellValue = useBoardStore((state) => state.setCellValue);
	useEffect(() => {
		const cb = (e: KeyboardEvent) =>
			isDigit(+e.key) && setCellValue(+e.key);
		document.addEventListener("keydown", cb);
		return () => {
			document.removeEventListener("keydown", cb);
		};
	}, [setCellValue]);
}
