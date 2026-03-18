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
				"w-full rounded-md border border-primary bg-classes px-4 py-3 text-sm text-white placeholder:text-zinc-400",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
