"use client";

import { useCallback } from "react";
import {
	type FixWithTarget,
	type FixWithTargetId,
	fixWithTargets,
} from "@/mock/fix-with-targets";
import { Button } from "@/ui/button";
import { DropdownItem, DropdownMenu } from "@/ui/dropdown-menu";
import ChevronDownIcon from "@/ui/icons/chevron-down";
import ConductorIcon from "@/ui/icons/conductor";
import CursorIcon from "@/ui/icons/cursor";
import ReplitIcon from "@/ui/icons/replit";
import V0Icon from "@/ui/icons/v0";
import { toast } from "@/ui/toaster";

const FIX_WITH_ICONS: Record<FixWithTargetId, React.ComponentType> = {
	conductor: ConductorIcon,
	cursor: CursorIcon,
	replit: ReplitIcon,
	v0: V0Icon,
};

interface FixWithMenuProps {
	prompt: string;
}

export default function FixWithMenu({ prompt }: FixWithMenuProps) {
	const promptValue = prompt.trim();
	const hasMeaningfulPrompt = promptValue.length > 0;

	const handleSelectTarget = useCallback(
		(targetId: FixWithTargetId) => {
			if (!hasMeaningfulPrompt) {
				return;
			}

			const target = fixWithTargets.find((item) => item.id === targetId);
			if (!target) {
				return;
			}

			if (!target.hrefPrefix) {
				toast.message(
					`${target.label} handoff is shown in the demo, but not wired yet.`,
				);
				return;
			}

			const url = `${target.hrefPrefix}${encodeURIComponent(promptValue)}`;
			window.open(url, target.opensInNewTab ? "_blank" : undefined);
			toast.success(`Opened in ${target.label}`);
		},
		[hasMeaningfulPrompt, promptValue],
	);

	return (
		<DropdownMenu
			side="bottom"
			align="end"
			className="min-w-44 text-zinc-500"
			trigger={
				<Button
					variant="ghost"
					disabled={!hasMeaningfulPrompt}
					className="rounded-lg px-3"
				>
					Fix with
					<ChevronDownIcon className="size-2.5" />
				</Button>
			}
		>
			{fixWithTargets.map((target) => (
				<DropdownItem
					key={target.id}
					onSelect={() => handleSelectTarget(target.id)}
					className="justify-between"
				>
					<span className="flex min-w-0 items-center gap-2">
						<FixWithIcon target={target} />
						<span className="block max-w-full truncate select-none">
							{target.label}
						</span>
					</span>
				</DropdownItem>
			))}
		</DropdownMenu>
	);
}

function FixWithIcon({ target }: { target: FixWithTarget }) {
	const Icon = FIX_WITH_ICONS[target.id];

	return (
		<span className="text-zinc-500 [&_svg]:size-4 [&_svg]:shrink-0">
			<Icon />
		</span>
	);
}
