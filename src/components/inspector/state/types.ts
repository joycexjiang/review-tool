"use client";

import type { CommentType, Deploy, DeployVersion, Note } from "@/types";

const REVIEW_POPOVER_DRAWER_DEFAULT_WIDTH = 420;
const REVIEW_POPOVER_TOOLBAR_DEFAULT_WIDTH = 87;
const REVIEW_POPOVER_TOOLBAR_DEFAULT_HEIGHT = 42;

export interface FilterState {
	type: CommentType | null;
}

export type ToolbarSide = "left" | "right";
export type PanelMode = "floating" | "drawer";

export type InspectionState =
	| { type: "idle" }
	| { type: "armed" }
	| { type: "selected"; element: HTMLElement };

export type ReviewPopoverState =
	| { type: "closed-floating" }
	| { type: "open-floating" }
	| { type: "closed-drawer" }
	| { type: "open-drawer"; isResizing: boolean };

export interface InspectorState {
	inspection: InspectionState;
	notes: Note[];
	reviewPopover: ReviewPopoverState;
	drawerWidth: number;
	announcement: string;
	highlightedNoteId: string | null;
	activeNoteId: string | null;
	deploys: Deploy[];
	activeDeploy: DeployVersion;
	filters: FilterState;
	toolbarSide: ToolbarSide;
	toolbarWidth: number;
	toolbarHeight: number;
	toolbarY: number | null;
}

export type InspectorAction =
	| { type: "TOGGLE_INSPECT_MODE" }
	| { type: "SELECT_ELEMENT"; payload: HTMLElement | null }
	| { type: "CLOSE_POPOVER" }
	| { type: "ADD_NOTE"; payload: Note }
	| { type: "TOGGLE_RESOLVE"; payload: string }
	| { type: "TOGGLE_PANEL" }
	| { type: "TOGGLE_PANEL_MODE" }
	| { type: "ANNOUNCE"; payload: string }
	| { type: "SCROLL_TO_NOTE"; payload: string }
	| { type: "SET_ACTIVE_NOTE"; payload: string | null }
	| { type: "CLEAR_HIGHLIGHT" }
	| { type: "SET_ACTIVE_DEPLOY"; payload: DeployVersion }
	| { type: "SET_TYPE_FILTER"; payload: CommentType | null }
	| { type: "SET_DRAWER_WIDTH"; payload: number }
	| { type: "SET_DRAWER_RESIZING"; payload: boolean }
	| { type: "SET_TOOLBAR_SIDE"; payload: ToolbarSide }
	| { type: "SET_TOOLBAR_WIDTH"; payload: number }
	| { type: "SET_TOOLBAR_HEIGHT"; payload: number }
	| { type: "SET_TOOLBAR_Y"; payload: number | null };

export const initialFilters: FilterState = {
	type: null,
};

export const initialInspectorState: InspectorState = {
	inspection: { type: "idle" },
	notes: [],
	reviewPopover: { type: "open-floating" },
	drawerWidth: REVIEW_POPOVER_DRAWER_DEFAULT_WIDTH,
	announcement: "",
	highlightedNoteId: null,
	activeNoteId: null,
	deploys: [],
	activeDeploy: "v1",
	filters: initialFilters,
	toolbarSide: "right",
	toolbarWidth: REVIEW_POPOVER_TOOLBAR_DEFAULT_WIDTH,
	toolbarHeight: REVIEW_POPOVER_TOOLBAR_DEFAULT_HEIGHT,
	toolbarY: null,
};

export interface InspectorStateView extends InspectorState {
	inspectMode: boolean;
	selectedElement: HTMLElement | null;
	popoverOpen: boolean;
	panelOpen: boolean;
	panelMode: PanelMode;
	isResizingDrawer: boolean;
}

export function isInspectMode(inspection: InspectionState): boolean {
	return inspection.type !== "idle";
}

export function isInspectionArmed(inspection: InspectionState): boolean {
	return inspection.type === "armed";
}

export function getSelectedElement(
	inspection: InspectionState,
): HTMLElement | null {
	return inspection.type === "selected" ? inspection.element : null;
}

export function isPopoverOpen(inspection: InspectionState): boolean {
	return inspection.type === "selected";
}

export function isPanelOpen(reviewPopover: ReviewPopoverState): boolean {
	return (
		reviewPopover.type === "open-floating" ||
		reviewPopover.type === "open-drawer"
	);
}

export function getPanelMode(reviewPopover: ReviewPopoverState): PanelMode {
	return reviewPopover.type.endsWith("drawer") ? "drawer" : "floating";
}

export function isDrawerPanelMode(reviewPopover: ReviewPopoverState): boolean {
	return getPanelMode(reviewPopover) === "drawer";
}

export function isDrawerPanelOpen(reviewPopover: ReviewPopoverState): boolean {
	return reviewPopover.type === "open-drawer";
}

export function isDrawerResizing(reviewPopover: ReviewPopoverState): boolean {
	return reviewPopover.type === "open-drawer" && reviewPopover.isResizing;
}
