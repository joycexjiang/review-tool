"use client";

import {
	useInspectorActions,
	useInspectorState,
} from "@/components/inspector/state/provider";
import type { NoteView } from "@/hooks/use-filtered-notes";
import type { CommentType } from "@/types";

interface TypeFilterProps {
	deployNotes: NoteView[];
}

const TYPE_OPTIONS: { key: CommentType | "all"; label: string }[] = [
	{ key: "all", label: "All" },
	{ key: "bug", label: "Bugs" },
	{ key: "suggestion", label: "Suggestions" },
	{ key: "question", label: "Questions" },
];

export default function TypeFilter({ deployNotes }: TypeFilterProps) {
	const { filters } = useInspectorState();
	const { setTypeFilter } = useInspectorActions();

	const counts = {
		all: deployNotes.length,
		bug: deployNotes.filter((n) => n.type === "bug").length,
		suggestion: deployNotes.filter((n) => n.type === "suggestion").length,
		question: deployNotes.filter((n) => n.type === "question").length,
	};

	return (
		<div
			className="flex gap-0.5"
			role="tablist"
			aria-label="Filter by type"
		>
			{TYPE_OPTIONS.map(({ key, label }) => {
				const count = counts[key];
				const isActive =
					key === "all" ? filters.type === null : filters.type === key;

				if (count === 0 && key !== "all") return null;

				return (
					<button
						key={key}
						type="button"
						role="tab"
						aria-selected={isActive}
						onClick={() => setTypeFilter(key === "all" ? null : key)}
						className={`rounded-lg px-2.5 py-1.5 text-[12px] font-medium tabular-nums transition-colors duration-150 ${
							isActive
								? "bg-zinc-900 text-white"
								: "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600"
						}`}
					>
						{label}
						{isActive && (
							<span className="ml-1 text-zinc-500">{count}</span>
						)}
					</button>
				);
			})}
		</div>
	);
}
