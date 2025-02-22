import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintConfigPrettier from "eslint-config-prettier";

// Convert the file URL to a file path and get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize FlatCompat with the base directory
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Define the ESLint configuration
export default [
  // Extend Next.js's default ESLint configuration
  ...compat.extends("next/core-web-vitals"),

  // Add other configurations or plugins
  ...compat.extends("eslint:recommended"), // ESLint's recommended rules
  ...compat.extends("plugin:react/recommended"), // React plugin (if using React)
  eslintConfigPrettier, // Prettier compatibility (if using Prettier)

  // Custom rules
  {
    rules: {
      // Add custom rules here
      "no-unused-vars": "warn", // Warn about unused variables
      "no-console": "warn", // Warn about console.log statements
      "react/prop-types": "off", // Disable React prop-types (if not using TypeScript)
    },
    parserOptions: {
      ecmaVersion: "latest", // Use the latest ECMAScript version
      sourceType: "module", // Use ES modules
      ecmaFeatures: {
        jsx: true, // Enable JSX support (if using React)
      },
    },
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
  },
];