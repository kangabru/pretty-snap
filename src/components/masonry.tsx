import { h } from 'preact';
import { UnsplashImage, useUnsplash } from './hooks/unsplash';
import useStore from './store';
import { GetUnsplashBacklink } from './utils';

export default function MasonryGrid() {
    const [images, loadMore] = useUnsplash()

    return <section class="bg-white shadow-md p-5 space-y-3 rounded-lg">
        <div class="row space-x-2">
            <SearchInput />
            <div class="flex-1"></div>
            {!!images.length && <LoadMore onClick={loadMore} />}
        </div>

        <div class="w-full max-w-screen-lg overscroll-y-none overflow-x-auto space-x-3 rounded whitespace-no-wrap">
            {images.map(img => <MasonryImage key={img.urls.thumb} {...img} />)}
        </div>

    </section>
}

function SearchInput() {
    const searchTerm = useStore(s => s.searchTerm)
    const isSearching = useStore(s => s.isSeaching)
    const search = (e: KeyboardEvent) => e.key == "Enter" && useStore.setState({ searchPage: 1, searchTerm: (e.target as HTMLInputElement).value })
    return <div class="row space-x-2">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
        <input disabled={isSearching} onKeyUp={search} value={searchTerm} type="text" placeholder="Search unsplash.com" class="px-3 py-2 border-b-2 border-gray-200 focus:border-primary-light outline-none" />
    </div>
}


}

function LoadMore({ onClick }: { onClick: () => void }) {
    const isSearching = useStore(s => s.isSeaching)
    return <button onClick={onClick} disabled={isSearching} class="row space-x-1 px-3 button font-semibold">
        {isSearching && <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-primary-base" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
        <span>Load more</span>
    </button>
}

function MasonryImage(img: UnsplashImage) {
    const onClick = () => useStore.setState({ backgroundSrc: img.urls.regular })
    return <div title={img.description} style={{ backgroundImage: `url('${img.urls.small}')` }}
        class="inline-block relative h-56 w-56 space-y-2 overflow-hidden shadow rounded bg-no-repeat transform transition-all duration-100 hover:scale-102 hover:shadow-lg bg-cover bg-top">
        <div class="grid grid-rows-2 w-full h-full bg-black bg-opacity-25 opacity-0 hover:opacity-100 transition-opacity duration-150">

            <button onClick={onClick} class="w-full h-full opacity-85 hover:opacity-100 bg-black bg-opacity-0 hover:bg-opacity-25 transition-opacity duration-150 focus:outline-none">
                <span class="bg-white py-2 px-3 rounded shadow">Use image</span>
            </button>

            <a href={GetUnsplashBacklink(img)} target="blank"
                class="row items-center justify-center space-x-2 w-full h-full opacity-85 hover:opacity-100 bg-black bg-opacity-0 hover:bg-opacity-25 transition-opacity duration-150  focus:outline-none">
                <img src={img.user.profile_image.medium} alt="Avatar" class="rounded-full shadow w-8 h-8 pointer-events-none" />
                <span class="text-white">{img.user.name}</span>
            </a>
        </div>
    </div>
}
