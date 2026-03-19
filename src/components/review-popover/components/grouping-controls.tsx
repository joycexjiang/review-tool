"use client";

import type { NoteView } from "@/components/inspector/lib/note-view-types";
import {
	useInspectorActions,
	useInspectorState,
} from "@/components/inspector/state/provider";
import type { CommentType } from "@/types";
import { Tabs, TabsIndicator, TabsList, TabsTrigger } from "@/ui/tabs";

interface TypeFilterProps {
	deployNotes: NoteView[];
}

const TYPE_OPTIONS: { key: CommentType | "all"; label: string }[] = [
	{ key: "all", label: "All" },
	{ key: "bug", label: "Bug" },
	{ key: "suggestion", label: "Suggestion" },
	{ key: "question", label: "Question" },
];

export default function TypeFilter({ deployNotes }: TypeFilterProps) {
	const { filters } = useInspectorState();
	const { setTypeFilter } = useInspectorActions();

	const activeValue = filters.type ?? "all";

	const counts = {
		all: deployNotes.length,
		bug: deployNotes.filter((n) => n.type === "bug").length,
		suggestion: deployNotes.filter((n) => n.type === "suggestion").length,
		question: deployNotes.filter((n) => n.type === "question").length,
	};

	return (
		<Tabs
			value={activeValue}
			onValueChange={(value) =>
				setTypeFilter(value === "all" ? null : (value as CommentType))
			}
		>
			<TabsList
				className="gap-1 rounded-full bg-transparent p-0"
				aria-label="Filter by type"
			>
				{TYPE_OPTIONS.map(({ key, label }) => {
					const count = counts[key];

					if (count === 0 && key !== "all") {
						return null;
					}

					return (
						<TabsTrigger
							key={key}
							value={key}
							className="h-auto rounded-full px-2.5 py-1.5 text-[12px] font-medium tabular-nums"
						>
							{label}
						</TabsTrigger>
					);
				})}
				<TabsIndicator className="rounded-full" />
			</TabsList>
		</Tabs>
	);
}
