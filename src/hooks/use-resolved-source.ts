"use client";

import { useEffect, useMemo, useState } from "react";
import { buildElementInfo } from "@/components/inspector/lib/element-info";
import { resolveSourceAsync } from "@/components/inspector/lib/source-resolution";
import type { ElementInfo } from "@/types";

type ResolvedSource = {
	sourceFile: string;
	sourceLine: number;
} | null;

const resolvedSourceCache = new WeakMap<HTMLElement, Promise<ResolvedSource>>();

function resolveSourceCached(element: HTMLElement) {
	const cached = resolvedSourceCache.get(element);
	if (cached) {return cached;}

	const promise = resolveSourceAsync(element);
	resolvedSourceCache.set(element, promise);
	return promise;
}

function useAsyncResolvedSource(
	element: HTMLElement | null,
	enabled: boolean,
	shouldResolve: boolean,
) {
	const [resolvedSourceState, setResolvedSourceState] = useState<{
		element: HTMLElement;
		result: ResolvedSource;
	} | null>(null);

	useEffect(() => {
		if (!element || !enabled || !shouldResolve) {
			return;
		}

		let cancelled = false;

		void resolveSourceCached(element).then((result) => {
			if (cancelled) {
				return;
			}
			setResolvedSourceState({ element, result });
		});

		return () => {
			cancelled = true;
		};
	}, [element, enabled, shouldResolve]);

	return resolvedSourceState?.element === element
		? resolvedSourceState.result
		: undefined;
}

export function useResolvedSource(
	element: HTMLElement | null,
	enabled = true,
): { sourceFile: string | null; sourceLine: number | null; loading: boolean } {
	const syncSource = useMemo(() => {
		if (!element || !enabled) {
			return { sourceFile: null, sourceLine: null, loading: false };
		}

		const info = buildElementInfo(element);
		if (info.sourceFile) {
			return {
				sourceFile: info.sourceFile,
				sourceLine: info.sourceLine ?? null,
				loading: false,
			};
		}

		return { sourceFile: null, sourceLine: null, loading: true };
	}, [element, enabled]);
	const resolvedSource = useAsyncResolvedSource(
		element,
		enabled,
		!syncSource.sourceFile,
	);

	if (!element || !enabled) {
		return { sourceFile: null, sourceLine: null, loading: false };
	}

	if (syncSource.sourceFile) {
		return syncSource;
	}

	if (resolvedSource === undefined) {
		return syncSource;
	}

	return {
		sourceFile: resolvedSource?.sourceFile ?? null,
		sourceLine: resolvedSource?.sourceLine ?? null,
		loading: false,
	};
}

export function useResolvedElementInfo(
	element: HTMLElement | null,
	enabled = true,
): ElementInfo | null {
	const info = useMemo(() => {
		if (!element || !enabled) {return null;}
		return buildElementInfo(element);
	}, [element, enabled]);
	const resolvedSource = useAsyncResolvedSource(
		element,
		enabled,
		!info?.sourceFile,
	);

	if (!info) {return null;}
	if (info.sourceFile || !resolvedSource) {return info;}
	return { ...info, ...resolvedSource };
}
