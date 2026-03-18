"use client";

import {
	useInspectorActions,
	useInspectorState,
} from "@/components/inspector/state/provider";

export default function DeployTabs() {
	const { deploys, activeDeploy } = useInspectorState();
	const { setActiveDeploy } = useInspectorActions();

	if (deploys.length <= 1) return null;

	return (
		<div
			className="inline-flex rounded-full bg-zinc-100/80 p-[3px]"
			role="tablist"
			aria-label="Deploy versions"
		>
			{deploys.map((deploy) => {
				const isActive = deploy.version === activeDeploy;

				return (
					<button
						key={deploy.id}
						type="button"
						role="tab"
						aria-selected={isActive}
						onClick={() => setActiveDeploy(deploy.version)}
						className={`rounded-full px-2.5 py-[5px] text-[11px] font-medium transition-all duration-200 ${
							isActive
								? "bg-white text-zinc-900 shadow-sm"
								: "text-zinc-400 hover:text-zinc-600"
						}`}
					>
						{deploy.version}
					</button>
				);
			})}
		</div>
	);
}
