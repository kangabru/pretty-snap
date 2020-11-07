import create, { GetState, SetState } from "zustand"
import { MAX_SEARCH_COUNT, randomSearch, urls } from "../../constants"
import { UnsplashImage, UnsplashResponse } from "../../types"
import { getUnsplashBatchDev } from "../utils"

type UnsplashState = {
    images: UnsplashImage[],
    isSearching?: boolean,
    searchTerm?: string,
    searchPage: number,
    canLoadMore: boolean,
    search: () => void,
    loadMore: () => void,
}

/** zustand state for state management  */
const useUnsplashStore = create<UnsplashState>((set, get) => ({
    images: [],
    searchPage: 1,
    searchTerm: randomSearch.searchTerm,
    canLoadMore: true,
    search: () => fetchImages(get, set),
    loadMore: () => fetchImages(get, set, get().images),
}))

// Search on page load
useUnsplashStore.getState().search()

// Fetch on search term change
useUnsplashStore.subscribe(_ => useUnsplashStore.getState().search(), s => s.searchTerm)

async function fetchImages(get: GetState<UnsplashState>, set: SetState<UnsplashState>, imagesToKeep?: UnsplashImage[]) {
    const { searchTerm, searchPage, canLoadMore } = get()
    const page = imagesToKeep ? searchPage : 1

    if (canLoadMore) try {
        set({ isSearching: true, images: imagesToKeep ?? [], searchPage: page })
        const resp = await CallApi({ searchTerm, page })
        const newImages = [...(imagesToKeep ?? []), ...(resp?.results ?? [])]
        set({ isSearching: false, images: newImages, searchPage: page + 1, canLoadMore: searchPage < MAX_SEARCH_COUNT })
    } catch (error) {
        set({ isSearching: false })
    }
}

type SearchInput = { searchTerm?: string, page: number }

async function CallApi(options: SearchInput): Promise<UnsplashResponse> {
    if (process.env.NODE_ENV == 'development')
        return new Promise(accept => {
            const randTime = 500 + Math.random() * 1000
            setTimeout(() => accept({ results: getUnsplashBatchDev() }), randTime)
        })

    const params = new URLSearchParams()
    options.searchTerm && params.append('query', options.searchTerm)
    params.append('page', '' + options.page)
    params.append('per_page', '20')
    return fetch(`${urls.apiUnsplashSearch}?${params.toString()}`).then(x => x.json())
}

export default useUnsplashStore
