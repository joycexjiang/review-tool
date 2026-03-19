"use client";

import type { Note } from "@/types";

export interface BadgeEntry {
	id: string;
	index: number;
	note: Note;
	targetEl: HTMLElement;
}

export interface BadgePosition {
	top: number;
	left: number;
}
