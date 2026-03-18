export type CommentType = "bug" | "suggestion" | "question";
export type Severity = "blocking" | "major" | "minor";

export interface Reviewer {
	name: string;
}

export interface Deploy {
	id: string;
	version: string;
	label: string;
	timestamp: number;
	status: "active" | "superseded";
}

export interface ElementInfo {
	tagName: string;
	className: string;
	boundingRect: DOMRect;
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
	deployVersion: string;
	area: string;
	fixedInDeploy?: string;
}
