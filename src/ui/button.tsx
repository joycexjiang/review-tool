import { Button as BaseButton } from "@base-ui/react/button";
import { forwardRef } from "react";

const VARIANTS = {
	primary:
		"bg-classes text-white hover:bg-zinc-800 active:bg-zinc-950 disabled:opacity-40 disabled:cursor-not-allowed",
	ghost:
		"text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 active:bg-zinc-200",
	danger: "text-red-600 hover:bg-red-50 hover:text-red-700 active:bg-red-100",
} as const;

const SIZES = {
	sm: "h-7 px-2 text-xs gap-1",
	md: "h-8 px-3 text-sm gap-1.5",
	icon: "h-8 w-8 justify-center rounded-full",
	"icon-sm": "h-7 w-7 justify-center",
} as const;

type Variant = keyof typeof VARIANTS;
type Size = keyof typeof SIZES;

interface ButtonProps
	extends React.ComponentPropsWithoutRef<typeof BaseButton> {
	variant?: Variant;
	size?: Size;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ variant = "ghost", size = "md", className = "", ...props }, ref) => {
		return (
			<BaseButton
				ref={ref}
				className={`inline-flex items-center rounded-md font-medium transition-colors ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
				{...props}
			/>
		);
	},
);

Button.displayName = "Button";

export { Button, type ButtonProps, type Variant, type Size };
