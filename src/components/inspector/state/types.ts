"use client";

import type { CommentType, Deploy, Note } from "@/types";

export interface FilterState {
	type: CommentType | null;
}

export type ToolbarSide = "left" | "right";
export type PanelMode = "floating" | "drawer";

export interface InspectorState {
	inspectMode: boolean;
	selectedElement: HTMLElement | null;
	popoverOpen: boolean;
	notes: Note[];
	panelOpen: boolean;
	panelMode: PanelMode;
	announcement: string;
	highlightedNoteId: string | null;
	activeNoteId: string | null;
	deploys: Deploy[];
	activeDeploy: string;
	filters: FilterState;
	toolbarSide: ToolbarSide;
	toolbarWidth: number;
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
	| { type: "SET_ACTIVE_DEPLOY"; payload: string }
	| { type: "SET_TYPE_FILTER"; payload: CommentType | null }
	| { type: "SET_TOOLBAR_SIDE"; payload: ToolbarSide }
	| { type: "SET_TOOLBAR_WIDTH"; payload: number }
	| { type: "SET_TOOLBAR_Y"; payload: number | null };

export const initialFilters: FilterState = {
	type: null,
};

export const initialInspectorState: InspectorState = {
	inspectMode: false,
	selectedElement: null,
	popoverOpen: false,
	notes: [],
	panelOpen: true,
	panelMode: "floating",
	announcement: "",
	highlightedNoteId: null,
	activeNoteId: null,
	deploys: [],
	activeDeploy: "v1",
	filters: initialFilters,
	toolbarSide: "right",
	toolbarWidth: 0,
	toolbarY: null,
};
