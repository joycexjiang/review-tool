"use client";

import { useMemo } from "react";
import {
	useInspectorActions,
	useInspectorState,
} from "@/components/inspector/state/provider";
import {
	getPanelMode,
	isInspectMode,
	isPanelOpen,
} from "@/components/inspector/state/types";
import type { ToolbarActionsValue, ToolbarDataValue } from "../toolbar-context";
import { useToolbarLayout } from "./use-toolbar-layout";

export function useToolbarController() {
	const {
		inspection,
		reviewPopover,
		toolbarHeight,
		toolbarSide,
		toolbarX,
		toolbarY,
		numberBadgesVisible,
	} = useInspectorState();
	const {
		setToolbarHeight,
		setToolbarSide,
		setToolbarWidth,
		setToolbarX,
		setToolbarY,
		toggleInspectMode,
		togglePanel,
		toggleNumberBadges,
	} = useInspectorActions();
	const inspectMode = isInspectMode(inspection);
	const panelMode = getPanelMode(reviewPopover);
	const panelOpen = isPanelOpen(reviewPopover);
	const layout = useToolbarLayout({
		panelMode,
		panelOpen,
		setToolbarHeight,
		setToolbarSide,
		setToolbarWidth,
		setToolbarX,
		setToolbarY,
		toolbarHeight,
		toolbarSide,
		toolbarX,
		toolbarY,
	});

	const data = useMemo<ToolbarDataValue>(
		() => ({
			inspectMode,
			panelOpen,
			numberBadgesVisible,
		}),
		[inspectMode, panelOpen, numberBadgesVisible],
	);

	const actions = useMemo<ToolbarActionsValue>(
		() => ({
			toggleInspectMode,
			togglePanel,
			toggleNumberBadges,
		}),
		[toggleInspectMode, togglePanel, toggleNumberBadges],
	);

	return { actions, data, layout };
}
