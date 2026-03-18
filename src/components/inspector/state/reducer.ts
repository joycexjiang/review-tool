"use client";

import { createMockNotes } from "@/mock/comments";
import { deploys } from "@/mock/deploys";
import type { InspectorAction, InspectorState } from "./types";
import { initialFilters, initialInspectorState } from "./types";

export function createInitialInspectorState(): InspectorState {
	return {
		...initialInspectorState,
		notes: createMockNotes(),
		deploys,
		activeDeploy: "v1",
	};
}

export function inspectorReducer(
	state: InspectorState,
	action: InspectorAction,
): InspectorState {
	switch (action.type) {
		case "TOGGLE_INSPECT_MODE":
			if (state.inspectMode) {
				return {
					...state,
					inspectMode: false,
					selectedElement: null,
					popoverOpen: false,
				};
			}
			return { ...state, inspectMode: true };

		case "SELECT_ELEMENT":
			return {
				...state,
				selectedElement: action.payload,
				popoverOpen: !!action.payload,
			};

		case "CLOSE_POPOVER":
			return { ...state, selectedElement: null, popoverOpen: false };

		case "ADD_NOTE":
			return {
				...state,
				notes: [...state.notes, action.payload],
				announcement: "Comment added",
			};

		case "TOGGLE_RESOLVE": {
			const note = state.notes.find((entry) => entry.id === action.payload);
			const newResolved = note ? !note.resolved : false;

			return {
				...state,
				notes: state.notes.map((entry) =>
					entry.id === action.payload
						? { ...entry, resolved: !entry.resolved }
						: entry,
				),
				announcement: newResolved ? "Comment resolved" : "Comment unresolved",
			};
		}

		case "TOGGLE_PANEL":
			return { ...state, panelOpen: !state.panelOpen };

		case "TOGGLE_PANEL_MODE":
			return {
				...state,
				panelMode: state.panelMode === "floating" ? "drawer" : "floating",
				toolbarSide:
					state.panelMode === "floating" ? "left" : state.toolbarSide,
			};

		case "ANNOUNCE":
			return { ...state, announcement: action.payload };

		case "SCROLL_TO_NOTE":
			return { ...state, panelOpen: true, highlightedNoteId: action.payload };

		case "SET_ACTIVE_NOTE":
			return { ...state, activeNoteId: action.payload };

		case "CLEAR_HIGHLIGHT":
			return { ...state, highlightedNoteId: null };

		case "SET_ACTIVE_DEPLOY":
			return {
				...state,
				activeDeploy: action.payload,
				filters: initialFilters,
			};

		case "SET_TYPE_FILTER": {
			const newType =
				state.filters.type === action.payload ? null : action.payload;
			return {
				...state,
				filters: { ...state.filters, type: newType },
			};
		}

		case "SET_TOOLBAR_SIDE":
			return { ...state, toolbarSide: action.payload };

		case "SET_TOOLBAR_WIDTH":
			return { ...state, toolbarWidth: action.payload };

		case "SET_TOOLBAR_Y":
			return { ...state, toolbarY: action.payload };

		default:
			return state;
	}
}
