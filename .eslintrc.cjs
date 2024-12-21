/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  rules: {
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/await-thenable": "off",
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/prefer-optional-chain":"warn",
    "@typescript-eslint/no-unsafe-call":"warn",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
    "react-hooks/exhaustive-deps":"off",
    "@typescript-eslint/consistent-type-imports":"off",
    "@typescript-eslint/no-explicit-any":"off",
    "@typescript-eslint/no-unsafe-argument":"off"
  },
};
module.exports = config;
