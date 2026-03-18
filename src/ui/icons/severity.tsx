import type { ComponentProps } from "react";
import type { Severity } from "@/types";
import SeverityBlockingIcon from "@/ui/icons/severity-blocking";
import SeverityMajorIcon from "@/ui/icons/severity-major";
import SeverityMinorIcon from "@/ui/icons/severity-minor";

export default function SeverityIcon({
	severity,
	...props
}: ComponentProps<"svg"> & {
	severity: Severity;
}) {
	if (severity === "minor") {
		return <SeverityMinorIcon {...props} />;
	}

	if (severity === "major") {
		return <SeverityMajorIcon {...props} />;
	}

	return <SeverityBlockingIcon {...props} />;
}
