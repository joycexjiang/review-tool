"use client";

import { cn } from "@/lib/utils";
import type { Severity } from "@/types";
import SeverityIcon from "@/ui/icons/severity";
import {
	COMMENT_SEVERITY_COLOR,
	COMMENT_SEVERITY_LABELS,
	getCommentSourceLabel,
} from "./lib/comment-format";

export { COMMENT_SEVERITY_LABELS, getCommentSourceLabel };

interface SourceMeta {
	sourceFile?: string;
	sourceLine?: number;
	cssSelector?: string;
}

export function CommentSeverityBadge({
	severity,
	className,
	iconClassName,
}: {
	severity: Severity;
	className?: string;
	iconClassName?: string;
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5",
				COMMENT_SEVERITY_COLOR[severity],
				className,
			)}
		>
			<SeverityIcon
				severity={severity}
				className={cn("size-4", iconClassName)}
			/>
		</span>
	);
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
