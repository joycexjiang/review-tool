"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "@/lib/utils";

function Tabs(
	props: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>,
) {
	return <TabsPrimitive.Root data-slot="tabs" {...props} />;
}

function TabsList({
	className,
	...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
	return (
		<TabsPrimitive.List
			data-slot="tabs-list"
			className={cn(
				"relative z-0 inline-flex gap-1 rounded-md bg-transparent p-1",
				className,
			)}
			{...props}
		/>
	);
}

function TabsTrigger({
	className,
	...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Tab>) {
	return (
		<TabsPrimitive.Tab
			data-slot="tabs-trigger"
			className={cn(
				"relative z-10 flex h-7 items-center justify-center rounded-md border-0 px-3 py-1 text-sm text-zinc-500 outline-hidden transition-colors hover:bg-[#ECECEC] hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-blue-400 data-active:text-zinc-900 data-active:hover:text-zinc-900",
				className,
			)}
			{...props}
		/>
	);
}

function TabsIndicator({
	className,
	...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Indicator>) {
	return (
		<TabsPrimitive.Indicator
			data-slot="tabs-indicator"
			className={cn(
				"absolute left-0 top-1/2 z-0 h-7 w-(--active-tab-width) translate-x-(--active-tab-left) -translate-y-1/2 rounded-md bg-[#ECECEC] transition-[translate,width] duration-200 ease-[cubic-bezier(0.77,0,0.175,1)]",
				className,
			)}
			{...props}
		/>
	);
}

function TabsContent({
	className,
	...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Panel>) {
	return (
		<TabsPrimitive.Panel
			data-slot="tabs-content"
			className={cn(className)}
			{...props}
		/>
	);
}

export { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger };
