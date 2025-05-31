import type { Config } from 'tailwindcss';

const config: Config = {
    content: [                                                              // which files to search for tailwind classes
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],                                                                      
    theme: {                                                                       
        extend: {                                                           // setting to extend the default tailwind theme
            colors: {
                brand: {                                                    // set brand color
                    DEFAULT: "#FA7275",                                     /* → Register custom color: Use like bg-brand, text-red, bg-light-200 */
                    100: "#EA6365",
                },
                red: "#FF7474",
                error: "#B80000",
                green: "#3DD9B3",
                orange: "#F9AB72",
                blue: "#56BBFF",
                pink: "#EEA8FD",
                light: {
                    100: "#333F4E",
                    200: "#A3B2C7",
                    300: "#F2F5F9",
                    400: "#F2F4F8",
                },
                dark: {
                    100: "#04050C",
                    200: "#131524"
                }
            },
            fontFamily: {                                                   // set font family
                poppins : [                                                 /* → Resister a custom font (ususally a variable declared as @font-face or Google Fonts) with a class name*/
                    "var(--font-poppins)"
                ]
            },
            boxShadow: {                                                    // custome shadow setting:
                "drop-1": "0px 10px 30px 0px rgba(66, 71, 97, 0.1)",        // drop-1: default shadow
                "drop-2": "0px 8px 30px 0 rgba(65, 89, 214, 0.3)",          // drop-2: accent shadow     
                "drop-3": "0px 8px 30px 0 rgba(65, 89, 214, 0.1)",          // drop-3: accent shadow
            },
            borderRadius: {                                                 // set border radius
                lg: "var(--radius)",                                        /* → tailwind default rounded-lg classes are mapped to values set here */
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {                                                    // custom animation setting:
                "caret-blink": {                                            /* → custom animation available with tailwind utility animate-caret-blink */
                    "0%, 70%, 100%" : { opacity: "1" },
                    "20%, 50%" : { opacity: "0" }
                }
            },
            animation: {
                "caret-blink": "caret-blink 1.25s ease-out infinite",
            },
        },
    },
};

export default config;