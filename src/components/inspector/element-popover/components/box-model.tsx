"use client";

interface BoxModelProps {
	margin: { top: string; right: string; bottom: string; left: string };
	padding: { top: string; right: string; bottom: string; left: string };
	width: number;
	height: number;
}

interface BoxEdges {
	top: number;
	right: number;
	bottom: number;
	left: number;
}

function formatPx(val: string): string {
	const n = parseFloat(val);
	return n === 0 ? "0" : `${n}`;
}

function parseBoxValue(val: string): number {
	const n = Number.parseFloat(val);
	return Number.isFinite(n) ? Math.max(0, n) : 0;
}

function toNumericEdges(edges: BoxModelProps["margin"]): BoxEdges {
	return {
		top: parseBoxValue(edges.top),
		right: parseBoxValue(edges.right),
		bottom: parseBoxValue(edges.bottom),
		left: parseBoxValue(edges.left),
	};
}

function scaleBoxValue(
	value: number,
	maxValue: number,
	maxSize: number,
): number {
	if (value <= 0 || maxValue <= 0) {return 0;}

	return Math.max(12, Math.round((value / maxValue) * maxSize));
}

export default function BoxModel({
	margin,
	padding,
	width,
	height,
}: BoxModelProps) {
	const marginValues = toNumericEdges(margin);
	const paddingValues = toNumericEdges(padding);
	const horizontalMax = Math.max(
		marginValues.left,
		marginValues.right,
		paddingValues.left,
		paddingValues.right,
		1,
	);
	const verticalMax = Math.max(
		marginValues.top,
		marginValues.bottom,
		paddingValues.top,
		paddingValues.bottom,
		1,
	);
	const marginScaled = {
		top: scaleBoxValue(marginValues.top, verticalMax, 24),
		right: scaleBoxValue(marginValues.right, horizontalMax, 24),
		bottom: scaleBoxValue(marginValues.bottom, verticalMax, 24),
		left: scaleBoxValue(marginValues.left, horizontalMax, 24),
	};
	const paddingScaled = {
		top: scaleBoxValue(paddingValues.top, verticalMax, 24),
		right: scaleBoxValue(paddingValues.right, horizontalMax, 24),
		bottom: scaleBoxValue(paddingValues.bottom, verticalMax, 24),
		left: scaleBoxValue(paddingValues.left, horizontalMax, 24),
	};

	return (
		<div className="w-full text-xs font-mono mt-3">
			{/* Margin layer */}
			<div
				className="relative grid w-full rounded border border-orange-300 bg-orange-50"
				style={{
					gridTemplateColumns: `${marginScaled.left}px minmax(0, 1fr) ${marginScaled.right}px`,
					gridTemplateRows: `${marginScaled.top}px auto ${marginScaled.bottom}px`,
				}}
			>
				<span className="absolute left-2 top-0 -translate-y-1/2 bg-orange-50 px-1 text-[10px] leading-none text-orange-500">
					margin
				</span>
				<span className="col-start-2 row-start-1 flex items-center justify-center text-[10px] text-orange-600">
					{formatPx(margin.top)}
				</span>
				<span className="col-start-1 row-start-2 flex items-center justify-center text-orange-600">
					{formatPx(margin.left)}
				</span>

				{/* Padding layer */}
				<div
					className="relative col-start-2 row-start-2 grid min-w-0 rounded border border-green-300 bg-green-50"
					style={{
						gridTemplateColumns: `${paddingScaled.left}px minmax(0, 1fr) ${paddingScaled.right}px`,
						gridTemplateRows: `${paddingScaled.top}px minmax(48px, auto) ${paddingScaled.bottom}px`,
					}}
				>
					<span className="absolute left-2 top-0 -translate-y-1/2 bg-green-50 px-1 text-[10px] leading-none text-green-600">
						padding
					</span>
					<span className="col-start-2 row-start-1 flex items-center justify-center text-[10px] text-green-700">
						{formatPx(padding.top)}
					</span>
					<span className="col-start-1 row-start-2 flex items-center justify-center text-green-700">
						{formatPx(padding.left)}
					</span>

					{/* Element core */}
					<div className="col-start-2 row-start-2 flex min-w-0 flex-col items-center justify-center rounded border border-blue-300 bg-blue-50 px-3 py-1 text-center">
						<span className="text-blue-700">
							{Math.round(width)} × {Math.round(height)}
						</span>
					</div>

					<span className="col-start-3 row-start-2 flex items-center justify-center text-green-700">
						{formatPx(padding.right)}
					</span>
					<span className="col-start-2 row-start-3 flex items-center justify-center text-[10px] text-green-700">
						{formatPx(padding.bottom)}
					</span>
				</div>

				<span className="col-start-3 row-start-2 flex items-center justify-center text-orange-600">
					{formatPx(margin.right)}
				</span>
				<span className="col-start-2 row-start-3 flex items-center justify-center text-[10px] text-orange-600">
					{formatPx(margin.bottom)}
				</span>
			</div>
		</div>
	);
}
