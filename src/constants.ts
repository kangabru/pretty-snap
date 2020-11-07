import thumbAbstract from '../assets/quick-searches/abstract.jpg'
import thumbMountain from '../assets/quick-searches/mountain.jpg'
import thumbPalm from '../assets/quick-searches/palm.jpg'
import thumbSnow from '../assets/quick-searches/snow.jpg'
import thumbSummer from '../assets/quick-searches/summer.jpg'
import thumbSun from '../assets/quick-searches/sun.jpg'
import thumbTree from '../assets/quick-searches/tree.jpg'
import thumbYosemite from '../assets/quick-searches/yosemite.jpg'
import { dataAbstract, dataMountain, dataPalms, dataPineapple, dataSnow, dataSun, dataValley, dataValley2 as dataYosemite } from './components/data'
import { getQuickSearch as quicky, getRandomItem, Orientation } from './components/utils'

const referrer = "https://prettysnap.io"
const tweetMessage = "Check out Pretty Snap and make your snapshots look awesome! Thanks @kanga_bru%0A%0A"

// See cloudlfare/worker.js for the endpoint definitions
const urlBase = (process.env.URL_API ?? "") + "/api"

export const urls = {

    /** Use to proxy the unsplash search API.
     * @access GET request with unsplash search params appended.
     * @returns Unsplash JSON search response.
     * @see https://unsplash.com/documentation#search-photos
     */
    apiUnsplashSearch: urlBase + "/search",

    /** Use to trigger a download event as required by the API guidelines.
     * @access POST request with the body as the download url in plain text.
     * @returns 200 on success
     * @see https://help.unsplash.com/en/articles/2511258-guideline-triggering-a-download
     */
    apiUnsplashUse: urlBase + "/use",

    unsplash: "https://unsplash.com", // Do not add slash
    kangabru: "https://twitter.com/kanga_bru",
    pandasnap: "https://pandasnap.io",
    github: "https://github.com/kangabru/pretty-snap",
    share: `http://twitter.com/intent/tweet?url=${referrer}&text=${tweetMessage}&original_referer=${referrer}`,
}

export const MAX_SIZE = 1920

export const PADDING_MIN = 10
export const PADDING_INIT = 60
export const PADDING_MAX = 100

// https://docs.imgix.com/apis/rendering/size
// https://unsplash.com/documentation#dynamically-resizable-images
export const paramsOrientLeft = "&orient=8"
export const paramsOrientRight = "&orient=6"

export const quickSearches = [
    quicky('nature', thumbTree, dataValley),
    quicky('mountains', thumbMountain, dataMountain),
    quicky('palms', thumbPalm, dataPalms, Orientation.Right),
    quicky('yosemite', thumbYosemite, dataYosemite),
    quicky('summer', thumbSummer, dataPineapple, Orientation.Left),
    quicky('snow', thumbSnow, dataSnow),
    quicky('sun', thumbSun, dataSun),
    quicky('abstract', thumbAbstract, dataAbstract, Orientation.Right),
]

export const randomSearch = getRandomItem(quickSearches)

export const MAX_SEARCH_COUNT = 5