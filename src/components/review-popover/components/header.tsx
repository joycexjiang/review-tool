"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import { IconTransition } from "@/ui/icon-transition";
import CheckIcon from "@/ui/icons/check";
import CollapseIcon from "@/ui/icons/collapse";
import CopyIcon from "@/ui/icons/copy";
import ExpandIcon from "@/ui/icons/expand";
import XMarkIcon from "@/ui/icons/x-mark";
import { Tooltip } from "@/ui/tooltip";
import {
	useReviewPopoverActions,
	useReviewPopoverData,
	useReviewPopoverLayoutContext,
} from "../review-popover-context";

export default function ReviewPopoverHeader() {
	const { close, copyAll, toggleMode } = useReviewPopoverActions();
	const { headerCopied } = useReviewPopoverData();
	const { isDrawerMode } = useReviewPopoverLayoutContext();

	return (
		<div
			data-panel-drag-handle={isDrawerMode ? undefined : true}
			className={cn(
				"bg-white border-b border-gray-200 px-2 pl-4 pt-2 pb-2",
				!isDrawerMode && "cursor-grab active:cursor-grabbing",
			)}
		>
			<div className="flex items-center justify-between gap-2">
				<div className="flex min-w-0 flex-1 items-baseline gap-3">
					<h2 className="shrink-0 text-sm font-medium">Review comments</h2>
				</div>
				<div className="flex shrink-0 items-center gap-1">
					<Tooltip label={isDrawerMode ? "Collapse" : "Expand"}>
						<Button
							variant="ghost"
							size="icon"
							onClick={toggleMode}
							aria-label={
								isDrawerMode
									? "Collapse review drawer into floating popover"
									: "Expand review popover into right drawer"
							}
						>
							{isDrawerMode ? (
								<CollapseIcon className="size-3.5" />
							) : (
								<ExpandIcon className="size-3.5" />
							)}
						</Button>
					</Tooltip>

					<Tooltip label={headerCopied ? "Copied!" : "Copy all comments"}>
						<Button
							variant="ghost"
							size="icon"
							onClick={copyAll}
							aria-label="Copy all comments as markdown"
						>
							<IconTransition activeKey={headerCopied ? "check" : "copy"}>
								{headerCopied ? (
									<CheckIcon className="size-3.5" />
								) : (
									<CopyIcon className="size-3.5" />
								)}
							</IconTransition>
						</Button>
					</Tooltip>

					<Tooltip label="Close">
						<Button
							variant="ghost"
							size="icon"
							onClick={close}
							aria-label="Close review popover"
						>
							<XMarkIcon className="size-3.5" />
						</Button>
					</Tooltip>
				</div>
			</div>
		</div>
	);
}
