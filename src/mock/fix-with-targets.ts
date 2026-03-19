export type FixWithTargetId = "cursor" | "v0" | "conductor" | "replit";

export interface FixWithTarget {
	id: FixWithTargetId;
	label: string;
	hrefPrefix?: string;
	opensInNewTab?: boolean;
}

export const fixWithTargets: FixWithTarget[] = [
	{
		id: "cursor",
		label: "Cursor",
		hrefPrefix: "cursor://anysphere.cursor-deeplink/prompt?text=",
	},
	{
		id: "v0",
		label: "v0",
		hrefPrefix: "https://v0.app/chat?q=",
		opensInNewTab: true,
	},
	{
		id: "conductor",
		label: "Conductor",
	},
	{
		id: "replit",
		label: "Replit",
	},
];
