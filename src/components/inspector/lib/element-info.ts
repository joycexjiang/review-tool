"use client";

import type { ElementInfo, ElementRect } from "@/types";
import { getCssSelector } from "./dom-utils";
import { getReactFiberSource } from "./source-resolution";

function toElementRect(rect: DOMRect): ElementRect {
	return {
		x: rect.x,
		y: rect.y,
		width: rect.width,
		height: rect.height,
		top: rect.top,
		right: rect.right,
		bottom: rect.bottom,
		left: rect.left,
	};
}

export function buildElementInfo(element: HTMLElement): ElementInfo {
	const rect = element.getBoundingClientRect();
	const computed = getComputedStyle(element);
	const fiberInfo = getReactFiberSource(element);

	return {
		tagName: element.tagName,
		className: typeof element.className === "string" ? element.className : "",
		boundingRect: toElementRect(rect),
		cssSelector: getCssSelector(element),
		sourceFile: fiberInfo.sourceFile,
		sourceLine: fiberInfo.sourceLine,
		componentStack:
			fiberInfo.componentStack.length > 0
				? fiberInfo.componentStack
				: undefined,
		computedStyles: {
			marginTop: computed.marginTop,
			marginRight: computed.marginRight,
			marginBottom: computed.marginBottom,
			marginLeft: computed.marginLeft,
			paddingTop: computed.paddingTop,
			paddingRight: computed.paddingRight,
			paddingBottom: computed.paddingBottom,
			paddingLeft: computed.paddingLeft,
		},
	};
}
