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
            inset: {
                '1/2': '50%',
            },
            boxShadow: {
                outline: '0 0 0 3px rgba(99, 179, 237, 0.3)',
            },
        },
    },
    plugins: [],
}
