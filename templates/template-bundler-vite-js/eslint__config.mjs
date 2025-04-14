import js from "@eslint/js";

export default [
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended],
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {},
  },
];
