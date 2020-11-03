const referrer = "https://prettysnap.io"
const tweetMessage = "Check out Pretty Snap and make your snapshots look awesome! Thanks @kanga_bru%0A%0A"

export const urls = {
    api: process.env.URL_API,
    kangabru: "https://twitter.com/kanga_bru",
    pandasnap: "https://pandasnap.io",
    github: "https://github.com/kangabru/pretty-snap",
    share: `http://twitter.com/intent/tweet?url=${referrer}&text=${tweetMessage}&original_referer=${referrer}`,
}

export const SRC_BG_DEFAULT = "https://images.unsplash.com/photo-1480499484268-a85a2414da81?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1355&q=80"

export const PADDING_MIN = 10
export const PADDING_INIT = 40
export const PADDING_MAX = 100
