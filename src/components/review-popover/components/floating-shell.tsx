"use client";

import { useReviewPopoverLayoutContext } from "../review-popover-context";

export default function FloatingShell({
	children,
}: {
	children: React.ReactNode;
}) {
	const {
		elementRef,
		floatingPositionStyle,
		floatingTop,
		floatingTransition,
		floatingWidth,
		isDragging,
		onPointerCancel,
		onPointerDown,
		onPointerMove,
		onPointerUp,
		panelOpen,
	} = useReviewPopoverLayoutContext();

	return (
		<div
			ref={elementRef}
			data-review-popover
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
			onPointerCancel={onPointerCancel}
			className={`fixed z-10002 ${panelOpen ? "" : "pointer-events-none"}`}
			style={{
				...floatingPositionStyle,
				top: floatingTop,
				width: floatingWidth,
				transition: isDragging ? "none" : floatingTransition,
			}}
		>
			{children}
		</div>
	);
}
