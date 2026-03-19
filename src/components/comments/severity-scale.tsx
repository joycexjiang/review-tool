import type { Severity } from "@/types";

export const SEVERITY_ORDER: Severity[] = ["minor", "major", "blocking"];

export const SEVERITY_LABELS: Record<Severity, string> = {
	minor: "Minor",
	major: "Major",
	blocking: "Blocking",
};
