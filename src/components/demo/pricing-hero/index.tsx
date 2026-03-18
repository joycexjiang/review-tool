"use client";

export type BillingPeriod = "monthly" | "annual";

interface PricingHeroProps {
	billing: BillingPeriod;
	onBillingChange: (billing: BillingPeriod) => void;
}

export default function PricingHero({
	billing,
	onBillingChange,
}: PricingHeroProps) {
	return (
		<div className="mb-10 text-center">
			<p className="mb-3 text-[13px] font-medium uppercase tracking-widest text-zinc-400">
				Pricing
			</p>
			<h1 className="text-[40px] font-semibold leading-[1.1] tracking-tight text-zinc-950">
				Start building for free.
				<br />
				<span className="text-zinc-400">Pay as you grow.</span>
			</h1>
			<p
				data-note="hero-subtitle"
				className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-zinc-500"
			>
				Every plan includes a 14-day trial. No credit card required.
				Cancel&nbsp;anytime.
			</p>

			<div
				data-note="billing-toggle"
				className="mt-4 inline-flex items-center rounded-full border border-zinc-200 p-0.5"
			>
				<button
					type="button"
					onClick={() => onBillingChange("monthly")}
					className={`rounded-full px-5 py-1.5 text-[13px] font-medium transition-all duration-200 ${
						billing === "monthly"
							? "bg-zinc-950 text-white shadow-sm"
							: "text-zinc-500 hover:text-zinc-800"
					}`}
				>
					Monthly
				</button>
				<button
					type="button"
					onClick={() => onBillingChange("annual")}
					className={`rounded-full px-5 py-1.5 text-[13px] font-medium transition-all duration-200 ${
						billing === "annual"
							? "bg-zinc-950 text-white shadow-sm"
							: "text-zinc-500 hover:text-zinc-800"
					}`}
				>
					Annual
					<span className="ml-1.5 text-[11px] font-semibold text-emerald-600">
						-20%
					</span>
				</button>
			</div>
		</div>
	);
}
