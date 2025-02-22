import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize FlatCompat
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Flat config array
export default [
  // Extend Next.js recommended config
  ...compat.extends("next/core-web-vitals"),
  // Custom config block
  {
    files: ["**/*.js", "**/*.ts", "**/*.tsx"], // Apply to all JS/TS files
    languageOptions: {
      ecmaVersion: 2021, // Modern JS
      sourceType: "module", // ESM
      globals: {
        node: true, // Node.js globals (Buffer, process, etc.)
      },
    },
    rules: {
      "no-unused-vars": ["warn"], // Relax this rule
    },
  },
];