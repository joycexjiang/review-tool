"use client";

import { cn } from "@/lib/utils";
import { getCommentSourceLabel } from "./lib/comment-format";

interface SourceMeta {
	sourceFile?: string;
	sourceLine?: number;
	cssSelector?: string;
}

export function CommentSourceCode({
	source,
	className,
}: {
	source: SourceMeta;
	className?: string;
}) {
	return (
		<code
			className={cn(
				"inline-flex min-w-0 max-w-full items-center rounded-md bg-zinc-50 px-1.5 py-0.5 font-mono text-[11px] text-zinc-500 ring-1 ring-zinc-200",
				className,
			)}
		>
			<span className="block truncate">{getCommentSourceLabel(source)}</span>
		</code>
	);
}
