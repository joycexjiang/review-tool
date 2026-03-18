"use client";

import { cn } from "@/lib/utils";

export const NUMBER_BADGE_CLASS =
	"flex size-6 items-center justify-center select-none rounded-full text-xs font-semibold text-white shadow-sm ui-review-accent-bg";

export default function NumberBadge({
	children,
	className = "",
	onClick,
}: {
	children: React.ReactNode;
	className?: string;
	onClick?: () => void;
}) {
	const baseClassName = cn(
		NUMBER_BADGE_CLASS,
		onClick ? "cursor-pointer" : "",
		className,
	);

	if (onClick) {
		return (
			<button type="button" className={baseClassName} onClick={onClick}>
				{children}
			</button>
		);
	}

	return <span className={baseClassName}>{children}</span>;
}
