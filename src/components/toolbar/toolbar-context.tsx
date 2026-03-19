"use client";

import { createContext, useContext } from "react";

export interface ToolbarDataValue {
	inspectMode: boolean;
	panelOpen: boolean;
	numberBadgesVisible: boolean;
}

export interface ToolbarActionsValue {
	toggleInspectMode: () => void;
	togglePanel: () => void;
	toggleNumberBadges: () => void;
}

export interface ToolbarLayoutValue {
	elementRef: (node: HTMLDivElement | null) => void;
	isDrawerOpen: boolean;
	onPointerCancel?: React.PointerEventHandler<HTMLDivElement>;
	onPointerDown?: React.PointerEventHandler<HTMLDivElement>;
	onPointerMove?: React.PointerEventHandler<HTMLDivElement>;
	onPointerUp?: React.PointerEventHandler<HTMLDivElement>;
	style: React.CSSProperties;
	toolbarSide: "left" | "right" | "top" | "bottom";
}

const ToolbarDataContext = createContext<ToolbarDataValue | null>(null);
const ToolbarActionsContext = createContext<ToolbarActionsValue | null>(null);
const ToolbarLayoutContext = createContext<ToolbarLayoutValue | null>(null);

export function ToolbarProvider({
	actions,
	children,
	data,
	layout,
}: {
	actions: ToolbarActionsValue;
	children: React.ReactNode;
	data: ToolbarDataValue;
	layout: ToolbarLayoutValue;
}) {
	return (
		<ToolbarDataContext.Provider value={data}>
			<ToolbarActionsContext.Provider value={actions}>
				<ToolbarLayoutContext.Provider value={layout}>
					{children}
				</ToolbarLayoutContext.Provider>
			</ToolbarActionsContext.Provider>
		</ToolbarDataContext.Provider>
	);
}

export function useToolbarData() {
	const context = useContext(ToolbarDataContext);
	if (!context) {
		throw new Error("useToolbarData must be used within ToolbarProvider");
	}

	return context;
}

export function useToolbarActions() {
	const context = useContext(ToolbarActionsContext);
	if (!context) {
		throw new Error("useToolbarActions must be used within ToolbarProvider");
	}

	return context;
}

export function useToolbarLayoutContext() {
	const context = useContext(ToolbarLayoutContext);
	if (!context) {
		throw new Error(
			"useToolbarLayoutContext must be used within ToolbarProvider",
		);
	}

	return context;
}
