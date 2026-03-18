import type { Deploy } from "@/types";

export const deploys: Deploy[] = [
	{
		id: "deploy-1",
		version: "v1",
		label: "v1 · Mar 15",
		timestamp: Date.UTC(2026, 2, 15, 14, 30, 0),
		status: "superseded",
	},
	{
		id: "deploy-2",
		version: "v2",
		label: "v2 · Mar 16",
		timestamp: Date.UTC(2026, 2, 16, 11, 0, 0),
		status: "active",
	},
];

export const DEPLOY_ORDER = ["v1", "v2"] as const;

export function isDeployAtOrBefore(
	deploy: string,
	reference: string,
): boolean {
	return DEPLOY_ORDER.indexOf(deploy as "v1" | "v2") <=
		DEPLOY_ORDER.indexOf(reference as "v1" | "v2");
}

export function getActiveDeploy(): Deploy {
	return deploys[deploys.length - 1];
}
