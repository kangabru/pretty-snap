import thumbAbstract from '../assets/quick-searches/abstract.jpg'
import thumbColourful from '../assets/quick-searches/colourful.jpg'
import thumbMountain from '../assets/quick-searches/mountain.jpg'
import thumbPalm from '../assets/quick-searches/palm.jpg'
import thumbSnow from '../assets/quick-searches/snow.jpg'
import thumbSummer from '../assets/quick-searches/summer.jpg'
import thumbSun from '../assets/quick-searches/sun.jpg'
import thumbTree from '../assets/quick-searches/tree.jpg'
import thumbYosemite from '../assets/quick-searches/yosemite.jpg'
import { dataAbstract, dataColourful, dataMountain, dataPalms, dataPineapple, dataSnow, dataSun, dataValley, dataValley2 as dataYosemite } from './components/data'
import { getQuickSearch, getQuickPattern, getRandomItem, Orientation } from './components/utils'
import patterns from './components/images/pattern-svgs';
import colours from './components/images/pattern-colours';

const referrer = "https://prettysnap.app"
const tweetMessage = "Check out Pretty Snap and make your snapshots look 🔥! Thanks @kanga_bru%0A%0A"

// See cloudlfare/worker.js for the endpoint definitions
const urlBase = (process.env.URL_API ?? "") + "/api"

export const urls = {

    /** Use to proxy the unsplash search API.
     * @access GET request with unsplash search params appended.
     * @returns Unsplash JSON search response.
     * @see https://unsplash.com/documentation#search-photos
     */
    apiUnsplashSearch: urlBase + "/search",
    apiUnsplashRandom: urlBase + "/random",

    /** Use to trigger a download event as required by the API guidelines.
     * @access POST request with the body as the download url in plain text.
     * @returns 200 on success
     * @see https://help.unsplash.com/en/articles/2511258-guideline-triggering-a-download
     */
    apiUnsplashUse: urlBase + "/use",

    unsplash: "https://unsplash.com", // Do not add slash
    patterns: "http://www.heropatterns.com",
    kangabru: "https://twitter.com/kanga_bru",
    pandasnap: "https://pandasnap.io",
    github: "https://github.com/kangabru/pretty-snap",
    githubIssue: "https://github.com/kangabru/pretty-snap/issues/new",
    share: `http://twitter.com/intent/tweet?url=${referrer}&text=${tweetMessage}&original_referer=${referrer}`,
}

// As percentage of the foreground image size
export const PADDING_PERC_MIN = 5
export const PADDING_PERC_INIT = 12.5
export const PADDING_PERC_MAX = 20

/** Used to convert the paddingPerc value to pixels before a foreground has been selected. */
export const PADDING_MULT_INIT = 3

/** Border radius in pixels for the inner image */
export const BORDER_RADIUS = 10


// https://docs.imgix.com/apis/rendering/size
// https://unsplash.com/documentation#dynamically-resizable-images
export const paramsOrientLeft = "&orient=8"
export const paramsOrientRight = "&orient=6"

export const quickSearches = [
    getQuickSearch('nature', thumbTree, dataValley),
    getQuickSearch('mountains', thumbMountain, dataMountain),
    getQuickSearch('palms', thumbPalm, dataPalms, Orientation.Right),
    getQuickSearch('yosemite', thumbYosemite, dataYosemite),
    getQuickSearch('colourful', thumbColourful, dataColourful),
    getQuickSearch('summer', thumbSummer, dataPineapple, Orientation.Left),
    getQuickSearch('snow', thumbSnow, dataSnow),
    getQuickSearch('sun', thumbSun, dataSun),
    getQuickSearch('abstract', thumbAbstract, dataAbstract, Orientation.Right),
]

export const randomSearch = getRandomItem(quickSearches)

export const MAX_SEARCH_COUNT = 5

export const quickPatterns = [
    getQuickPattern(patterns.bubbles, colours.red200, colours.white, 1.0, 3),
    getQuickPattern(patterns.circuit, colours.gray600, colours.white, 0.5, 6),
    getQuickPattern(patterns.yyy, colours.blue200, colours.white, 0.5, 1.5),
    getQuickPattern(patterns.anchors, colours.yellow200, colours.black, 0.25, 2.5),
    getQuickPattern(patterns.stripes, colours.purple200, colours.white, 0.5, 0.75),
    getQuickPattern(patterns.polka, colours.red400, colours.white, 0.75, 0.75),
    getQuickPattern(patterns.random, colours.teal400, colours.white, 0.5, 2.5),
    getQuickPattern(patterns.leaf, colours.green400, colours.black, 0.25, 1.5),
    getQuickPattern(patterns.triangles, colours.pink200, colours.black, 0.25, 1),
]

export const randomPattern = getRandomItem(quickPatterns)