"use client";

import { createContext, useContext, useState } from "react";

interface HoverContextValue {
	hoveredElement: HTMLElement | null;
	setHoveredElement: (el: HTMLElement | null) => void;
}

const HoverContext = createContext<HoverContextValue | null>(null);

export function HoverProvider({ children }: { children: React.ReactNode }) {
	const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(
		null,
	);

	return (
		<HoverContext.Provider value={{ hoveredElement, setHoveredElement }}>
			{children}
		</HoverContext.Provider>
	);
}

export function useHoverContext() {
	const ctx = useContext(HoverContext);
	if (!ctx)
		throw new Error("useHoverContext must be used within HoverProvider");
	return ctx;
}
