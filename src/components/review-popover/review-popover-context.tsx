"use client";

import { createContext, useContext } from "react";
import type {
	NoteView,
	ReviewStats,
} from "@/components/inspector/lib/note-view-types";
import type { SeveritySection } from "./lib/review-popover-sections";

export interface ReviewPopoverDataValue {
	deployNotes: NoteView[];
	fixPrompt: string;
	focusedIndex: number;
	headerCopied: boolean;
	highlightedNoteId: string | null;
	isFilteredEmpty: boolean;
	listRef: React.RefObject<HTMLDivElement | null>;
	sections: SeveritySection[];
	stats: ReviewStats;
	unresolvedCount: number;
}

export interface ReviewPopoverActionsValue {
	clearHighlightedNote: () => void;
	close: () => void;
	copyAll: () => void;
	toggleMode: () => void;
	toggleResolve: (id: string) => void;
}

export interface ReviewPopoverLayoutValue {
	drawerDefaultWidth: number;
	drawerMaxWidth: number;
	drawerMinWidth: number;
	drawerWidth: number;
	edgeMargin: number;
	elementRef: (node: HTMLDivElement | null) => void;
	floatingHeight: number;
	floatingPositionStyle: React.CSSProperties;
	floatingTop: number | string | undefined;
	floatingTransition: string;
	floatingWidth: number;
	isDragging: boolean;
	isDrawerMode: boolean;
	isLeft: boolean;
	panelOpen: boolean;
	onDrawerResize: (
		event: MouseEvent | TouchEvent,
		direction: string,
		elementRef: HTMLElement,
	) => void;
	onDrawerResizeStart: () => void;
	onDrawerResizeStop: (
		event: MouseEvent | TouchEvent,
		direction: string,
		elementRef: HTMLElement,
	) => void;
	onPointerCancel: React.PointerEventHandler<HTMLDivElement>;
	onPointerDown: React.PointerEventHandler<HTMLDivElement>;
	onPointerMove: React.PointerEventHandler<HTMLDivElement>;
	onPointerUp: React.PointerEventHandler<HTMLDivElement>;
}

const ReviewPopoverDataContext = createContext<ReviewPopoverDataValue | null>(
	null,
);
const ReviewPopoverActionsContext =
	createContext<ReviewPopoverActionsValue | null>(null);
const ReviewPopoverLayoutContext =
	createContext<ReviewPopoverLayoutValue | null>(null);

export function ReviewPopoverProvider({
	actions,
	children,
	data,
	layout,
}: {
	actions: ReviewPopoverActionsValue;
	children: React.ReactNode;
	data: ReviewPopoverDataValue;
	layout: ReviewPopoverLayoutValue;
}) {
	return (
		<ReviewPopoverDataContext.Provider value={data}>
			<ReviewPopoverActionsContext.Provider value={actions}>
				<ReviewPopoverLayoutContext.Provider value={layout}>
					{children}
				</ReviewPopoverLayoutContext.Provider>
			</ReviewPopoverActionsContext.Provider>
		</ReviewPopoverDataContext.Provider>
	);
}

export function useReviewPopoverData() {
	const context = useContext(ReviewPopoverDataContext);
	if (!context) {
		throw new Error(
			"useReviewPopoverData must be used within ReviewPopoverProvider",
		);
	}

	return context;
}

export function useReviewPopoverActions() {
	const context = useContext(ReviewPopoverActionsContext);
	if (!context) {
		throw new Error(
			"useReviewPopoverActions must be used within ReviewPopoverProvider",
		);
	}

	return context;
}

export function useReviewPopoverLayoutContext() {
	const context = useContext(ReviewPopoverLayoutContext);
	if (!context) {
		throw new Error(
			"useReviewPopoverLayoutContext must be used within ReviewPopoverProvider",
		);
	}

	return context;
}
