"use client";

import { useInspectorActions } from "@/components/inspector/state/provider";
import CheckIcon from "@/ui/icons/check";

export function EmptyReviewState() {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<div className="mb-3 flex size-10 items-center justify-center rounded-full bg-zinc-50">
				<svg
					aria-hidden="true"
					className="size-5 text-zinc-300"
					fill="none"
					focusable="false"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={1.5}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
					/>
				</svg>
			</div>
			<p className="text-[13px] font-medium text-zinc-500">No feedback yet</p>
			<p className="mt-1 text-[12px] text-zinc-400">
				Share this preview to start collecting feedback.
			</p>
		</div>
	);
}

export function FilteredEmptyReviewState() {
	const { setTypeFilter } = useInspectorActions();

	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<p className="text-[13px] text-zinc-400">No comments match this filter</p>
			<button
				type="button"
				onClick={() => setTypeFilter(null)}
				className="mt-2 text-[12px] text-zinc-400 underline underline-offset-2 hover:text-zinc-600"
			>
				Clear filter
			</button>
		</div>
	);
}

export function AllResolvedReviewState({ total }: { total: number }) {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<div className="mb-3 flex size-10 items-center justify-center rounded-full bg-emerald-50">
				<CheckIcon className="size-5 text-emerald-500" />
			</div>
			<p className="text-[13px] font-medium text-zinc-500">
				All feedback addressed
			</p>
			<p className="mt-1 text-[12px] text-zinc-400">
				{total} comment{total !== 1 ? "s" : ""} resolved.
			</p>
		</div>
	);
}
