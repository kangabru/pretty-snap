import { useEffect, useState } from "preact/hooks"
import { defaultResponseDev, GetUnsplashBatchDev, urls } from "./constants"

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

type UnsplashExtra = { loadMore: () => void, isLoading: boolean }

export function useUnsplash(): [UnsplashImage[], UnsplashExtra] {
    const [images, setImages] = useState<UnsplashImage[]>([])
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    const getResponse = process.env.NODE_ENV == 'production' ? GetResponseProd : GetResponseDev
    useEffect(() => {
        setIsLoading(true)
        getResponse().then(x => {
            setIsLoading(false)
            x.results && setImages([...images, ...x.results])
        })
    }, [page])

    const loadMore = () => setPage(page + 1)

    return [images, { isLoading, loadMore }]
}

async function GetResponseProd(): Promise<UnsplashResponse> {
    const params = new URLSearchParams()
    params.append('query', 'nature')
    params.append('page', '1')
    return fetch(`${urls.api}?${params.toString()}`)
        .then(x => x.json())
}

function GetResponseDev(): Promise<UnsplashResponse> {
    return new Promise(accept => {
        const randTime = 500 + Math.random() * 1000
        setTimeout(() => accept({ results: GetUnsplashBatchDev() }), randTime)
    })
}