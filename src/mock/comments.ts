import type { ElementRect, Note, Reviewer } from "@/types";

const emptyRect: ElementRect = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	top: 0,
	right: 0,
	bottom: 0,
	left: 0,
};

const V1_BASE = Date.UTC(2026, 2, 15, 14, 0, 0);
const V2_BASE = Date.UTC(2026, 2, 16, 11, 0, 0);

const ALEX: Reviewer = { name: "Alex Chen" };
const SAM: Reviewer = { name: "Sam Torres" };

function mins(n: number) {
	return n * 60 * 1000;
}

const mockNotes: Note[] = [
	// ─── DEPLOY v1 (all fixed in v2) ────────────────────────

	{
		id: "v1-1",
		type: "bug",
		severity: "blocking",
		elementInfo: {
			tagName: "DIV",
			className: "flex items-center gap-1 rounded-full bg-zinc-100 p-1",
			boundingRect: emptyRect,
			cssSelector: "[data-note='billing-toggle']",
			sourceFile: "src/components/demo/pricing-hero/index.tsx",
		},
		text: 'Billing toggle doesn\'t announce selected state to screen readers. Needs role="radiogroup" with aria-checked on each option.',
		timestamp: V1_BASE,
		reviewer: ALEX,
		deployVersion: "v1",
		area: "Billing Toggle",
		resolved: false,
		fixedInDeploy: "v2",
	},
	{
		id: "v1-2",
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
		resolved: false,
		fixedInDeploy: "v2",
	},
	{
		id: "v1-3",
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
		resolved: false,
		fixedInDeploy: "v2",
	},

	// ─── DEPLOY v2 (new issues) ─────────────────────────────

	{
		id: "v2-1",
		type: "bug",
		severity: "blocking",
		elementInfo: {
			tagName: "SPAN",
			className:
				"absolute -top-3 left-6 rounded-full bg-zinc-950 px-3 py-0.5 text-[11px] font-medium text-green-500",
			boundingRect: emptyRect,
			cssSelector: "[data-note='popular-badge']",
			sourceFile: "src/components/demo/pricing-card/index.tsx",
		},
		text: '"Most popular" badge uses text-green-500 on bg-zinc-950. Contrast ratio is ~3.2:1 — fails WCAG AA. Needs a lighter green or white text.',
		timestamp: V2_BASE,
		reviewer: SAM,
		deployVersion: "v2",
		area: "Pricing Card",
		resolved: false,
	},
	{
		id: "v2-2",
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
		timestamp: V2_BASE + mins(8),
		reviewer: ALEX,
		deployVersion: "v2",
		area: "Pricing Card",
		resolved: false,
	},
	{
		id: "v2-3",
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
		timestamp: V2_BASE + mins(15),
		reviewer: ALEX,
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
