import { useEffect, useState } from "preact/hooks"
import { urls } from "../../constants"
import useStore from "../store"
import { GetUnsplashBatchDev } from "../utils"

export type UnsplashResponse = { results?: UnsplashImage[] }
export type UnsplashImage = {
    width: number,
    height: number,
    description?: string,
    alt_description?: string,
    urls: { raw: string, full: string, regular: string, small: string, thumb: string },
    links: {
        download: string,
        download_location: string,
    },
    user: {
        name: string,
        username: string,
        portfolio_url: string,
        profile_image: {
            small: string,
            medium: string,
            large: string,
        },
    },
}

export function useUnsplash(): [UnsplashImage[], () => void] {
    const searchTerm = useStore(s => s.searchTerm)
    const searchPage = useStore(s => s.searchPage)

    const [images, setImages] = useState<UnsplashImage[]>([])

    const getResponse = process.env.NODE_ENV == 'production' ? GetResponseProd : GetResponseDev
    useEffect(() => {
        const options: SearchInput = { searchTerm, page: searchPage }
        useStore.setState({ isSeaching: true })
        const imagesToKeep = searchPage <= 1 ? [] : images // reset for new searches
        setImages(imagesToKeep)
        getResponse(options).then(x => {
            useStore.setState({ isSeaching: false })
            x.results && setImages([...imagesToKeep, ...x.results])
        })
    }, [searchPage, searchTerm])

    const loadMore = () => useStore.setState({ searchPage: searchPage + 1 })

    return [images, loadMore]
}

type SearchInput = { searchTerm?: string, page: number }

async function GetResponseProd(options: SearchInput): Promise<UnsplashResponse> {
    const params = new URLSearchParams()
    options.searchTerm && params.append('query', options.searchTerm)
    params.append('page', '' + options.page)
    return fetch(`${urls.api}?${params.toString()}`).then(x => x.json())
}

function GetResponseDev(_: SearchInput): Promise<UnsplashResponse> {
    return new Promise(accept => {
        const randTime = 500 + Math.random() * 1000
        setTimeout(() => accept({ results: GetUnsplashBatchDev() }), randTime)
    })
}