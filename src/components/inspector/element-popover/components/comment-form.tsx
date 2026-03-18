"use client";

import { useState } from "react";
import { SeverityScale } from "@/components/comments/severity-scale";
import type { CommentType, Severity } from "@/types";
import { Button } from "@/ui/button";
import ArrowRightIcon from "@/ui/icons/arrow-right";
import { Input } from "@/ui/input";

const COMMENT_TYPES: { value: CommentType; label: string; color: string }[] = [
	{
		value: "bug",
		label: "Bug",
		color: "bg-red-100 text-red-700 border-red-200",
	},
	{
		value: "suggestion",
		label: "Suggestion",
		color: "bg-blue-100 text-blue-700 border-blue-200",
	},
	{
		value: "question",
		label: "Question",
		color: "bg-amber-100 text-amber-700 border-amber-200",
	},
];

interface CommentFormProps {
	onSubmit: (text: string, type: CommentType, severity: Severity) => void;
}

export default function CommentForm({ onSubmit }: CommentFormProps) {
	const [text, setText] = useState("");
	const [type, setType] = useState<CommentType>("suggestion");
	const [severity, setSeverity] = useState<Severity>("major");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!text.trim()) return;
		onSubmit(text.trim(), type, severity);
		setText("");
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-3">
			{/* Type row */}
			<div className="flex gap-1.5">
				{COMMENT_TYPES.map((ct) => (
					<button
						key={ct.value}
						type="button"
						onClick={() => setType(ct.value)}
						aria-pressed={type === ct.value}
						className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all ${
							type === ct.value
								? `${ct.color} ring-1 ring-offset-1`
								: "border-zinc-200 bg-zinc-50 text-zinc-500 hover:border-zinc-300"
						}`}
					>
						{ct.label}
					</button>
				))}
			</div>

			<SeverityScale value={severity} onChange={setSeverity} />

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
					className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-classes "
				>
					<ArrowRightIcon className="size-4" />
				</Button>
			</div>
		</form>
	);
}
