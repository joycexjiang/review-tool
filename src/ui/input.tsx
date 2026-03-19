"use client";

import { Input as BaseInput } from "@base-ui/react/input";
import { cn } from "@/lib/utils";

function Input({
	className,
	...props
}: React.ComponentPropsWithoutRef<typeof BaseInput>) {
	return (
		<BaseInput
			className={cn(
				"w-full rounded-lg border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-900 placeholder:text-zinc-400",
				"transition-[border-color,box-shadow] duration-150 ease-out",
				"outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 focus:ring-offset-0",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
