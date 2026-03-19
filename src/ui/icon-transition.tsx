"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

interface IconTransitionProps {
	/** Unique key that triggers the transition when it changes. */
	activeKey: string;
	children: ReactNode;
}

const transition = { type: "spring", duration: 0.3, bounce: 0 } as const;

export function IconTransition({ activeKey, children }: IconTransitionProps) {
	return (
		<AnimatePresence mode="popLayout" initial={false}>
			<motion.div
				key={activeKey}
				initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
				animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
				exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
				transition={transition}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
}
