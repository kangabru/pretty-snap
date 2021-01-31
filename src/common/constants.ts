const referrer = "https://prettysnap.app"
const tweetMessage = "Check out Pretty Snap and make your snapshots look 🔥! Thanks @kanga_bru%0A%0A"

export const urls = {
    kangabru: "https://twitter.com/kanga_bru",
    pandasnap: "https://pandasnap.io",
    github: "https://github.com/kangabru/pretty-snap",
    githubIssue: "https://github.com/kangabru/pretty-snap/issues/new",
    share: `http://twitter.com/intent/tweet?url=${referrer}&text=${tweetMessage}&original_referer=${referrer}`,
}

export const routes = {
    home: '/',
    annotate: '/annotate',
    background: '/background',
}