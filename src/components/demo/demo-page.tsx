"use client";

import { useState } from "react";
import PricingCard, { type Plan } from "./pricing-card";
import PricingHero from "./pricing-hero";

const plans: Plan[] = [
	{
		name: "Hobby",
		description: "For personal projects and experiments.",
		price: 0,
		period: "/mo",
		features: [
			{ text: "1 team member" },
			{ text: "3 projects" },
			{ text: "1 GB storage" },
			{ text: "Community support" },
			{ text: "Basic analytics" },
		],
		cta: "Get started",
	},
	{
		name: "Pro",
		description: "For professional developers and small teams.",
		price: 20,
		period: "/mo per seat",
		popular: true,
		features: [
			{ text: "Up to 10 team members" },
			{ text: "Unlimited projects" },
			{ text: "100 GB storage" },
			{ text: "Priority support" },
			{ text: "Advanced analytics", oversized: true },
			{ text: "Custom domains" },
		],
		cta: "Start free trial",
	},
	{
		name: "Enterprise",
		description: "For organizations with advanced needs.",
		price: 50,
		period: "/mo per seat",
		features: [
			{ text: "Unlimited team members" },
			{ text: "Unlimited projects" },
			{ text: "1 TB storage" },
			{ text: "Dedicated support" },
			{ text: "SSO & SAML" },
			{ text: "Audit logs" },
			{ text: "99.99% SLA" },
		],
		cta: "Contact sales",
	},
];

export default function DemoPage() {
	const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
	const multiplier = billing === "annual" ? 0.8 : 1;

	return (
		<div data-demo-page className="min-h-screen bg-zinc-50 select-none">
			<div
				data-note="hero-section"
				className="mx-auto max-w-[1080px] px-6 pb-24 pt-16"
			>
				<PricingHero billing={billing} onBillingChange={setBilling} />

				<div className="grid grid-cols-1 gap-5 md:grid-cols-3">
					{plans.map((plan) => {
						const price = Math.round(plan.price * multiplier);

						return <PricingCard key={plan.name} plan={plan} price={price} />;
					})}
				</div>
			</div>
		</div>
	);
}
