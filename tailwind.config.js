/*
* A tailwinds config file used to generate atomic utility css classes.
* See: https://tailwindcss.com/docs/configuration/
* Def: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/

const colours = require('tailwindcss/colors')

module.exports = {
    purge: [
        "./src/**/*.html",
        "./src/**/*.js",
        "./src/**/*.jsx",
        "./src/**/*.ts",
        "./src/**/*.tsx",
    ],
    variants: {
        extend: {
            backgroundColor: ['disabled'],
            backgroundSize: ['focus'],
            borderColor: ['focus-within'],
            opacity: ['disabled'],
            ringWidth: ['group-hover', 'group-focus'],
            textDecoration: ['focus'],
        }
    },
    theme: {
        extend: {
            fontFamily: {
                open: ["'Open Sans'", "sans-serif"],
                cursive: ["'Pacifico'", 'cursive'],
            },
            colors: {
                primary: {
                    light: 'hsl(38, 93%, 77%)',
                    base: 'hsl(33, 90%, 65%)',
                    dark: 'hsl(27, 84%, 57%)',
                },
                orange: colours.orange,
            },
            inset: (theme) => ({
                ...theme('spacing'),
                '1/2': '50%',
            }),
            backgroundSize: (theme) => theme('spacing'),
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
