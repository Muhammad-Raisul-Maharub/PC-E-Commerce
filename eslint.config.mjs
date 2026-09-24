import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/**",
      "scripts/**",
      "docs/**",
      "next-env.d.ts",
      "*.config.*",
    ],
  },
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      "react/jsx-no-comment-textnodes": "off",
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
