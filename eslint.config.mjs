import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // These hooks intentionally follow the classic loading/error/data
    // fetch-on-mount pattern (setIsLoading(true) at the top of the effect).
    // react-hooks/set-state-in-effect wants that replaced with a data-fetching
    // library (React Query/SWR); adding one is out of scope for this project,
    // so it's disabled only where that pattern is used.
    files: [
      "hooks/**/*.ts",
      "app/dashboard/foods/*/page.tsx",
      "app/dashboard/orders/*/page.tsx",
    ],
    rules: {
      "react-hooks/set-state-in-effect": "off",
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
