"use client";

import ToolbarContent from "./components/toolbar-content";
import ToolbarShell from "./components/toolbar-shell";
import { useToolbarController } from "./hooks/use-toolbar-controller";
import { ToolbarProvider } from "./toolbar-context";

export default function Toolbar() {
	const { actions, data, layout } = useToolbarController();

	return (
		<ToolbarProvider actions={actions} data={data} layout={layout}>
			<ToolbarShell>
				<ToolbarContent />
			</ToolbarShell>
		</ToolbarProvider>
	);
}
