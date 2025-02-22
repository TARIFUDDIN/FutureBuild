import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Extend Next.js recommended config and add custom rules/settings
const eslintConfig = [
  ...compat.extends("next/core-web-vitals"), // Next.js recommended rules
  {
    env: {
      node: true, // Enable Node.js globals (e.g., process, Buffer)
      es2021: true, // Modern JS features
    },
    rules: {
      // Disable or adjust rules causing serialization issues
      "no-serialize": "off", // If this rule exists in your ESLint version
      "no-unused-vars": ["warn"], // Example: relax some rules if needed
    },
    parserOptions: {
      ecmaVersion: 2021, // Match env.es2021
      sourceType: "module", // ESM support
    },
  },
];

export default eslintConfig;