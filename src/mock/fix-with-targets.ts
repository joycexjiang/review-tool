export type FixWithTargetId = "cursor" | "v0" | "conductor" | "replit";

export interface FixWithTarget {
	id: FixWithTargetId;
	label: string;
	hrefPrefix?: string;
	opensInNewTab?: boolean;
	status: "ready" | "planned";
}

export const fixWithTargets: FixWithTarget[] = [
	{
		id: "cursor",
		label: "Cursor",
		hrefPrefix: "cursor://anysphere.cursor-deeplink/prompt?text=",
		status: "ready",
	},
	{
		id: "v0",
		label: "v0",
		hrefPrefix: "https://v0.app/chat?q=",
		opensInNewTab: true,
		status: "ready",
	},
	{
		id: "conductor",
		label: "Conductor",
		status: "planned",
	},
	{
		id: "replit",
		label: "Replit",
		status: "planned",
	},
];
