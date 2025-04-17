import js from "@eslint/js";
import prettier from "eslint-plugin-prettier/recommended";

export default [
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, prettier],
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {},
  },
];
