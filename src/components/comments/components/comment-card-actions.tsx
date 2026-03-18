"use client";

import CheckIcon from "@/ui/icons/check";
import CopyIcon from "@/ui/icons/copy";
import XMarkIcon from "@/ui/icons/x-mark";

export default function CommentCardActions({
	copied,
	noteId,
	resolved,
	onCopy,
	onToggleResolve,
}: {
	copied: boolean;
	noteId: string;
	resolved: boolean;
	onCopy: () => void;
	onToggleResolve: (id: string) => void;
}) {
	return (
		<div className="mt-1.5 flex items-center gap-1 pl-[14px] opacity-0 transition-opacity duration-150 group-hover:opacity-100">
			<button
				type="button"
				onClick={onCopy}
				className="flex size-6 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
				aria-label="Copy as markdown"
			>
				{copied ? (
					<CheckIcon className="size-3" />
				) : (
					<CopyIcon className="size-3" />
				)}
			</button>
			<button
				type="button"
				onClick={() => onToggleResolve(noteId)}
				className="flex size-6 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
				aria-label={resolved ? "Mark unresolved" : "Resolve"}
			>
				{resolved ? (
					<XMarkIcon className="size-3" />
				) : (
					<CheckIcon className="size-3" />
				)}
			</button>
		</div>
	);
}
