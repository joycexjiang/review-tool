"use client";

import type { ElementInfo } from "@/types";
import { getCssSelector } from "./dom-utils";
import { getReactFiberSource } from "./source-resolution";

export function buildElementInfo(element: HTMLElement): ElementInfo {
	const rect = element.getBoundingClientRect();
	const computed = getComputedStyle(element);
	const fiberInfo = getReactFiberSource(element);

	return {
		tagName: element.tagName,
		className: typeof element.className === "string" ? element.className : "",
		boundingRect: rect,
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
