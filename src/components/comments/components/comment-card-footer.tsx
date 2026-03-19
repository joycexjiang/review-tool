"use client";

import { Button } from "@/ui/button";
import { IconTransition } from "@/ui/icon-transition";
import CheckIcon from "@/ui/icons/check";
import CopyIcon from "@/ui/icons/copy";
import XMarkIcon from "@/ui/icons/x-mark";
import { Tooltip } from "@/ui/tooltip";

export default function CommentCardFooter({
	copied,
	noteId,
	resolved,
	sourceLabel,
	onCopy,
	onToggleResolve,
}: {
	copied: boolean;
	noteId: string;
	resolved: boolean;
	sourceLabel: string | null;
	onCopy: () => void;
	onToggleResolve: (id: string) => void;
}) {
	return (
		<div className="mt-1.5 flex items-center justify-between gap-2">
			{sourceLabel ? (
				<code className="truncate rounded bg-zinc-50 px-1 py-0.5 font-mono text-[10px] text-zinc-500 ring-1 ring-zinc-200/80">
					{sourceLabel}
				</code>
			) : null}
			<div className="flex items-center gap-0.5">
				<Tooltip label={copied ? "Copied!" : "Copy as markdown"}>
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={onCopy}
						aria-label="Copy as markdown"
					>
						<IconTransition activeKey={copied ? "check" : "copy"}>
							{copied ? (
								<CheckIcon className="size-3" />
							) : (
								<CopyIcon className="size-3" />
							)}
						</IconTransition>
					</Button>
				</Tooltip>
				<Tooltip label={resolved ? "Mark unresolved" : "Resolve"}>
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={() => onToggleResolve(noteId)}
						aria-label={resolved ? "Mark unresolved" : "Resolve"}
					>
						{resolved ? (
							<XMarkIcon className="size-3" />
						) : (
							<CheckIcon className="size-3" />
						)}
					</Button>
				</Tooltip>
			</div>
		</div>
	);
}
