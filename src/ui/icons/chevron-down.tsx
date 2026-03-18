import { cn } from "@/lib/utils";

export default function ChevronDownIcon({ className }: { className?: string }) {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			className={cn("shrink-0", className)}
			aria-label="Chevron down"
			role="img"
		>
			<path
				d="M17.6933 9.29288C18.0838 8.90255 18.7169 8.90242 19.1073 9.29288C19.4974 9.68337 19.4975 10.3165 19.1073 10.7069L12.7069 17.1073C12.3165 17.4975 11.6834 17.4974 11.2929 17.1073L4.89249 10.7069C4.50198 10.3164 4.50199 9.68341 4.89249 9.29288C5.28301 8.90237 5.91603 8.90238 6.30655 9.29288L11.8231 14.8095C11.9208 14.9071 12.0791 14.9071 12.1767 14.8095L17.6933 9.29288Z"
				fill="currentColor"
			/>
		</svg>
	);
}
