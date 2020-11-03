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
                roboto: ["'Roboto'", "sans-serif"],
                cursive: ["'Pacifico'", 'cursive'],
            },
            colors: {
                'primary': 'hsl(143, 72%, 54%)',
                'primary-dark': 'hsl(143, 76%, 48%)',
            },
            inset: {
                '1/2': '50%',
            },
            boxShadow: {
                outline: '0 0 0 4px hsla(143, 72%, 54%, 0.5)',
            },
            opacity: {
                85: '0.85',
            },
        },
    },
    plugins: [],
}
