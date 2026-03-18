"use client";

import { useTimeout } from "@/hooks/use-timeout";

export function AnnouncementReset({ onClear }: { onClear: () => void }) {
	useTimeout(onClear, 2000);
	return null;
}
