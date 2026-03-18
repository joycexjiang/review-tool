"use client";

interface ProgressRingProps {
	resolved: number;
	total: number;
	size?: number;
}

export default function ProgressRing({
	resolved,
	total,
	size = 32,
}: ProgressRingProps) {
	const strokeWidth = 2.5;
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const progress = total > 0 ? resolved / total : 0;
	const offset = circumference * (1 - progress);
	const isComplete = total > 0 && resolved === total;

	return (
		<div
			className="relative shrink-0"
			style={{ width: size, height: size }}
			role="progressbar"
			aria-valuenow={resolved}
			aria-valuemin={0}
			aria-valuemax={total}
			aria-label={`${resolved} of ${total} resolved`}
		>
			<svg
				width={size}
				height={size}
				className="-rotate-90"
				viewBox={`0 0 ${size} ${size}`}
				aria-hidden="true"
			>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke="currentColor"
					strokeWidth={strokeWidth}
					className="text-zinc-100"
				/>
				{total > 0 && (
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						stroke="currentColor"
						strokeWidth={strokeWidth}
						strokeLinecap="round"
						strokeDasharray={circumference}
						strokeDashoffset={offset}
						className={`transition-all duration-500 ease-out ${
							isComplete ? "text-emerald-500" : "text-zinc-900"
						}`}
					/>
				)}
			</svg>
			<span
				className={`absolute inset-0 flex items-center justify-center text-[10px] font-semibold tabular-nums ${
					isComplete ? "text-emerald-600" : "text-zinc-700"
				}`}
			>
				{resolved}/{total}
			</span>
		</div>
	);
}
