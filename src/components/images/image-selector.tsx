import { Fragment, h } from 'preact';
import { useRef } from 'preact/hooks';
import { useEffect } from 'react';
import { urls } from '../../constants';
import { BackgroundImage, UnsplashImage } from '../../types';
import useOptionsStore from '../stores/options';
import useUnsplashStore from '../stores/unsplash';
import { getUnsplashBacklink, join, srcToUrl } from '../utils';
import Controls from './image-controls';

export default function ImageSelector() {
    return <Fragment>
        <Controls />
        <ImageRow />
        <p class="text-gray-800 text-center pt-3">Photos by <a class="link" href={urls.unsplash} target="blank">Unsplash</a></p>
    </Fragment>
}

/** Renders the unsplash row of images that users can select from. */
function ImageRow() {
    const images = useUnsplashStore(s => s.images)
    const isSearching = useUnsplashStore(s => s.isSearching)
    const isFirstSearch = !images?.length && isSearching

    // Scroll back to start on new searches
    const scrollRef = useRef<HTMLDivElement>()
    const scrollLeft = () => scrollRef.current && scrollRef.current.scrollTo({ left: 0 })
    useEffect(() => useUnsplashStore.subscribe(scrollLeft, state => state.searchTerm), [])

    // Center the load icon on first load otherwise use the row
    return isFirstSearch
        ? <div class="row justify-center w-fulls"><LoadMore /></div>
        : <div ref={scrollRef} class="max-w-screen-lg overscroll-y-none overflow-x-auto p-2 space-x-3 rounded whitespace-no-wrap">
            {images?.map(img => <Image key={img.urls.thumb} {...img} />)}
            <LoadMore />
            <div class="inline-block w-2"></div> {/* Spacer because margins ain't workin */}
        </div>
}

const commonImageStyles = "inline-block relative h-56 w-48 sm:w-56 rounded"
const commonImageButtonStyles = "w-full h-full row justify-start sm:items-center sm:justify-center p-4 opacity-85 hover:opacity-100 bg-transparent sm:bg-black sm:bg-opacity-0 bg-opacity-0 hover:bg-opacity-25 transition-opacity duration-150 focus:outline-none"

/** Renders the image components in the image row.
 * - Has a button to set the background images
 * - Has a link to the unsplash author page as required by the API usage
 */
function Image(img: UnsplashImage) {
    const onClick = () => useOptionsStore.getState().setImage(img)
    return <div title={img.description ?? ""} style={{ backgroundImage: srcToUrl(img.urls.small) }}
        class={join(commonImageStyles, "shadow space-y-2 overflow-hidden bg-no-repeat bg-cover bg-center animate-fade-in")}>
        <div class="grid grid-rows-2 w-full h-full sm:bg-black sm:bg-opacity-25 sm:opacity-0 hover:opacity-100 transition-opacity duration-150">

            <button onClick={onClick} class={join(commonImageButtonStyles, "items-start")}>
                <span class="bg-white py-2 px-3 rounded shadow">Use image</span>
            </button>

            <UserImageLink img={img} className={join(commonImageButtonStyles, "items-end overflow-hidden text-white")} />
        </div>
    </div>
}

export function UserImageLink({ img, className }: { img: BackgroundImage, className?: string }) {
    return <a href={getUnsplashBacklink(img)} target="blank" class={className}>
        <div class="row space-x-2 overflow-hidden">
            <img src={img.user.profile_image.medium} alt="Avatar" class="rounded-full shadow w-8 h-8 pointer-events-none" />
            <span class="truncate">{img.user.name}</span>
        </div>
    </a>
}

function LoadMore() {
    const isSearching = useUnsplashStore(s => s.isSearching)
    const canLoadMore = useUnsplashStore(s => s.canLoadMore)
    return isSearching ? <ImagePlaceholder /> : canLoadMore ? <LoadMoreButton /> : <Fragment />
}

const center = "absolute transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"

function LoadMoreButton() {
    const loadMore = useUnsplashStore(s => s.loadMore)
    return <div class={commonImageStyles}>
        <button onClick={loadMore} class={join(center, "col space-y-3 text-2xl p-8 text-primary-base outline-primary rounded-md hover:bg-gray-100")}>
            <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg>
            <span>Load more</span>
        </button>
    </div>
}

function ImagePlaceholder() {
    return <div title="Placeholder" class={join(commonImageStyles, 'opacity-50 text-primary-base')}>
        <svg class={join(center, "w-32 h-32 animate-pulse delay-100")} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"></path></svg>
    </div>
}
