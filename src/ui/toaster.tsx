"use client";

import type { ComponentProps } from "react";
import { Toaster as SonnerToaster, toast } from "sonner";

function Toaster(props: ComponentProps<typeof SonnerToaster>) {
	return (
		<SonnerToaster
			position="top-center"
			gap={8}
			toastOptions={{
				classNames: {
					toast:
						"!rounded-xl !border !border-zinc-950/[0.08] !bg-white !text-zinc-900 !select-none !py-2 !px-4 !shadow-[0_1px_2px_rgba(24,24,27,0.06),0_4px_8px_rgba(24,24,27,0.04),0_12px_24px_rgba(24,24,27,0.03)]",
					title: "!text-sm !font-normal !text-zinc-900",
					description: "!text-sm !text-zinc-500",
					actionButton:
						"toast-action-btn !rounded-lg !bg-zinc-900 !text-white !transition-transform !duration-150 !ease-out active:!scale-[0.97]",
					cancelButton:
						"toast-cancel-btn !rounded-lg !bg-zinc-100 !text-zinc-700 !transition-transform !duration-150 !ease-out active:!scale-[0.97]",
				},
			}}
			{...props}
		/>
	);
}

export { Toaster, toast };
