/*
* A tailwinds config file used to generate atomic utility css classes.
* See: https://tailwindcss.com/docs/configuration/
* Def: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/

module.exports = {
    purge: [
        "./src/**/*.html",
        "./src/**/*.js",
        "./src/**/*.jsx",
        "./src/**/*.ts",
        "./src/**/*.tsx",
    ],
    experimental: {
        applyComplexClasses: true,
    },
    variants: {
        opacity: ['responsive', 'group-hover', 'hover', 'disabled'],
        textDecoration: ['responsive', 'hover', 'focus'],
    },
    theme: {
        extend: {
            fontFamily: {
                open: ["'Open Sans'", "sans-serif"],
                cursive: ["'Pacifico'", 'cursive'],
            },
            colors: {
                'primary': {
                    light: 'hsl(27, 78%, 72%)',
                    base: 'hsl(27, 84%, 66%)',
                    dark: 'hsl(27, 90%, 60%)',
                },
            },
            inset: {
                '1/2': '50%',
            },
            boxShadow: {
                outline: '0 0 0 4px hsla(27, 90%, 50%, 0.4)',
            },
            opacity: {
                85: '0.85',
            },
        },
    },
    plugins: [],
}
