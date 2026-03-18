"use client";

const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

interface BasicSourceMap {
	sources: string[];
	mappings: string;
}

interface SourceMapJSON {
	sources?: string[];
	mappings?: string;
	sections?: Array<{
		offset: { line: number; column: number };
		map: BasicSourceMap;
	}>;
}

type FiberDebugSource = { fileName?: string; lineNumber?: number };
type FiberType = ((...args: never[]) => unknown) | string | null | undefined;

interface DebugFiber {
	type?: FiberType;
	return?: DebugFiber | null;
	_debugStack?: Error | null;
	_debugSource?: FiberDebugSource | null;
}

const sourceMapCache = new Map<string, Promise<SourceMapJSON | null>>();

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function getFiberNode(el: HTMLElement): DebugFiber | null {
	const fiberKey = Object.keys(el).find((key) =>
		key.startsWith("__reactFiber$"),
	);
	if (!fiberKey) return null;

	const fiber = (el as unknown as Record<string, unknown>)[fiberKey];
	return isRecord(fiber) ? (fiber as DebugFiber) : null;
}

function getFiberComponentName(fiber: DebugFiber): string | null {
	return typeof fiber.type === "function" && fiber.type.name
		? fiber.type.name
		: null;
}

/** Parse source file path from a Turbopack/Webpack stack trace. */
function parseSourceFromStack(stack: string): { file: string } | null {
	for (const line of stack.split("\n")) {
		if (line.includes("node_modules")) continue;

		const turboMatch = line.match(/id=[^:]*?%252Fsrc%252F([^+]+)/);
		if (turboMatch) {
			try {
				const decoded = decodeURIComponent(decodeURIComponent(turboMatch[1]));
				return { file: `src/${decoded}` };
			} catch {
				continue;
			}
		}

		const webpackMatch = line.match(/webpack:\/\/\/\.?\/?src\/([^:?\s]+)/);
		if (webpackMatch) return { file: `src/${webpackMatch[1]}` };
	}

	return null;
}

function decodeVLQSegment(encoded: string): number[] {
	const values: number[] = [];
	let shift = 0;
	let value = 0;

	for (const ch of encoded) {
		const digit = B64.indexOf(ch);
		if (digit === -1) break;

		value += (digit & 0x1f) << shift;
		if (digit & 0x20) {
			shift += 5;
		} else {
			values.push(value & 1 ? -(value >> 1) : value >> 1);
			shift = 0;
			value = 0;
		}
	}

	return values;
}

function fetchSourceMap(url: string): Promise<SourceMapJSON | null> {
	const cached = sourceMapCache.get(url);
	if (cached) return cached;

	const promise = fetch(`${url}.map`)
		.then((res) => (res.ok ? res.json() : null))
		.catch(() => null);

	sourceMapCache.set(url, promise);
	return promise;
}

function lookupInBasicMap(
	map: BasicSourceMap,
	targetLine: number,
	targetCol: number,
): { file: string; line: number } | null {
	if (!map.mappings || !map.sources) return null;

	const lines = map.mappings.split(";");
	let srcIdx = 0;
	let srcLine = 0;

	for (let i = 0; i < lines.length && i <= targetLine; i++) {
		if (!lines[i]) continue;

		let genCol = 0;
		let match: { file: string; line: number } | null = null;

		for (const segment of lines[i].split(",")) {
			if (!segment) continue;

			const fields = decodeVLQSegment(segment);
			if (fields.length >= 4) {
				genCol += fields[0];
				srcIdx += fields[1];
				srcLine += fields[2];

				if (i === targetLine && genCol <= targetCol) {
					const src = map.sources[srcIdx];
					if (src && !src.includes("node_modules")) {
						match = { file: src, line: srcLine + 1 };
					}
				}
			} else if (fields.length >= 1) {
				genCol += fields[0];
			}
		}

		if (i === targetLine && match) return match;
	}

	return null;
}

