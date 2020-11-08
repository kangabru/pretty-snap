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
        backgroundColor: ({ after }) => after(['disabled']),
        opacity: ({ after }) => after(['disabled']),
        textDecoration: ({ after }) => after(['focus']),
        borderColor: ({ after }) => after(['focus-within']),
        backgroundSize: ({ after }) => after(['focus']),
    },
    theme: {
        extend: {
            fontFamily: {
                open: ["'Open Sans'", "sans-serif"],
                cursive: ["'Pacifico'", 'cursive'],
            },
            colors: {
                'primary': {
                    light: 'hsl(38, 93%, 77%)',
                    base: 'hsl(33, 90%, 65%)',
                    dark: 'hsl(27, 84%, 57%)',
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
            backgroundSize: (theme) => theme('spacing'),
        },
    },
    plugins: [],
}
