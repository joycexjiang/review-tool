"use client";

import { useState } from "react";
import {
	COMMENT_SEVERITY_LABELS,
	COMMENT_TYPE_DOT,
	COMMENT_TYPE_LABELS,
	COMMENT_TYPES,
} from "@/components/comments/lib/comment-format";
import { SEVERITY_ORDER } from "@/components/comments/severity-scale";
import type { CommentType, Severity } from "@/types";
import { Button } from "@/ui/button";
import { DropdownItem, DropdownMenu } from "@/ui/dropdown-menu";
import ArrowRightIcon from "@/ui/icons/arrow-right";
import ChevronDownIcon from "@/ui/icons/chevron-down";
import SeverityIcon from "@/ui/icons/severity";
import { Input } from "@/ui/input";

const DROPDOWN_TRIGGER_CLASS =
	"inline-flex w-full bg-white min-w-0 items-center justify-between gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-[background-color,border-color] hover:border-zinc-300 hover:bg-zinc-100 data-[popup-open]:border-zinc-300 data-[popup-open]:bg-zinc-100";

interface CommentFormProps {
	onSubmit: (text: string, type: CommentType, severity: Severity) => void;
}

export default function CommentForm({ onSubmit }: CommentFormProps) {
	const [text, setText] = useState("");
	const [type, setType] = useState<CommentType>("bug");
	const [severity, setSeverity] = useState<Severity>("major");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!text.trim()) {
			return;
		}
		onSubmit(text.trim(), type, severity);
		setText("");
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-2">
			<div className="flex gap-2">
				<DropdownMenu
					align="start"
					className="min-w-44 text-zinc-500"
					trigger={
						<button
							type="button"
							className={DROPDOWN_TRIGGER_CLASS}
							aria-label="Comment severity"
						>
							<span className="flex min-w-0 items-center gap-1.5">
								<SeverityIcon
									severity={severity}
									className="size-3.5 shrink-0"
								/>
								{COMMENT_SEVERITY_LABELS[severity]}
							</span>
							<ChevronDownIcon className="size-3 shrink-0 text-zinc-400" />
						</button>
					}
				>
					{SEVERITY_ORDER.map((s) => (
						<DropdownItem key={s} onSelect={() => setSeverity(s)}>
							<span className="flex min-w-0 items-center gap-2">
								<span className="text-zinc-500 [&_svg]:size-4 [&_svg]:shrink-0">
									<SeverityIcon severity={s} />
								</span>
								<span className="block max-w-full truncate select-none">
									{COMMENT_SEVERITY_LABELS[s]}
								</span>
							</span>
						</DropdownItem>
					))}
				</DropdownMenu>
				<DropdownMenu
					align="start"
					className="min-w-44 text-zinc-500"
					trigger={
						<button
							type="button"
							className={DROPDOWN_TRIGGER_CLASS}
							aria-label="Comment category"
						>
							<span className="flex min-w-0 items-center gap-1.5">
								<span
									className={`size-1.5 shrink-0 rounded-full ${COMMENT_TYPE_DOT[type]}`}
									aria-hidden
								/>
								{COMMENT_TYPE_LABELS[type]}
							</span>
							<ChevronDownIcon className="size-3 shrink-0 text-zinc-400" />
						</button>
					}
				>
					{COMMENT_TYPES.map((ct) => (
						<DropdownItem key={ct} onSelect={() => setType(ct)}>
							<span className="flex min-w-0 items-center gap-1.5">
								<span
									className={`size-1.5 shrink-0 rounded-full ${COMMENT_TYPE_DOT[ct]}`}
									aria-hidden
								/>
								<span className="block max-w-full truncate select-none">
									{COMMENT_TYPE_LABELS[ct]}
								</span>
							</span>
						</DropdownItem>
					))}
				</DropdownMenu>
			</div>

			<div className="relative">
				<Input
					value={text}
					onValueChange={setText}
					placeholder="Add a comment"
					className="pr-15"
					render={
						<textarea
							rows={1}
							aria-label="Comment text"
							className="min-h-20 w-full resize-none overflow-y-auto bg-transparent outline-none"
						/>
					}
				/>

				<Button
					type="submit"
					variant="ghost"
					size="icon"
					disabled={!text.trim()}
					aria-label="Add comment"
					className="absolute right-2 bottom-4 rounded-md bg-zinc-100 text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
				>
					<ArrowRightIcon className="size-4" />
				</Button>
			</div>
		</form>
	);
}
