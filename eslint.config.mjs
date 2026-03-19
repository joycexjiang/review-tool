import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	{
		files: ["src/**/*.{ts,tsx}"],
		rules: {
			curly: ["error", "all"],
			"no-restricted-imports": [
				"error",
				{
					paths: [
						{
							name: "react",
							importNames: ["useEffect"],
							message:
								"Avoid raw useEffect in app code. Prefer render-time derivation, event handlers, useSyncExternalStore, or a focused hook like useEventListener/useTimeout/useUnmount.",
						},
					],
				},
			],
			"no-restricted-syntax": [
				"error",
				{
					selector: "ImportExpression",
					message:
						"Use standard import statements at the top of the file. Avoid dynamic imports in app code.",
				},
			],
			"@typescript-eslint/no-explicit-any": "error",
			"@typescript-eslint/no-non-null-assertion": "error",
		},
	},
	{
		files: [
			"src/hooks/use-event-listener.ts",
			"src/hooks/use-resolved-source.ts",
			"src/hooks/use-timeout.ts",
			"src/hooks/use-unmount.ts",
			"src/components/inspector/element-popover/use-element-popover.ts",
			"src/components/comments/number-badges/use-number-badges.ts",
		],
		rules: {
			"no-restricted-imports": "off",
		},
	},
	// Override default ignores of eslint-config-next.
	globalIgnores([
		// Default ignores of eslint-config-next:
		".next/**",
		"out/**",
		"build/**",
		"next-env.d.ts",
	]),
]);

export default eslintConfig;
