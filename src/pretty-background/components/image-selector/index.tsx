import { Fragment, h } from 'preact';
import { useRef } from 'preact/hooks';
import { useEffect, useState } from 'react';
import { useChildNavigate } from '../../../common/hooks/use-child-nav';
import { join, srcToUrl } from '../../../common/misc/utils';
import { urls } from '../../misc/constants';
import { BackgroundImage, UnsplashImage } from '../../misc/types';
import { getUnsplashBacklinkImage, getUnsplashBacklinkUser } from '../../misc/utils';
import useOptionsStore from '../../stores/options';
import useUnsplashStore from '../../stores/unsplash';
import Controls from './controls';

export default function ImageSelector() {
    const image = useOptionsStore(s => s.backgroundImage)

    return <>
        <Controls />
        <ImageRow />
        <div class="flex flex-wrap items-center justify-center sm:justify-around sm:pt-3">
            {image && <>
                <CurrentImageLink img={image} class="hover:underline m-2 sm:m-0" />
                <UserImageLink img={image} class="hover:underline m-2 sm:m-0" />
            </>}
            <p class="inline-block text-gray-800 text-center m-2 sm:m-0">Photos by <a class="link" href={urls.unsplash}>Unsplash</a></p>
        </div>
    </>
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

    const imgCurrent = useOptionsStore(s => s.backgroundImage)
    const ref = useChildNavigate<HTMLDivElement>([...images, imgCurrent?.id], scrollRef)

    // Center the load icon on first load otherwise use the row
    return isFirstSearch
        ? <div tabIndex={-1} class="row justify-center w-full"><LoadMore /></div>
        : <div tabIndex={-1} ref={ref} class="max-w-screen-lg overscroll-y-none overflow-x-auto p-2 space-x-3 rounded whitespace-nowrap">
            {images?.map(img => <Image key={img.urls.thumb} {...img} />)}
            <LoadMore />
            <div class="inline-block w-2"></div> {/* Spacer because margins ain't workin */}
        </div>
}

const commonImageStyles = "inline-block relative h-56 w-48 sm:w-56 rounded"
const commonImageButtonStyles = "w-full h-full row justify-center p-4 opacity-80 hover:opacity-100 bg-transparent sm:bg-black sm:bg-opacity-0 bg-opacity-0 hover:bg-opacity-25 focus:bg-opacity-25 focus:underline transition-opacity duration-150"

/** Renders the image components in the image row.
 * - Has a button to set the background images
 * - Has a link to the unsplash author page as required by the API usage
 */
function Image(img: UnsplashImage) {
    const onClick = () => useOptionsStore.getState().setImage(img)

    const isTarget = useOptionsStore(s => s.backgroundImage?.id) == img.id
    const [isFocused, setIsFocused] = useState(false)
    const funcs = { onFocus: () => setIsFocused(true), onBlur: () => setIsFocused(false) }

    return <div {...funcs} title={img.description ?? ""} style={{ backgroundImage: srcToUrl(img.urls.small) }} data-target={isTarget}
        class={join(commonImageStyles, "group shadow space-y-2 overflow-hidden bg-no-repeat bg-cover bg-center animate-fade-in outline-primary")}>
        <div class={join(!isFocused && "sm:opacity-0", "grid grid-rows-2 w-full h-full sm:bg-black sm:bg-opacity-25 hover:opacity-100 transition-opacity duration-150")}>

            <button {...funcs} onClick={onClick} class={join(commonImageButtonStyles, "items-start")} tabIndex={isFocused ? 0 : -1}>
                <span class="bg-white py-2 px-3 rounded shadow">Use image</span>
            </button>

            <UserImageLink img={img} tabIndex={isFocused ? 0 : -1} {...funcs}
                class={join(commonImageButtonStyles, "items-end overflow-hidden text-white")} />
        </div>
    </div>
}

export function UserImageLink({ img, ...props }: h.JSX.HTMLAttributes<HTMLAnchorElement> & { img: BackgroundImage }) {
    return <a {...props} href={getUnsplashBacklinkUser(img)} target="_blank">
        <div class="row space-x-2">
            <img src={img.user.profile_image.medium} alt="Avatar" class="rounded-full shadow w-8 h-8 pointer-events-none" />
            <span class="truncate">{img.user.name}</span>
        </div>
    </a>
}

export function CurrentImageLink({ img, ...props }: h.JSX.HTMLAttributes<HTMLAnchorElement> & { img: BackgroundImage }) {
    return <a {...props} href={getUnsplashBacklinkImage(img)} target="_blank">
        <div class="row space-x-2">
            <img src={img.urls.thumb} alt="Avatar" class="rounded-full shadow w-8 h-8 pointer-events-none" />
            <span class="truncate">Selected</span>
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
        <button onClick={loadMore} class={join(center, "col space-y-3 text-2xl p-8 text-primary outline-primary rounded-md hover:bg-gray-100")}>
            <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg>
            <span>Load more</span>
        </button>
    </div>
}

function ImagePlaceholder() {
    return <div title="Placeholder" class={join(commonImageStyles, 'opacity-50 text-primary')}>
        <svg class={join(center, "w-32 h-32 animate-pulse delay-100")} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"></path></svg>
    </div>
}
