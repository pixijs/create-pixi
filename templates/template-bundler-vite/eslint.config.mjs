import js from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";

export default tseslint.config(
    { ignores: ["dist"] },
    {
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            eslintPluginPrettierRecommended,
        ],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },
        rules: {},
    },
);
