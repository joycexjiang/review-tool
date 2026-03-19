"use client";

import { createMockNotes } from "@/mock/comments";
import { deploys } from "@/mock/deploys";
import type { InspectorAction, InspectorState } from "./types";
import { initialFilters, initialInspectorState, isPanelOpen } from "./types";

export function createInitialInspectorState(): InspectorState {
	return {
		...initialInspectorState,
		notes: createMockNotes(),
		deploys,
		activeDeploy: "v2",
	};
}

export function inspectorReducer(
	state: InspectorState,
	action: InspectorAction,
): InspectorState {
	switch (action.type) {
		case "TOGGLE_INSPECT_MODE":
			if (state.inspection.type === "idle") {
				return {
					...state,
					inspection: { type: "armed" },
				};
			}

			return {
				...state,
				inspection: { type: "idle" },
			};

		case "SELECT_ELEMENT":
			if (!action.payload) {
				return {
					...state,
					inspection: { type: "armed" },
				};
			}
			return {
				...state,
				inspection: { type: "selected", element: action.payload },
			};

		case "CLOSE_POPOVER":
			return { ...state, inspection: { type: "armed" } };

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
			switch (state.reviewPopover.type) {
				case "closed-floating":
					return {
						...state,
						reviewPopover: { type: "open-floating" },
					};
				case "open-floating":
					return {
						...state,
						reviewPopover: { type: "closed-floating" },
					};
				case "closed-drawer":
					return {
						...state,
						reviewPopover: { type: "open-drawer", isResizing: false },
					};
				case "open-drawer":
					// Close to floating mode so the drawer unmounts and the demo
					// content area expands back to full width (same as collapse).
					return {
						...state,
						reviewPopover: { type: "closed-floating" },
					};
			}
			return state;

		case "TOGGLE_PANEL_MODE":
			switch (state.reviewPopover.type) {
				case "closed-floating":
					return {
						...state,
						reviewPopover: { type: "closed-drawer" },
					};
				case "open-floating":
					return {
						...state,
						reviewPopover: { type: "open-drawer", isResizing: false },
					};
				case "closed-drawer":
					return {
						...state,
						reviewPopover: { type: "closed-floating" },
					};
				case "open-drawer":
					return {
						...state,
						reviewPopover: { type: "open-floating" },
					};
			}
			return state;

		case "ANNOUNCE":
			return {
				...state,
				announcement: action.payload,
			};

		case "SCROLL_TO_NOTE":
			return {
				...state,
				reviewPopover: isPanelOpen(state.reviewPopover)
					? state.reviewPopover
					: state.reviewPopover.type === "closed-drawer"
						? { type: "open-drawer", isResizing: false }
						: { type: "open-floating" },
				highlightedNoteId: action.payload,
			};

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

		case "SET_DRAWER_WIDTH":
			return { ...state, drawerWidth: action.payload };

		case "SET_DRAWER_RESIZING":
			if (state.reviewPopover.type !== "open-drawer") {
				return state;
			}

			return {
				...state,
				reviewPopover: {
					type: "open-drawer",
					isResizing: action.payload,
				},
			};

		case "SET_TOOLBAR_SIDE":
			return { ...state, toolbarSide: action.payload };

		case "SET_TOOLBAR_WIDTH":
			return { ...state, toolbarWidth: action.payload };

		case "SET_TOOLBAR_HEIGHT":
			return { ...state, toolbarHeight: action.payload };

		case "SET_TOOLBAR_X":
			return { ...state, toolbarX: action.payload };

		case "SET_TOOLBAR_Y":
			return { ...state, toolbarY: action.payload };

		case "TOGGLE_NUMBER_BADGES":
			return { ...state, numberBadgesVisible: !state.numberBadgesVisible };

		default:
			return state;
	}
}
