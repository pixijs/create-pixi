import eslint from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist", "**/node_modules/**", "**/build/**", "**/.docusaurus/**"],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  importPlugin.flatConfigs.recommended,
  {
    files: ["**/*"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, ...globals.es2023, ...globals.node },
    },
    rules: {
      "prettier/prettier": ["error", {}, { usePrettierrc: false }],
      "import/no-unresolved": "off",
      "import/order": [
        "error",
        {
          alphabetize: { caseInsensitive: true, order: "asc" },
          "newlines-between": "always",
        },
      ],
      "import/first": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { disallowTypeAnnotations: false },
      ],
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "import/no-duplicates": ["error"],
      "import/default": ["off"],
    },
  },
);
