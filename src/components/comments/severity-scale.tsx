"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Severity } from "@/types";
import SeverityIcon from "@/ui/icons/severity";

export const SEVERITY_ORDER: Severity[] = ["minor", "major", "blocking"];

export const SEVERITY_LABELS: Record<Severity, string> = {
	minor: "Minor",
	major: "Major",
	blocking: "Blocking",
};

const SEVERITY_META: Record<
	Severity,
	{
		barClass: string;
		labelClass: string;
		centerIndex: number;
	}
> = {
	minor: {
		barClass: "bg-zinc-400",
		labelClass: "text-zinc-600",
		centerIndex: 1,
	},
	major: {
		barClass: "bg-amber-400",
		labelClass: "text-amber-700",
		centerIndex: 4,
	},
	blocking: {
		barClass: "bg-red-500",
		labelClass: "text-red-700",
		centerIndex: 7,
	},
};

const RAIL_BAR_COUNT = 9;
const RAIL_BAR_INDEXES = Array.from(
	{ length: RAIL_BAR_COUNT },
	(_, index) => index,
);

function getRailBarHeight(distance: number, isPreviewing: boolean) {
	if (distance === 0) {return isPreviewing ? 26 : 23;}
	if (distance === 1) {return isPreviewing ? 20 : 17;}
	if (distance === 2) {return isPreviewing ? 15 : 13;}
	if (distance === 3) {return 11;}
	return 9;
}

function getRailBarOpacity(distance: number) {
	if (distance === 0) {return 1;}
	if (distance === 1) {return 0.86;}
	if (distance === 2) {return 0.68;}
	if (distance === 3) {return 0.48;}
	return 0.34;
}

export function SeverityScale({
	value,
	onChange,
	className,
}: {
	value: Severity;
	onChange: (severity: Severity) => void;
	className?: string;
}) {
	const [previewedSeverity, setPreviewedSeverity] = useState<Severity | null>(
		null,
	);
	const controlId = useId();
	const radioName = `${controlId}-severity`;

	const activeSeverity = previewedSeverity ?? value;
	const activeMeta = SEVERITY_META[activeSeverity];

	const bars = useMemo(
		() =>
			RAIL_BAR_INDEXES.map((index) => {
				const distance = Math.abs(index - activeMeta.centerIndex);
				return {
					index,
					height: getRailBarHeight(distance, previewedSeverity !== null),
					opacity: getRailBarOpacity(distance),
					isActiveNeighborhood: distance <= 2,
				};
			}),
		[activeMeta.centerIndex, previewedSeverity],
	);

	return (
		<div className={cn("space-y-2.5", className)}>
			<div className="flex items-center justify-between gap-3">
				<div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
					Merge priority
				</div>
				<div
					className={cn(
						"text-[11px] font-medium transition-colors duration-150",
						activeMeta.labelClass,
					)}
				>
					{SEVERITY_LABELS[activeSeverity]}
				</div>
			</div>

			<fieldset
				aria-labelledby={`${controlId}-label`}
				className="relative rounded-[18px] border border-zinc-200 bg-white/90 px-2 py-2 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]"
				onMouseLeave={() => setPreviewedSeverity(null)}
			>
				<legend id={`${controlId}-label`} className="sr-only">
					Comment severity
				</legend>

				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-4 top-2 flex h-8 items-end justify-between gap-1"
				>
					{bars.map((bar) => (
						<span
							key={bar.index}
							className={cn(
								"w-[4px] rounded-full transition-[height,opacity,background-color] duration-200 ease-out",
								bar.isActiveNeighborhood
									? activeMeta.barClass
									: "bg-zinc-300/85",
							)}
							style={{
								height: `${bar.height}px`,
								opacity: bar.opacity,
							}}
						/>
					))}
				</div>

				<div className="grid grid-cols-3 gap-1">
					{SEVERITY_ORDER.map((severity) => {
						const checked = value === severity;
						const isPreviewed = activeSeverity === severity;
						const meta = SEVERITY_META[severity];

						return (
							<label
								key={severity}
								onMouseEnter={() => setPreviewedSeverity(severity)}
								className={cn(
									"relative flex min-h-14 cursor-pointer items-end justify-center rounded-[14px] px-2 pb-1.5 pt-8 transition-[background-color,color,transform] duration-150",
									checked || isPreviewed ? "bg-zinc-50" : "",
								)}
							>
								<input
									type="radio"
									name={radioName}
									value={severity}
									checked={checked}
									onChange={() => onChange(severity)}
									onFocus={() => setPreviewedSeverity(severity)}
									onBlur={() => setPreviewedSeverity(null)}
									className="peer sr-only"
								/>
								<span
									className={cn(
										"text-[11px] font-medium transition-colors duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-zinc-900/10 peer-focus-visible:ring-offset-1",
										checked || isPreviewed ? meta.labelClass : "text-zinc-400",
									)}
								>
									{SEVERITY_LABELS[severity]}
								</span>
							</label>
						);
					})}
				</div>

				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-4 top-[35px] h-px bg-linear-to-r from-transparent via-zinc-200 to-transparent"
				/>
			</fieldset>
		</div>
	);
}

export function SeverityTicks({
	severity,
	className,
}: {
	severity: Severity;
	className?: string;
}) {
	return (
		<SeverityIcon
			severity={severity}
			className={cn("size-5 text-zinc-600", className)}
		/>
	);
}
