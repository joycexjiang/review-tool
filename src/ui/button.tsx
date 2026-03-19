import { Button as BaseButton } from "@base-ui/react/button";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const VARIANTS = {
	primary:
		"bg-[#F4F4F4] text-white enabled:hover:bg-zinc-800 enabled:active:bg-zinc-950 disabled:cursor-not-allowed disabled:opacity-40",
	ghost:
		"text-zinc-500 enabled:hover:bg-zinc-100 enabled:hover:text-zinc-700 enabled:active:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40",
	danger:
		"text-red-600 enabled:hover:bg-red-50 enabled:hover:text-red-700 enabled:active:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40",
} satisfies Record<string, string>;

const SIZES = {
	sm: "h-7 px-2 text-xs gap-1",
	md: "h-8 px-3 text-xs gap-1.5",
	icon: "relative h-8 w-8 justify-center rounded-lg before:absolute before:inset-[-2px] before:content-['']",
	"icon-sm":
		"relative h-7 w-7 justify-center rounded-lg before:absolute before:inset-[-4px] before:content-['']",
} satisfies Record<string, string>;

type Variant = keyof typeof VARIANTS;
type Size = keyof typeof SIZES;

interface ButtonProps
	extends React.ComponentPropsWithoutRef<typeof BaseButton> {
	variant?: Variant;
	size?: Size;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ variant = "ghost", size = "md", className, ...props }, ref) => {
		return (
			<BaseButton
				ref={ref}
				className={cn(
					"inline-flex items-center rounded-md transition-[colors,transform] enabled:active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/10 focus-visible:ring-offset-1",
					VARIANTS[variant],
					SIZES[size],
					className,
				)}
				{...props}
			/>
		);
	},
);

Button.displayName = "Button";

export { Button, type ButtonProps, type Variant, type Size };
