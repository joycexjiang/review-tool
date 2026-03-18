"use client";

import { cn } from "@/lib/utils";
import type { Severity } from "@/types";
import SeverityIcon from "@/ui/icons/severity";

export const COMMENT_SEVERITY_LABELS: Record<Severity, string> = {
	blocking: "Blocking",
	major: "Major",
	minor: "Minor",
};

const COMMENT_SEVERITY_COLOR_CLASS: Record<Severity, string> = {
	blocking: "text-red-600",
	major: "text-amber-600",
	minor: "text-zinc-500",
};

interface SourceMeta {
	sourceFile?: string;
	sourceLine?: number;
	cssSelector?: string;
}

export function getCommentSourceLabel(source: SourceMeta): string {
	if (source.sourceFile) {
		return `${source.sourceFile}${source.sourceLine ? `:${source.sourceLine}` : ""}`;
	}
	return source.cssSelector ?? "—";
}

export function CommentSeverityBadge({
	severity,
	className,
	iconClassName,
	labelClassName,
	showLabel = true,
}: {
	severity: Severity;
	className?: string;
	iconClassName?: string;
	labelClassName?: string;
	showLabel?: boolean;
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5",
				COMMENT_SEVERITY_COLOR_CLASS[severity],
				className,
			)}
		>
			<SeverityIcon
				severity={severity}
				className={cn("size-4", iconClassName)}
			/>
			{showLabel ? (
				<span className={cn("text-[11px] font-medium", labelClassName)}>
					{COMMENT_SEVERITY_LABELS[severity]}
				</span>
			) : null}
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
