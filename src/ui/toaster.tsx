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
						"!rounded-xl !border !border-zinc-200 !bg-white !text-zinc-900 !select-none !shadow-md !py-2 !px-4",
					title: "!text-sm !font-normal !text-zinc-900",
					description: "!text-sm !text-zinc-500",
					actionButton:
						"!rounded-xl !bg-zinc-900 !text-white hover:!bg-zinc-800",
					cancelButton:
						"!rounded-xl !bg-zinc-100 !text-zinc-700 hover:!bg-zinc-200",
				},
			}}
			{...props}
		/>
	);
}

export { Toaster, toast };
