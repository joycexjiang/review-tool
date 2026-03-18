import type { Note, Reviewer } from "@/types";

const emptyRect = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	top: 0,
	right: 0,
	bottom: 0,
	left: 0,
	toJSON: () => ({}),
} as DOMRect;

const V1_BASE = Date.UTC(2026, 2, 15, 14, 0, 0);
const V2_BASE = Date.UTC(2026, 2, 16, 11, 0, 0);

const ALEX: Reviewer = { name: "Alex Chen" };
const SAM: Reviewer = { name: "Sam Torres" };
const JORDAN: Reviewer = { name: "Jordan Lee" };

function mins(n: number) {
	return n * 60 * 1000;
}

const mockNotes: Note[] = [
	// ─── DEPLOY v1 — BLOCKING (2) ───────────────────────────

	{
		id: "v1-1",
		type: "bug",
		severity: "blocking",
		elementInfo: {
			tagName: "BUTTON",
			className:
				"group mb-8 flex w-full items-center justify-center py-2.5 text-sm font-medium rounded-md bg-zinc-950 text-white",
			boundingRect: emptyRect,
			cssSelector: "[data-note='pro-cta']",
			sourceFile: "src/components/demo/pricing-card/index.tsx",
		},
		text: "Pro CTA hover state bg-zinc-800 drops below WCAG AA contrast ratio (4.5:1). Needs to stay at bg-zinc-900 or darker.",
		timestamp: V1_BASE,
		reviewer: ALEX,
		deployVersion: "v1",
		area: "Pricing Card",
		resolved: true,
		fixedInDeploy: "v2",
	},
	{
		id: "v1-2",
		type: "bug",
		severity: "blocking",
		elementInfo: {
			tagName: "DIV",
			className: "flex items-center gap-1 rounded-full bg-zinc-100 p-1",
			boundingRect: emptyRect,
			cssSelector: "[data-note='billing-toggle']",
			sourceFile: "src/components/demo/pricing-hero/index.tsx",
		},
		text: "Billing toggle doesn't announce selected state to screen readers. Needs role=\"radiogroup\" with aria-checked on each option.",
		timestamp: V1_BASE + mins(3),
		reviewer: ALEX,
		deployVersion: "v1",
		area: "Billing Toggle",
		resolved: false,
	},

	// ─── DEPLOY v1 — MAJOR (3) ──────────────────────────────

	{
		id: "v1-4",
		type: "bug",
		severity: "major",
		elementInfo: {
			tagName: "DIV",
			className:
				"relative flex flex-col rounded-xl border border-zinc-200 bg-white p-8 shadow-md",
			boundingRect: emptyRect,
			cssSelector: "[data-note='pro-card']",
			sourceFile: "src/components/demo/pricing-card/index.tsx",
		},
		text: "Pro card uses p-8 but Hobby and Enterprise use p-6. Padding should be consistent across all tiers.",
		timestamp: V1_BASE + mins(12),
		reviewer: ALEX,
		deployVersion: "v1",
		area: "Pricing Card",
		resolved: true,
		fixedInDeploy: "v2",
	},
	{
		id: "v1-6",
		type: "suggestion",
		severity: "major",
		elementInfo: {
			tagName: "SPAN",
			className: "font-semibold tracking-tight text-zinc-950 text-4xl",
			boundingRect: emptyRect,
			cssSelector: "[data-note='price-hobby']",
			sourceFile: "src/components/demo/pricing-card/index.tsx",
		},
		text: "Hobby price is text-4xl while Pro and Enterprise are text-5xl. Visual alignment across the row is off. Should all match.",
		timestamp: V1_BASE + mins(20),
		reviewer: ALEX,
		deployVersion: "v1",
		area: "Pricing Card",
		resolved: false,
	},
	{
		id: "v1-9",
		type: "bug",
		severity: "major",
		elementInfo: {
			tagName: "UL",
			className: "flex-1 flex flex-col gap-3",
			boundingRect: emptyRect,
			cssSelector: "[data-note='feature-gap']",
			sourceFile: "src/components/demo/pricing-card/index.tsx",
		},
		text: "Pro feature list uses gap-3 but other cards use gap-4. Looks cramped compared to Hobby and Enterprise.",
		timestamp: V1_BASE + mins(35),
		reviewer: SAM,
		deployVersion: "v1",
		area: "Pricing Card",
		resolved: true,
		fixedInDeploy: "v2",
	},

	// ─── DEPLOY v1 — MINOR (4) ──────────────────────────────

	{
		id: "v1-11",
		type: "suggestion",
		severity: "minor",
		elementInfo: {
			tagName: "SPAN",
			className: "font-semibold tracking-tight text-zinc-950 text-5xl",
			boundingRect: emptyRect,
			cssSelector: "[data-note='price-pro']",
			sourceFile: "src/components/demo/pricing-card/index.tsx",
		},
		text: "Add a smooth transition when price changes between Monthly and Annual. The number swap feels abrupt.",
		timestamp: V1_BASE + mins(45),
		reviewer: SAM,
		deployVersion: "v1",
		area: "Billing Toggle",
		resolved: true,
		fixedInDeploy: "v2",
	},
	{
		id: "v1-12",
		type: "suggestion",
		severity: "minor",
		elementInfo: {
			tagName: "BUTTON",
			className:
				"group mb-8 flex w-full items-center justify-center py-2.5 text-sm font-medium rounded-md bg-zinc-950 text-white",
			boundingRect: emptyRect,
			cssSelector: "[data-note='pro-cta']",
			sourceFile: "src/components/demo/pricing-card/index.tsx",
		},
		text: "Arrow icon should slide right on hover. Small touch but makes buttons feel more interactive.",
		timestamp: V1_BASE + mins(48),
		reviewer: ALEX,
		deployVersion: "v1",
		area: "Pricing Card",
		resolved: false,
	},
	{
		id: "v1-13",
		type: "question",
		severity: "minor",
		elementInfo: {
			tagName: "DIV",
			className: "mb-6 border-t border-zinc-100",
			boundingRect: emptyRect,
			cssSelector: "[data-note='pro-divider']",
			sourceFile: "src/components/demo/pricing-card/index.tsx",
		},
		text: "Is this divider intentionally edge-to-edge? Other patterns in the system use mx-2 for padded dividers.",
		timestamp: V1_BASE + mins(52),
		reviewer: SAM,
		deployVersion: "v1",
		area: "Pricing Card",
		resolved: false,
	},
	{
		id: "v1-14",
		type: "suggestion",
		severity: "minor",
		elementInfo: {
			tagName: "DIV",
			className:
				"relative flex flex-col rounded-xl border border-zinc-200 bg-white p-6",
			boundingRect: emptyRect,
			cssSelector: "[data-note='hobby-card']",
			sourceFile: "src/components/demo/pricing-card/index.tsx",
		},
		text: "Consider adding a subtle shadow on card hover. Helps with depth hierarchy and affordance.",
		timestamp: V1_BASE + mins(55),
		reviewer: ALEX,
		deployVersion: "v1",
		area: "Pricing Card",
		resolved: false,
	},

	// ─── DEPLOY v2 — NEW (2) ────────────────────────────────

	{
		id: "v2-1",
		type: "bug",
		severity: "major",
		elementInfo: {
			tagName: "SPAN",
			className:
				"absolute -top-3 left-6 rounded-full bg-zinc-950 px-3 py-0.5 text-sm font-medium text-white",
			boundingRect: emptyRect,
			cssSelector: "[data-note='popular-badge']",
			sourceFile: "src/components/demo/pricing-card/index.tsx",
		},
		text: "Padding fix on Pro card shifted the \"Most popular\" badge. It's now misaligned — -top-3 needs adjusting to -top-2.5.",
		timestamp: V2_BASE,
		reviewer: SAM,
		deployVersion: "v2",
		area: "Pricing Card",
		resolved: false,
	},
	{
		id: "v2-2",
		type: "suggestion",
		severity: "minor",
		elementInfo: {
			tagName: "SPAN",
			className: "font-semibold tracking-tight text-zinc-950 text-5xl",
			boundingRect: emptyRect,
			cssSelector: "[data-note='price-pro']",
			sourceFile: "src/components/demo/pricing-card/index.tsx",
		},
		text: "The dollar sign should be slightly smaller than the number — consider text-3xl for the \"$\" and keeping the amount at text-5xl.",
		timestamp: V2_BASE + mins(15),
		reviewer: JORDAN,
		deployVersion: "v2",
		area: "Pricing Card",
		resolved: false,
	},
];

export function createMockNotes(): Note[] {
	return mockNotes.map((note) => ({
		...note,
		elementInfo: {
			...note.elementInfo,
			boundingRect: emptyRect,
		},
	}));
}
