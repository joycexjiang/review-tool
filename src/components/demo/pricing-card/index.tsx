"use client";

import { cn } from "@/lib/utils";
import ArrowRightIcon from "@/ui/icons/arrow-right";
import CheckIcon from "@/ui/icons/check";

export interface PlanFeature {
	text: string;
	oversized?: boolean;
}

export interface Plan {
	name: string;
	description: string;
	price: number;
	period: string;
	popular?: boolean;
	features: PlanFeature[];
	cta: string;
}

interface PricingCardProps {
	plan: Plan;
	price: number;
}

function getCardNoteAttr(name: string): string | undefined {
	switch (name) {
		case "Hobby":
			return "hobby-card";
		case "Pro":
			return "pro-card";
		case "Enterprise":
			return "enterprise-card";
		default:
			return undefined;
	}
}

function getCtaNoteAttr(name: string): string | undefined {
	switch (name) {
		case "Hobby":
			return "hobby-cta";
		case "Pro":
			return "pro-cta";
		case "Enterprise":
			return "enterprise-cta";
		default:
			return undefined;
	}
}

function getPriceNoteAttr(name: string): string | undefined {
	switch (name) {
		case "Hobby":
			return "price-hobby";
		case "Pro":
			return "price-pro";
		default:
			return undefined;
	}
}

function getFeaturesNoteAttr(name: string): string | undefined {
	switch (name) {
		case "Hobby":
			return "hobby-features";
		case "Pro":
			return "feature-gap";
		case "Enterprise":
			return "enterprise-features";
		default:
			return undefined;
	}
}

export default function PricingCard({ plan, price }: PricingCardProps) {
	const isPopular = plan.popular;

	return (
		<div
			data-note={getCardNoteAttr(plan.name)}
			className={`relative flex flex-col rounded-xl border bg-white transition-shadow duration-200 ${
				isPopular ? "border-zinc-200 p-8 shadow-md" : "border-zinc-200 p-6"
			}`}
		>
			{isPopular ? (
				<span
					data-note="popular-badge"
					className="absolute -top-3 left-6 rounded-full bg-zinc-950 px-3 py-0.5 text-[11px] font-medium text-green-500"
				>
					Most popular
				</span>
			) : null}

			<div className="mb-6">
				<h3 className="text-[15px] font-semibold text-zinc-950">{plan.name}</h3>
				<p className="mt-1 text-[13px] leading-relaxed text-zinc-500">
					{plan.description}
				</p>
			</div>

			<div className="mb-8">
				<span
					data-note={getPriceNoteAttr(plan.name)}
					className={`font-semibold tracking-tight text-zinc-950 ${
						plan.name === "Hobby" ? "text-4xl" : "text-5xl"
					}`}
				>
					${price}
				</span>
				<span
					data-note={
						plan.name === "Enterprise" ? "price-enterprise" : undefined
					}
					className="ml-1 text-[13px] text-zinc-400"
				>
					{plan.period}
				</span>
			</div>

			<button
				type="button"
				data-note={getCtaNoteAttr(plan.name)}
				className={`group mb-8 flex w-full items-center justify-center py-2.5 text-[13px] font-medium transition-all duration-150 ${
					isPopular
						? "rounded-md bg-zinc-950 text-white hover:bg-zinc-800 active:scale-[0.98]"
						: plan.name === "Enterprise"
							? "rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.98]"
							: "rounded-md border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.98]"
				}`}
			>
				{plan.cta}
				<ArrowRightIcon className="size-4" />
			</button>

			<div
				data-note={plan.name === "Pro" ? "pro-divider" : undefined}
				className="mb-6 border-t border-zinc-100"
			/>

			<ul
				data-note={getFeaturesNoteAttr(plan.name)}
				className={`flex-1 ${
					plan.name === "Pro" ? "flex flex-col gap-3" : "flex flex-col gap-4"
				}`}
			>
				{plan.features.map((feature) => (
					<li
						key={feature.text}
						className="flex items-start gap-3 text-[13px] leading-snug text-zinc-600"
					>
						<CheckIcon
							data-note={feature.oversized ? "check-20" : undefined}
							className={cn("size-4", feature.oversized ? "size-5" : "size-4")}
						/>
						{feature.text}
					</li>
				))}
			</ul>
		</div>
	);
}
