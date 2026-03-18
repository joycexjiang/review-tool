"use client";

/**
 * Generates a CSS selector for an element.
 * Priority: data-testid > data-note > role+aria-label > id > structural position.
 * Avoids Tailwind classes because they are unstable across builds.
 */
export function getCssSelector(el: HTMLElement): string {
	if (el.getAttribute("data-testid")) {
		return `[data-testid="${el.getAttribute("data-testid")}"]`;
	}

	if (el.getAttribute("data-note")) {
		return `[data-note="${el.getAttribute("data-note")}"]`;
	}

	const role = el.getAttribute("role");
	const ariaLabel = el.getAttribute("aria-label");
	if (
		role &&
		ariaLabel &&
		!["generic", "presentation", "none"].includes(role)
	) {
		return `[role="${role}"][aria-label="${CSS.escape(ariaLabel)}"]`;
	}

	const parts: string[] = [];
	let current: HTMLElement | null = el;

	while (current && current !== document.body) {
		let selector = current.tagName.toLowerCase();

		if (current.id) {
			selector += `#${CSS.escape(current.id)}`;
			parts.unshift(selector);
			break;
		}

		const testid = current.getAttribute("data-testid");
		if (testid) {
			parts.unshift(`[data-testid="${testid}"]`);
			break;
		}

		const dataNote = current.getAttribute("data-note");
		if (dataNote) {
			parts.unshift(`[data-note="${dataNote}"]`);
			break;
		}

		const parent = current.parentElement;
		if (parent) {
			const currentTagName = current.tagName;
			const siblings = Array.from(parent.children).filter(
				(child) => child.tagName === currentTagName,
			);

			if (siblings.length > 1) {
				const index = siblings.indexOf(current) + 1;
				selector += `:nth-of-type(${index})`;
			}
		}

		parts.unshift(selector);
		current = current.parentElement;
	}

	if (parts.length > 4) {
		return parts.slice(-4).join(" > ");
	}

	return parts.join(" > ");
}

/** Extract Tailwind spacing and sizing classes from an element. */
export function extractTailwindSpacing(el: HTMLElement): string[] {
	const className = el.className;
	if (!className || typeof className !== "string") {return [];}

	const spacingPattern =
		/^-?(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y|space-x|space-y|w|h|min-w|min-h|max-w|max-h|inset|top|right|bottom|left)-/;

	return className
		.split(/\s+/)
		.filter((token) => token && spacingPattern.test(token))
		.slice(0, 6);
}
