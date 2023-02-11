export function Cell({ cell }: { cell: number }) {
	return <div className="cell">{cell || ""}</div>;
}
