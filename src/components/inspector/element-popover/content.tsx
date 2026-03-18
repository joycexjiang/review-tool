"use client";

import { ScrollArea } from "@base-ui/react/scroll-area";
import { Separator } from "@base-ui/react/separator";
import type { ReactNode, RefObject } from "react";
import {
	type HighlightRect,
	POPOVER_OFFSET,
	type PopoverLayout,
} from "@/components/inspector/lib/popover-layout";
import type { CommentType, ElementInfo, Severity } from "@/types";
import { Button } from "@/ui/button";
import XMarkIcon from "@/ui/icons/x-mark";
import {
	Tabs,
	TabsContent,
	TabsIndicator,
	TabsList,
	TabsTrigger,
} from "@/ui/tabs";
import BoxModel from "./components/box-model";
import CommentForm from "./components/comment-form";
import CopyableCodeSnippet from "./components/copyable-code-snippet";

interface ElementPopoverContentProps {
	popoverRef: RefObject<HTMLDivElement | null>;
	titleId: string;
	layout: PopoverLayout | null;
	rect: HighlightRect;
	elementInfo: ElementInfo;
	selectorCopied: boolean;
	onCopySelector: () => void;
	sourceCopied: boolean;
	onCopySource: () => void;
	onClose: () => void;
	onSubmit: (text: string, type: CommentType, severity: Severity) => void;
}

function SectionLabel({ children }: { children: ReactNode }) {
	return (
		<div className="mb-1 text-xs font-mono font-medium uppercase tracking-tight text-section-label">
			{children}
		</div>
	);
}

export default function ElementPopoverContent({
	popoverRef,
	titleId,
	layout,
	rect,
	elementInfo,
	selectorCopied,
	onCopySelector,
	sourceCopied,
	onCopySource,
	onClose,
	onSubmit,
}: ElementPopoverContentProps) {
	const tag = elementInfo.tagName.toLowerCase();
	const sourceLabel = elementInfo.sourceFile
		? `${elementInfo.sourceFile}${elementInfo.sourceLine ? `:${elementInfo.sourceLine}` : ""}`
		: null;
	const styles = elementInfo.computedStyles;
	const classes = elementInfo.className
		? elementInfo.className.split(/\s+/).filter(Boolean).slice(0, 8)
		: [];

	return (
		<>
			<div className="fixed inset-0 z-9999" onClick={onClose} aria-hidden />

			<div
				data-inspector-overlay
				className="pointer-events-none fixed z-9998"
				style={{
					top: rect.top,
					left: rect.left,
					width: rect.width,
					height: rect.height,
				}}
			>
				<div className="h-full w-full rounded-[2px] border-2 border-blue-600 bg-blue-500/15" />
			</div>

			<div
				ref={popoverRef}
				data-inspector-popover
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				tabIndex={-1}
				className={`fixed z-10000 w-[340px] overflow-hidden rounded-lg border border-primary bg-primary shadow-xl transition-opacity duration-100 ${
					layout ? "animate-popover-in opacity-100" : "opacity-0"
				}`}
				style={{
					top: layout?.top ?? rect.top + rect.height + POPOVER_OFFSET,
					left: layout?.left ?? rect.left,
				}}
			>
				<Tabs
					defaultValue="comment"
					className="flex max-h-[70vh] min-h-0 flex-col"
				>
					<div className="flex shrink-0 items-start justify-between p-4 pb-3">
						<div>
							<h2
								id={titleId}
								className="font-mono text-sm font-semibold text-element"
							>
								&lt;{tag}&gt;
							</h2>
							<div className="mt-1 text-xs text-element-size">
								{Math.round(rect.width)} &times; {Math.round(rect.height)}
							</div>
						</div>
						<Button
							size="icon-sm"
							onClick={onClose}
							aria-label="Close inspector"
						>
							<XMarkIcon className="size-4" />
						</Button>
					</div>
					<div className="px-4 pb-3">
						<TabsList aria-label="Inspector view">
							<TabsTrigger value="comment">Comment</TabsTrigger>
							<TabsTrigger value="info">Info</TabsTrigger>
							<TabsIndicator />
						</TabsList>
					</div>
					<ScrollArea.Root className="relative min-h-0 flex-1">
						<ScrollArea.Viewport className="h-full">
							<ScrollArea.Content className="px-4 pb-4">
								<TabsContent value="comment">
									{sourceLabel ? (
										<CopyableCodeSnippet
											label="Source"
											value={sourceLabel}
											copied={sourceCopied}
											onCopy={onCopySource}
											copyLabel="Copy source"
											copiedLabel="Copied!"
											ariaLabel="Copy source file"
											codeClassName="text-sourcefile"
										/>
									) : null}
									<Separator className="my-3" />
									<CommentForm onSubmit={onSubmit} />
								</TabsContent>

								<TabsContent value="info">
									<div className="mb-3">
										<SectionLabel>Classes</SectionLabel>
										{classes.length > 0 ? (
											<div className="flex flex-wrap gap-1">
												{classes.map((className) => (
													<span
														key={className}
														className="rounded bg-classes px-1.5 py-0.5 font-mono text-xs text-classes"
													>
														.{className}
													</span>
												))}
											</div>
										) : (
											<span className="text-xs italic text-zinc-400">
												No classes
											</span>
										)}
									</div>

									<CopyableCodeSnippet
										label="Selector"
										value={elementInfo.cssSelector}
										copied={selectorCopied}
										onCopy={onCopySelector}
										copyLabel="Copy selector"
										copiedLabel="Copied!"
										ariaLabel="Copy CSS selector"
									/>

									{sourceLabel ? (
										<CopyableCodeSnippet
											label="Source"
											value={sourceLabel}
											copied={sourceCopied}
											onCopy={onCopySource}
											copyLabel="Copy source"
											copiedLabel="Copied!"
											ariaLabel="Copy source file"
											codeClassName="text-sourcefile"
										/>
									) : null}

									{styles ? (
										<div className="mb-3">
											<SectionLabel>Box Model</SectionLabel>
											<BoxModel
												margin={{
													top: styles.marginTop,
													right: styles.marginRight,
													bottom: styles.marginBottom,
													left: styles.marginLeft,
												}}
												padding={{
													top: styles.paddingTop,
													right: styles.paddingRight,
													bottom: styles.paddingBottom,
													left: styles.paddingLeft,
												}}
												width={rect.width}
												height={rect.height}
											/>
										</div>
									) : null}
								</TabsContent>
							</ScrollArea.Content>
						</ScrollArea.Viewport>
						<ScrollArea.Scrollbar className="pointer-events-none absolute right-0 top-0 m-2 flex h-[calc(100%-1rem)] w-1 justify-center rounded-sm bg-zinc-200 opacity-0 transition-opacity data-hovering:pointer-events-auto data-hovering:opacity-100 data-scrolling:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0">
							<ScrollArea.Thumb className="w-full rounded-sm bg-zinc-400" />
						</ScrollArea.Scrollbar>
					</ScrollArea.Root>
				</Tabs>
			</div>
		</>
	);
}
