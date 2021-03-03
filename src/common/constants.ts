import { remToPixels } from "./misc/utils"

const referrer = "https://prettysnap.app"
const tweetMessage = "Check out Pretty Snap and make your snapshots look 🔥! Thanks @kanga_bru%0A%0A"

export const urls = {
    kangabru: "https://twitter.com/kanga_bru",
    github: "https://github.com/kangabru/pretty-snap",
    githubIssue: "https://github.com/kangabru/pretty-snap/issues/new",
    share: `http://twitter.com/intent/tweet?url=${referrer}&text=${tweetMessage}&original_referer=${referrer}`,
}

export const routes = {
    home: '/',
    annotate: '/annotate',
    background: '/background',
}

/** Border radius in pixels for the outer image. Should be scale when rendered. */
export const OUTER_BORDER_RADIUS = remToPixels(0.75) // rounded-xl = ~12 pixels

/** Border radius in pixels for the inner image. Should be scale when rendered. */
export const INNER_BORDER_RADIUS = remToPixels(0.5) // rounded-lg = ~8 pixels
