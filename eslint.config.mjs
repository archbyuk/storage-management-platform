import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",                             // next js optimizaation (essential)
    "next/typescript",                                  // typescript support (essential)): any usage restrictions, @typescript-eslint/no-explicit-any
    "plugin:@typescript-eslint/recommended",            // typescript linting (essential): @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    "plugin:prettier/recommended",                      // set prettier: formatting, ESLint does not warn about parts where prettier is applied.
    "plugin:tailwindcss/recommended",                   // tailwind css linting: [Layout] → [Flex/Grid] → [Sizing] → [Spacing] → [Border] → [Typography] → [Effects] → [State] → [Responsive]
    "plugin:react-hooks/recommended"                    // react hooks linting: useEffect, useMemo, useCallback, useRef
  ),
];

export default eslintConfig; 

// what is eslint config:
/*
  An ESlint configuration file that declares code inspection rules and plugins to be applied across the project in a flat configuration format.
  Flat configuration is new way to configure ESlint, which is more flexible and allows for better organization of rules and plugins.
*/