import { FlatCompat } from "@eslint/eslintrc";
import importPlugin from "eslint-plugin-import";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      import: importPlugin,
    },
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*"],
              message:
                "Relative imports outside the current directory are not allowed. Use absolute imports instead.",
            },
          ],
        },
      ],
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./features/*/*",
              from: "./features/!(same)/**",
              message:
                "Cross-feature imports are not allowed. Features must be completely isolated from each other.",
            },
            {
              target: "./app/**/*",
              from: "./features/*/!(index).{js,jsx,ts,tsx}",
              message: "App can only import from feature index files.",
            },
          ],
        },
      ],
      "import/no-absolute-path": "error",
      "import/first": "error",
    },
  },
  {
    files: ["features/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/!(same)/**"],
              message:
                "Imports from other features are not allowed. Features must be isolated from each other.",
            },
            {
              group: ["features/!(same)/**"],
              message:
                "Imports from other features are not allowed. Features must be isolated from each other.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["app/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["features/*/!(index)"],
              message:
                "App directory can only import from feature index files (public API).",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
