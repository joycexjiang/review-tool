"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import { IconTransition } from "@/ui/icon-transition";
import CheckIcon from "@/ui/icons/check";
import CopyIcon from "@/ui/icons/copy";
import { Tooltip } from "@/ui/tooltip";

interface CopyableCodeSnippetProps {
	label: ReactNode;
	value: string;
	copied: boolean;
	onCopy: () => void;
	copyLabel: string;
	copiedLabel: string;
	ariaLabel: string;
	codeClassName?: string;
}

export default function CopyableCodeSnippet({
	label,
	value,
	copied,
	onCopy,
	copyLabel,
	copiedLabel,
	ariaLabel,
	codeClassName,
}: CopyableCodeSnippetProps) {
	return (
		<div className="mb-3">
			<div className="mb-1 text-[10px] font-mono uppercase text-zinc-400">
				{label}
			</div>
			<div className="group relative">
				<code
					className={cn(
						"block overflow-x-auto rounded bg-classes px-2 py-1.5 pr-8 font-mono text-xs text-zinc-50",
						codeClassName,
					)}
				>
					{value}
				</code>
				<Tooltip label={copied ? copiedLabel : copyLabel} side="top">
					<Button
						size="icon-sm"
						onClick={onCopy}
						aria-label={copied ? copiedLabel : ariaLabel}
						className={`absolute right-1 top-1 rounded p-0.5 shadow-sm transition-opacity duration-150 ${
							copied
								? "bg-emerald-50 text-emerald-600 opacity-100"
								: "bg-white text-zinc-400 opacity-0 hover:text-zinc-600 group-hover:opacity-100"
						}`}
					>
						<IconTransition activeKey={copied ? "check" : "copy"}>
							{copied ? (
								<CheckIcon className="size-4" />
							) : (
								<CopyIcon className="size-4" />
							)}
						</IconTransition>
					</Button>
				</Tooltip>
			</div>
		</div>
	);
}
