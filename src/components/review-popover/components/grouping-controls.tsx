"use client";

import {
	COMMENT_TYPE_DOT,
	COMMENT_TYPE_LABELS,
} from "@/components/comments/lib/comment-format";
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

const FILTER_KEYS: (CommentType | "all")[] = [
	"all",
	"bug",
	"suggestion",
	"question",
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
				{FILTER_KEYS.map((key) => {
					const count = counts[key];

					if (count === 0 && key !== "all") {
						return null;
					}

					const dot = key !== "all" ? COMMENT_TYPE_DOT[key] : null;
					const label = key === "all" ? "All" : COMMENT_TYPE_LABELS[key];

					return (
					<TabsTrigger
						key={key}
						value={key}
						className="h-auto rounded-full px-2.5 py-1.5 text-[12px] font-medium tabular-nums"
					>
						<span className="flex items-center gap-1.5">
							{dot ? (
								<span
									className={`size-1.5 shrink-0 rounded-full ${dot}`}
									aria-hidden
								/>
							) : null}
							{label}
						</span>
					</TabsTrigger>
					);
				})}
				<TabsIndicator className="rounded-full" />
			</TabsList>
		</Tabs>
	);
}
