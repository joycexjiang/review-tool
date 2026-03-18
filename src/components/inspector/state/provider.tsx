"use client";

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useReducer,
} from "react";
import { useHoverContext } from "@/components/inspector/element-hover/hover-context";
import { useInspectorHotkeys } from "@/components/inspector/hooks/use-inspector-hotkeys";
import type { CommentType, DeployVersion, Note } from "@/types";
import { AnnouncementReset } from "./announcement-reset";
import { createInitialInspectorState, inspectorReducer } from "./reducer";
import {
	getPanelMode,
	getSelectedElement,
	type InspectorStateView,
	isDrawerResizing,
	isInspectMode,
	isPanelOpen,
	isPopoverOpen,
	type ToolbarSide,
} from "./types";

const InspectorStateContext = createContext<InspectorStateView | null>(null);

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
	setActiveDeploy: (version: DeployVersion) => void;
	setTypeFilter: (type: CommentType | null) => void;
	setDrawerWidth: (width: number) => void;
	setDrawerResizing: (isResizing: boolean) => void;
	setToolbarSide: (side: ToolbarSide) => void;
	setToolbarWidth: (width: number) => void;
	setToolbarHeight: (height: number) => void;
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

	const setActiveDeploy = useCallback((version: DeployVersion) => {
		dispatch({ type: "SET_ACTIVE_DEPLOY", payload: version });
	}, []);

	const setTypeFilter = useCallback((type: CommentType | null) => {
		dispatch({ type: "SET_TYPE_FILTER", payload: type });
	}, []);

	const setDrawerWidth = useCallback((width: number) => {
		dispatch({ type: "SET_DRAWER_WIDTH", payload: width });
	}, []);

	const setDrawerResizing = useCallback((isResizing: boolean) => {
		dispatch({ type: "SET_DRAWER_RESIZING", payload: isResizing });
	}, []);

	const setToolbarSide = useCallback((side: ToolbarSide) => {
		dispatch({ type: "SET_TOOLBAR_SIDE", payload: side });
	}, []);

	const setToolbarWidth = useCallback((width: number) => {
		dispatch({ type: "SET_TOOLBAR_WIDTH", payload: width });
	}, []);

	const setToolbarHeight = useCallback((height: number) => {
		dispatch({ type: "SET_TOOLBAR_HEIGHT", payload: height });
	}, []);

	const setToolbarY = useCallback((y: number | null) => {
		dispatch({ type: "SET_TOOLBAR_Y", payload: y });
	}, []);

	useInspectorHotkeys({ toggleInspectMode, togglePanel });

	const stateView = useMemo<InspectorStateView>(
		() => ({
			...state,
			inspectMode: isInspectMode(state.inspection),
			selectedElement: getSelectedElement(state.inspection),
			popoverOpen: isPopoverOpen(state.inspection),
			panelOpen: isPanelOpen(state.reviewPopover),
			panelMode: getPanelMode(state.reviewPopover),
			isResizingDrawer: isDrawerResizing(state.reviewPopover),
		}),
		[state],
	);

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
			setDrawerWidth,
			setDrawerResizing,
			setToolbarSide,
			setToolbarWidth,
			setToolbarHeight,
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
			setDrawerWidth,
			setDrawerResizing,
			setToolbarSide,
			setToolbarWidth,
			setToolbarHeight,
			setToolbarY,
		],
	);

	return (
		<InspectorStateContext.Provider value={stateView}>
			<InspectorActionsContext.Provider value={actions}>
				{children}
				{stateView.announcement ? (
					<AnnouncementReset
						key={stateView.announcement}
						onClear={() => dispatch({ type: "ANNOUNCE", payload: "" })}
					/>
				) : null}
				<div aria-live="polite" aria-atomic="true" className="sr-only">
					{stateView.announcement}
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
