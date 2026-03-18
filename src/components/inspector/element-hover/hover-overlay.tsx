"use client";

import { extractTailwindSpacing } from "@/components/inspector/lib/dom-utils";
import { useInspectorState } from "@/components/inspector/state/provider";
import { isInspectionArmed } from "@/components/inspector/state/types";
import { useResolvedSource } from "@/hooks/use-resolved-source";
import { useHoverContext } from "./hover-context";

interface OverlayPosition {
	top: number;
	left: number;
	width: number;
	height: number;
}

interface TooltipPosition {
	top: number;
	left: number;
}

export default function HoverOverlay() {
	const { inspection } = useInspectorState();
	const { hoveredElement } = useHoverContext();
	const activeElement = isInspectionArmed(inspection) ? hoveredElement : null;
	const { sourceFile } = useResolvedSource(activeElement);

	if (!activeElement) {
		return null;
	}

	const rect = activeElement.getBoundingClientRect();
	const overlay: OverlayPosition = {
		top: rect.top + window.scrollY,
		left: rect.left + window.scrollX,
		width: rect.width,
		height: rect.height,
	};
	const tag = activeElement.tagName.toLowerCase();
	const primaryClass =
		activeElement.className && typeof activeElement.className === "string"
			? activeElement.className
					.split(/\s+/)
					.find((c) => c && !c.startsWith("hover:") && !c.startsWith("focus:"))
			: "";
	const elementLabel = primaryClass ? `${tag}.${primaryClass}` : tag;
	const elementSize = `${Math.round(rect.width)} × ${Math.round(rect.height)}`;
	const spacingClasses = extractTailwindSpacing(activeElement);

	const tooltipTop =
		rect.top + window.scrollY - (spacingClasses.length > 0 ? 64 : 40);
	const tooltipLeft = rect.left + window.scrollX;
	const tooltip: TooltipPosition = {
		top: tooltipTop < 10 ? rect.bottom + window.scrollY + 8 : tooltipTop,
		left: Math.max(8, Math.min(tooltipLeft, window.innerWidth - 300)),
	};

	return (
		<>
			{/* Highlight overlay */}
			<div
				data-inspector-overlay
				className="pointer-events-none fixed z-9998"
				style={{
					top: overlay.top - window.scrollY,
					left: overlay.left - window.scrollX,
					width: overlay.width,
					height: overlay.height,
				}}
			>
				<div className="h-full w-full rounded-[2px] border-2 border-blue-500 bg-blue-500/10" />
			</div>

			{/* Tooltip */}
			{tooltip && (
				<div
					data-inspector-tooltip
					className="pointer-events-none fixed z-9999 rounded-md bg-primary px-2.5 py-1.5 shadow-lg"
					style={{
						top: tooltip.top - window.scrollY,
						left: tooltip.left - window.scrollX,
					}}
				>
					<div className="flex items-center gap-2 text-xs text-white">
						<span className="font-mono text-element">{elementLabel}</span>
						<span className="text-element-size">{elementSize}</span>
					</div>
					{sourceFile && (
						<div className="mt-0.5 font-mono text-xs text-sourcefile">
							{sourceFile}
						</div>
					)}
					{spacingClasses.length > 0 && (
						<div className="mt-1 flex flex-wrap gap-1">
							{spacingClasses.map((cls) => (
								<span
									key={cls}
									className="rounded bg-classes px-1.5 py-0.5 font-mono text-xs text-classes"
								>
									{cls}
								</span>
							))}
						</div>
					)}
				</div>
			)}
		</>
	);
}