function lookupInSourceMap(
	map: SourceMapJSON,
	targetLine: number,
	targetCol: number,
): { file: string; line: number } | null {
	if (map.sections) {
		for (let i = map.sections.length - 1; i >= 0; i--) {
			const { offset, map: sectionMap } = map.sections[i];
			if (
				targetLine > offset.line ||
				(targetLine === offset.line && targetCol >= offset.column)
			) {
				return lookupInBasicMap(
					sectionMap,
					targetLine - offset.line,
					targetLine === offset.line ? targetCol - offset.column : targetCol,
				);
			}
		}

		return null;
	}

	if (map.mappings && map.sources) {
		return lookupInBasicMap(
			{ sources: map.sources, mappings: map.mappings },
			targetLine,
			targetCol,
		);
	}

	return null;
}

function normalizeSourcePath(filePath: string): string {
	if (filePath.startsWith("[project]/")) {
		filePath = filePath.slice("[project]/".length);
	}

	if (!filePath.startsWith("src/")) {
		const sourceIndex = filePath.indexOf("src/");
		if (sourceIndex !== -1) filePath = filePath.slice(sourceIndex);
	}

	return filePath;
}

export function getReactFiberSource(el: HTMLElement): {
	sourceFile?: string;
	sourceLine?: number;
	componentStack: string[];
} {
	let fiber = getFiberNode(el);
	if (!fiber) return { componentStack: [] };

	let sourceFile: string | undefined;
	let sourceLine: number | undefined;
	const components: string[] = [];

	while (fiber) {
		const componentName = getFiberComponentName(fiber);
		const debugSource = fiber._debugSource;

		if (debugSource?.fileName?.includes("src/")) {
			if (!sourceFile) {
				const sourceIndex = debugSource.fileName.indexOf("src/");
				sourceFile = debugSource.fileName.slice(sourceIndex);
				sourceLine = debugSource.lineNumber;
			}

			if (componentName) components.push(componentName);
			fiber = fiber.return ?? null;
			continue;
		}

		const stack = fiber._debugStack?.stack;
		if (stack) {
			const hasUserCode =
				stack.includes("%252Fsrc%252F") || stack.includes("/src/");

			if (hasUserCode) {
				if (!sourceFile) {
					const parsed = parseSourceFromStack(stack);
					if (parsed) sourceFile = parsed.file;
				}

				if (componentName) components.push(componentName);
			}
		}

		fiber = fiber.return ?? null;
	}

	return { sourceFile, sourceLine, componentStack: components.reverse() };
}

/** Resolve source file via Turbopack source maps, with component-name fallback. */
export async function resolveSourceAsync(
	el: HTMLElement,
): Promise<{ sourceFile: string; sourceLine: number } | null> {
	let fiber = getFiberNode(el);
	let nearestComponent: string | undefined;

	while (fiber) {
		const componentName = getFiberComponentName(fiber);
		if (!nearestComponent && componentName) {
			nearestComponent = componentName;
		}

		const stack = fiber._debugStack?.stack;
		if (stack) {
			for (const line of stack.split("\n")) {
				if (line.includes("node_modules")) continue;

				const match = line.match(/\(?(https?:\/\/.+):(\d+):(\d+)\)?/);
				if (match && !match[1].includes("node_modules")) {
					const map = await fetchSourceMap(match[1]);
					if (!map) continue;

					const result = lookupInSourceMap(
						map,
						Number.parseInt(match[2], 10) - 1,
						Number.parseInt(match[3], 10),
					);

					if (result) {
						return {
							sourceFile: normalizeSourcePath(result.file),
							sourceLine: result.line,
						};
					}
				}
			}
		}

		fiber = fiber.return ?? null;
	}

	if (nearestComponent) {
		const kebab = nearestComponent
			.replace(/([a-z])([A-Z])/g, "$1-$2")
			.toLowerCase();

		return {
			sourceFile: `src/components/demo/${kebab}/index.tsx`,
			sourceLine: 1,
		};
	}

	return null;
}
