"use client";

import type { ReviewStats } from "@/components/inspector/lib/note-view-types";
import ProgressRing from "./progress-ring";

interface SummaryBarProps {
	stats: ReviewStats;
}

export default function SummaryBar({ stats }: SummaryBarProps) {
	const allResolved = stats.total > 0 && stats.unresolved === 0;

	return (
		<div className="flex items-center gap-3">
			<ProgressRing resolved={stats.resolved} total={stats.total} />
			<span className="text-[12px] text-zinc-400">
				{allResolved ? "All resolved" : `${stats.unresolved} remaining`}
			</span>
		</div>
	);
}
