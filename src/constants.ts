import abstract from '../assets/quick-searches/abstract.jpg'
import mountain from '../assets/quick-searches/mountain.jpg'
import palm from '../assets/quick-searches/palm.jpg'
import snow from '../assets/quick-searches/snow.jpg'
import summer from '../assets/quick-searches/summer.jpg'
import sun from '../assets/quick-searches/sun.jpg'
import tree from '../assets/quick-searches/tree.jpg'
import yosemite from '../assets/quick-searches/yosemite.jpg'

const referrer = "https://prettysnap.io"
const tweetMessage = "Check out Pretty Snap and make your snapshots look awesome! Thanks @kanga_bru%0A%0A"

export const urls = {
    api: process.env.URL_API,
    unsplash: "https://unsplash.com", // Do not add slash
    kangabru: "https://twitter.com/kanga_bru",
    pandasnap: "https://pandasnap.io",
    github: "https://github.com/kangabru/pretty-snap",
    share: `http://twitter.com/intent/tweet?url=${referrer}&text=${tweetMessage}&original_referer=${referrer}`,
}

export const SRC_BG_DEFAULT = "https://images.unsplash.com/photo-1480499484268-a85a2414da81?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1355&q=80"

export const PADDING_MIN = 10
export const PADDING_INIT = 40
export const PADDING_MAX = 100

export type QuickSearch = { searchTerm: string, src: string }
export const quickSearches = {
    nature: <QuickSearch>{ searchTerm: 'nature', src: tree },
    mountain: <QuickSearch>{ searchTerm: 'mountains', src: mountain },
    palm: <QuickSearch>{ searchTerm: 'palms', src: palm },
    yosemite: <QuickSearch>{ searchTerm: 'yosemite', src: yosemite },
    summer: <QuickSearch>{ searchTerm: 'summer', src: summer },
    snow: <QuickSearch>{ searchTerm: 'snow', src: snow },
    sun: <QuickSearch>{ searchTerm: 'sun', src: sun },
    abstract: <QuickSearch>{ searchTerm: 'abstract', src: abstract },
}

export const MAX_SEARCH_COUNT = 5