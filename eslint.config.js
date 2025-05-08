import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: [
            "dist",
            "node_modules",
            "pb_hooks",
            ".pb_data",
            "src/types/pocketbase-types.ts",
        ],
    },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
            "no-unused-vars": [
                "off",
                // { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/no-non-null-asserted-optional-chain": ["off"],
        },
    }
);
