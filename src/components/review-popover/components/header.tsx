"use client";

import CheckIcon from "@/ui/icons/check";
import CopyIcon from "@/ui/icons/copy";
import XMarkIcon from "@/ui/icons/x-mark";
import {
	useReviewPopoverActions,
	useReviewPopoverData,
	useReviewPopoverLayoutContext,
} from "../review-popover-context";
import DeployTabs from "./deploy-tabs";
import FixWithMenu from "./fix-with";
import SummaryBar from "./summary-bar";

export default function ReviewPopoverHeader() {
	const { close, copyAll, toggleMode } = useReviewPopoverActions();
	const { fixPrompt, headerCopied, stats } = useReviewPopoverData();
	const { isDrawerMode } = useReviewPopoverLayoutContext();

	return (
		<div
			data-panel-drag-handle={isDrawerMode ? undefined : true}
			className={
				isDrawerMode
					? "border-b border-zinc-200 bg-white"
					: "ui-glass-panel-header cursor-grab active:cursor-grabbing"
			}
		>
			<div className="flex items-center justify-between px-5 pt-5 pb-4">
				<h2 className="text-[14px] font-semibold text-zinc-900">Review</h2>
				<div className="flex items-center gap-1">
					<button
						type="button"
						onClick={toggleMode}
						className="h-7 rounded-lg px-2 text-[11px] font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/10 focus-visible:ring-offset-1"
						aria-label={
							isDrawerMode
								? "Collapse review drawer into floating popover"
								: "Expand review popover into right drawer"
						}
					>
						{isDrawerMode ? "Collapse" : "Expand"}
					</button>
					<FixWithMenu prompt={fixPrompt} />
					<button
						type="button"
						onClick={copyAll}
						className="flex size-7 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/10 focus-visible:ring-offset-1"
						aria-label="Copy all comments as markdown"
					>
						{headerCopied ? (
							<CheckIcon className="size-3.5" />
						) : (
							<CopyIcon className="size-3.5" />
						)}
					</button>
					<button
						type="button"
						onClick={close}
						className="flex size-7 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/10 focus-visible:ring-offset-1"
						aria-label="Close review popover"
					>
						<XMarkIcon className="size-3.5" />
					</button>
				</div>
			</div>

			<div className="flex items-center justify-between px-5 pb-4">
				<SummaryBar stats={stats} />
				<DeployTabs />
			</div>

			<div
				className={
					isDrawerMode ? "h-px bg-zinc-200" : "ui-glass-panel-separator mx-5"
				}
			/>
		</div>
	);
}
