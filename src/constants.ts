import abstract from '../assets/quick-searches/abstract.jpg'
import mountain from '../assets/quick-searches/mountain.jpg'
import palm from '../assets/quick-searches/palm.jpg'
import snow from '../assets/quick-searches/snow.jpg'
import summer from '../assets/quick-searches/summer.jpg'
import sun from '../assets/quick-searches/sun.jpg'
import tree from '../assets/quick-searches/tree.jpg'
import yosemite from '../assets/quick-searches/yosemite.jpg'
import { getRandomItem, getQuickSearch as quicky, Orientation } from './components/utils'

const referrer = "https://prettysnap.io"
const tweetMessage = "Check out Pretty Snap and make your snapshots look awesome! Thanks @kanga_bru%0A%0A"

const urlBase = process.env.URL_API ?? ""

export const urls = {
    apiUnsplash: urlBase + "/splash",
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
export const paramsPreview = "?w=1080&q=80"
export const paramsExport = `?w=${MAX_SIZE}&q=80`

// https://docs.imgix.com/apis/rendering/rotation/orient
export const paramsOrientLeft = "&orient=8"
export const paramsOrientRight = "&orient=6"

export const quickSearches = [
    quicky('nature',    tree,     "https://images.unsplash.com/photo-1480499484268-a85a2414da81"),
    quicky('mountains', mountain, "https://images.unsplash.com/photo-1504870712357-65ea720d6078"),
    quicky('palms',     palm,     "https://images.unsplash.com/photo-1514125669375-59ee3985d08b", Orientation.Right),
    quicky('yosemite',  yosemite, "https://images.unsplash.com/photo-1527549993586-dff825b37782"),
    quicky('summer',    summer,   "https://images.unsplash.com/photo-1515876879333-013aa5ea1472", Orientation.Left),
    quicky('snow',      snow,     "https://images.unsplash.com/photo-1517299321609-52687d1bc55a"),
    quicky('sun',       sun,      "https://images.unsplash.com/photo-1504386106331-3e4e71712b38"),
    quicky('abstract',  abstract, "https://images.unsplash.com/photo-1557672172-298e090bd0f1", Orientation.Right),
]

export const randomSearch = getRandomItem(Object.values(quickSearches))

export const MAX_SEARCH_COUNT = 5