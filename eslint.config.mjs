import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "warn",
      "react/no-unescaped-entities": "off",
      "prefer-const": "warn"
    }
  },
  {
    // Test scripts and standalone utility runners use global mocking (global as any)
    // which is unavoidable in Node.js test harnesses without type declaration files.
    files: ["src/tests/**/*.ts", "src/utils/runCalculationsTest.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn"
    }
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "coverage/**",
    ],
  },
];

export default eslintConfig;
