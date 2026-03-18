"use client";

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useReducer,
} from "react";
import { useHoverContext } from "@/components/inspector/element-hover/hover-context";
import type { CommentType, Note } from "@/types";
import { AnnouncementReset } from "./announcement-reset";
import { createInitialInspectorState, inspectorReducer } from "./reducer";
import type { InspectorState, ToolbarSide } from "./types";
import { useInspectorHotkeys } from "./use-inspector-hotkeys";

const InspectorStateContext = createContext<InspectorState | null>(null);

interface InspectorActions {
	toggleInspectMode: () => void;
	selectElement: (el: HTMLElement | null) => void;
	closePopover: () => void;
	addNote: (note: Note) => void;
	toggleResolve: (id: string) => void;
	togglePanel: () => void;
	togglePanelMode: () => void;
	scrollToNote: (id: string) => void;
	setActiveNote: (id: string | null) => void;
	announce: (message: string) => void;
	clearHighlightedNote: () => void;
	setActiveDeploy: (version: string) => void;
	setTypeFilter: (type: CommentType | null) => void;
	setToolbarSide: (side: ToolbarSide) => void;
	setToolbarWidth: (width: number) => void;
	setToolbarY: (y: number | null) => void;
}

const InspectorActionsContext = createContext<InspectorActions | null>(null);

export function InspectorProvider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(
		inspectorReducer,
		undefined,
		createInitialInspectorState,
	);
	const { setHoveredElement } = useHoverContext();

	const toggleInspectMode = useCallback(() => {
		dispatch({ type: "TOGGLE_INSPECT_MODE" });
		setHoveredElement(null);
	}, [setHoveredElement]);

	const selectElement = useCallback((el: HTMLElement | null) => {
		dispatch({ type: "SELECT_ELEMENT", payload: el });
	}, []);

	const closePopover = useCallback(() => {
		dispatch({ type: "CLOSE_POPOVER" });
	}, []);

	const addNote = useCallback((note: Note) => {
		dispatch({ type: "ADD_NOTE", payload: note });
	}, []);

	const toggleResolve = useCallback((id: string) => {
		dispatch({ type: "TOGGLE_RESOLVE", payload: id });
	}, []);

	const togglePanel = useCallback(() => {
		dispatch({ type: "TOGGLE_PANEL" });
	}, []);

	const togglePanelMode = useCallback(() => {
		dispatch({ type: "TOGGLE_PANEL_MODE" });
	}, []);

	const scrollToNote = useCallback((id: string) => {
		dispatch({ type: "SCROLL_TO_NOTE", payload: id });
	}, []);

	const setActiveNote = useCallback((id: string | null) => {
		dispatch({ type: "SET_ACTIVE_NOTE", payload: id });
	}, []);

	const announce = useCallback((message: string) => {
		dispatch({ type: "ANNOUNCE", payload: message });
	}, []);

	const clearHighlightedNote = useCallback(() => {
		dispatch({ type: "CLEAR_HIGHLIGHT" });
	}, []);

	const setActiveDeploy = useCallback((version: string) => {
		dispatch({ type: "SET_ACTIVE_DEPLOY", payload: version });
	}, []);

	const setTypeFilter = useCallback((type: CommentType | null) => {
		dispatch({ type: "SET_TYPE_FILTER", payload: type });
	}, []);

	const setToolbarSide = useCallback((side: ToolbarSide) => {
		dispatch({ type: "SET_TOOLBAR_SIDE", payload: side });
	}, []);

	const setToolbarWidth = useCallback((width: number) => {
		dispatch({ type: "SET_TOOLBAR_WIDTH", payload: width });
	}, []);

	const setToolbarY = useCallback((y: number | null) => {
		dispatch({ type: "SET_TOOLBAR_Y", payload: y });
	}, []);

	useInspectorHotkeys({ toggleInspectMode, togglePanel });

	const actions = useMemo<InspectorActions>(
		() => ({
			toggleInspectMode,
			selectElement,
			closePopover,
			addNote,
			toggleResolve,
			togglePanel,
			togglePanelMode,
			scrollToNote,
			setActiveNote,
			announce,
			clearHighlightedNote,
			setActiveDeploy,
			setTypeFilter,
			setToolbarSide,
			setToolbarWidth,
			setToolbarY,
		}),
		[
			toggleInspectMode,
			selectElement,
			closePopover,
			addNote,
			toggleResolve,
			togglePanel,
			togglePanelMode,
			scrollToNote,
			setActiveNote,
			announce,
			clearHighlightedNote,
			setActiveDeploy,
			setTypeFilter,
			setToolbarSide,
			setToolbarWidth,
			setToolbarY,
		],
	);

	return (
		<InspectorStateContext.Provider value={state}>
			<InspectorActionsContext.Provider value={actions}>
				{children}
				{state.announcement ? (
					<AnnouncementReset
						key={state.announcement}
						onClear={() => dispatch({ type: "ANNOUNCE", payload: "" })}
					/>
				) : null}
				<div aria-live="polite" aria-atomic="true" className="sr-only">
					{state.announcement}
				</div>
			</InspectorActionsContext.Provider>
		</InspectorStateContext.Provider>
	);
}

export function useInspectorState() {
	const ctx = useContext(InspectorStateContext);
	if (!ctx) {
		throw new Error("useInspectorState must be used within InspectorProvider");
	}

	return ctx;
}

export function useInspectorActions() {
	const ctx = useContext(InspectorActionsContext);
	if (!ctx) {
		throw new Error(
			"useInspectorActions must be used within InspectorProvider",
		);
	}

	return ctx;
}
