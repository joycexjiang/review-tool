export type CommentType = "bug" | "suggestion" | "question";
export type Severity = "blocking" | "major" | "minor";
export type DeployVersion = "v1" | "v2";

export interface Reviewer {
	name: string;
}

export interface Deploy {
	id: string;
	version: DeployVersion;
	label: string;
	timestamp: number;
	status: "active" | "superseded";
}

export interface ElementRect {
	x: number;
	y: number;
	width: number;
	height: number;
	top: number;
	right: number;
	bottom: number;
	left: number;
}

export interface ElementInfo {
	tagName: string;
	className: string;
	boundingRect: ElementRect;
	cssSelector: string;
	sourceFile?: string;
	sourceLine?: number;
	sourceColumn?: number;
	componentStack?: string[];
	tailwindClasses?: string[];
	computedStyles?: {
		marginTop: string;
		marginRight: string;
		marginBottom: string;
		marginLeft: string;
		paddingTop: string;
		paddingRight: string;
		paddingBottom: string;
		paddingLeft: string;
	};
}

export interface Note {
	id: string;
	type: CommentType;
	severity: Severity;
	elementInfo: ElementInfo;
	text: string;
	timestamp: number;
	relativeTimeLabel?: string;
	resolved: boolean;
	reviewer: Reviewer;
	deployVersion: DeployVersion;
	area: string;
	fixedInDeploy?: DeployVersion;
}
