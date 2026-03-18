"use client";

import { useEffect, useEffectEvent } from "react";

/**
 * Cleanup-only escape hatch for external resources owned by this component.
 * Do not use this for derived state or action relays.
 */
export function useUnmount(cleanup: () => void) {
	const onUnmount = useEffectEvent(cleanup);

	useEffect(() => {
		return () => {
			onUnmount();
		};
	}, []);
}
