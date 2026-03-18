"use client";

import { useEffect, useEffectEvent } from "react";

type EventTargetResolver =
	| EventTarget
	| null
	| undefined
	| (() => EventTarget | null | undefined);

function resolveTarget(target: EventTargetResolver) {
	return typeof target === "function" ? target() : target;
}

export function useEventListener(
	target: EventTargetResolver,
	type: string,
	listener: (event: Event) => void,
	options?: boolean | AddEventListenerOptions,
	enabled = true,
) {
	const onEvent = useEffectEvent(listener);

	useEffect(() => {
		if (!enabled) {return;}

		const eventTarget = resolveTarget(target);
		if (!eventTarget) {return;}

		const handler: EventListener = (event) => {
			onEvent(event);
		};

		eventTarget.addEventListener(type, handler, options);
		return () => eventTarget.removeEventListener(type, handler, options);
	}, [enabled, options, target, type]);
}
