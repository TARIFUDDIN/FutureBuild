import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Convert the file URL to a file path and get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize FlatCompat with the base directory
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {}, // Required parameter
});

// Define the ESLint configuration in flat config format
export default [
  // Extend Next.js's default ESLint configuration
  ...compat.extends("next/core-web-vitals"),
  ...compat.extends("next/typescript"),
  
  // Custom rules in flat config format
  {
    rules: {
      // Deployment-friendly rules
      "no-unused-vars": "warn",
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "react/prop-types": "off",
    },
    // Remove parserOptions - not needed in flat config
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];