"use client";

import { Progress } from "@base-ui/react/progress";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
	resolved: number;
	total: number;
}

export default function ProgressBar({ resolved, total }: ProgressBarProps) {
	const percentage = total > 0 ? (resolved / total) * 100 : 0;
	const isComplete = total > 0 && resolved === total;

	return (
		<Progress.Root
			value={percentage}
			aria-label={`${resolved} of ${total} resolved`}
			className="flex items-center gap-2.5 px-1"
		>
			<Progress.Track className="h-1 flex-1 overflow-hidden rounded-full bg-zinc-200/60">
				<Progress.Indicator
					className={cn(
						"block h-full rounded-full transition-[width,background-color] duration-300",
						isComplete ? "bg-emerald-500" : "bg-zinc-900",
					)}
				/>
			</Progress.Track>
			<span
				className={cn(
					"shrink-0 text-[11px] font-medium tabular-nums",
					isComplete ? "text-emerald-600" : "text-zinc-500",
				)}
			>
				{resolved}/{total}
			</span>
		</Progress.Root>
	);
}
