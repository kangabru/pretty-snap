import abstract from '../assets/quick-searches/abstract.jpg'
import mountain from '../assets/quick-searches/mountain.jpg'
import palm from '../assets/quick-searches/palm.jpg'
import snow from '../assets/quick-searches/snow.jpg'
import summer from '../assets/quick-searches/summer.jpg'
import sun from '../assets/quick-searches/sun.jpg'
import tree from '../assets/quick-searches/tree.jpg'
import yosemite from '../assets/quick-searches/yosemite.jpg'
import { getRandomItem } from './components/utils'

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

export const PADDING_MIN = 10
export const PADDING_INIT = 60
export const PADDING_MAX = 100

//https://docs.imgix.com/apis/rendering/rotation/orient
const imgParams = "?w=1400&q=80"
const imgParamsLeft = imgParams + "&orient=8"
const imgParamsRight = imgParams + "&orient=6"

export type QuickSearch = { searchTerm: string, thumb: string, src: string }
export const quickSearches = {
    nature: <QuickSearch>{ searchTerm: 'nature', thumb: tree, src: "https://images.unsplash.com/photo-1480499484268-a85a2414da81" + imgParams },
    mountain: <QuickSearch>{ searchTerm: 'mountains', thumb: mountain, src: "https://images.unsplash.com/photo-1504870712357-65ea720d6078" + imgParams },
    palm: <QuickSearch>{ searchTerm: 'palms', thumb: palm, src: "https://images.unsplash.com/photo-1514125669375-59ee3985d08b" + imgParamsRight },
    yosemite: <QuickSearch>{ searchTerm: 'yosemite', thumb: yosemite, src: "https://images.unsplash.com/photo-1527549993586-dff825b37782" + imgParams },
    summer: <QuickSearch>{ searchTerm: 'summer', thumb: summer, src: "https://images.unsplash.com/photo-1515876879333-013aa5ea1472" + imgParamsLeft },
    snow: <QuickSearch>{ searchTerm: 'snow', thumb: snow, src: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a" + imgParams },
    sun: <QuickSearch>{ searchTerm: 'sun', thumb: sun, src: "https://images.unsplash.com/photo-1504386106331-3e4e71712b38" + imgParams },
    abstract: <QuickSearch>{ searchTerm: 'abstract', thumb: abstract, src: "https://images.unsplash.com/photo-1557672172-298e090bd0f1" + imgParamsRight },
}

export const randomSearch = getRandomItem(Object.values(quickSearches))

export const MAX_SEARCH_COUNT = 5