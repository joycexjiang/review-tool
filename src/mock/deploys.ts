import type { Deploy, DeployVersion } from "@/types";

export const deploys: Deploy[] = [
	{
		id: "deploy-2",
		version: "v2",
		label: "v2 · Mar 16",
		timestamp: Date.UTC(2026, 2, 16, 11, 0, 0),
		status: "active",
	},
	{
		id: "deploy-1",
		version: "v1",
		label: "v1 · Mar 15",
		timestamp: Date.UTC(2026, 2, 15, 14, 30, 0),
		status: "superseded",
	},
];

export const DEPLOY_ORDER: readonly DeployVersion[] = ["v1", "v2"];

const DEPLOY_RANK: Record<DeployVersion, number> = {
	v1: 0,
	v2: 1,
};

export function isDeployAtOrBefore(
	deploy: DeployVersion,
	reference: DeployVersion,
): boolean {
	return DEPLOY_RANK[deploy] <= DEPLOY_RANK[reference];
}

