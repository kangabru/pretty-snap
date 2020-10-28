import { Fragment, h } from 'preact';
import useMeasure from 'react-use-measure';
import { UnsplashImage, useUnsplash } from './hooks/unsplash';

type RenderImage = UnsplashImage & { x: number, y: number, widthLocal: number, heightLocal: number }

export default function MasonryGrid() {
    const IMG_PADDING = 10
    const IMG_PADDING_2 = 2 * IMG_PADDING
    const IMG_WIDTH_TARGET = 180

    const [bind, { width }] = useMeasure()

    const columns = Math.max(1, Math.floor(width / IMG_WIDTH_TARGET))
    const heights = new Array(columns).fill(0) // Each column gets a height starting with zero

    const [unsplashImages, { isLoading, loadMore }] = useUnsplash()
    const widthLocal = (width - IMG_PADDING_2) / columns
    const images = unsplashImages.map<RenderImage>(img => {
        // Convert real to local heights
        const heightLocal = img.width && img.height ? (widthLocal - 2 * IMG_PADDING) / img.width * img.height + 2 * IMG_PADDING : 0

        const column = heights.indexOf(Math.min(...heights)) // Basic masonry-grid placing, puts tile into the smallest column using Math.min
        const x = widthLocal * column, y = (heights[column] += heightLocal) - heightLocal
        return { ...img, x, y, widthLocal, heightLocal }
    }) ?? []

    const heightMax = Math.max(...heights) + IMG_PADDING_2
    const widthMax = images.length ? width : "100%"

    return <Fragment>
        <div ref={bind} class="w-full h-full max-w-screen-lg">
            <div style={{ width: widthMax, height: heightMax, padding: IMG_PADDING }}
                class="relative mx-auto rounded-lg bg-gray-200">
                {images.map(({ x, y, widthLocal, heightLocal, ...img }, i) => (
                    <div key={i} class="absolute"
                        style={{
                            width: widthLocal, height: heightLocal,
                            padding: IMG_PADDING, transform: `translate3d(${x}px,${y}px,0)`
                        }} >
                        <MasonryImage {...img} />
                    </div>
                ))}
            </div>
        </div>
        <button onClick={loadMore} disabled={isLoading}
            class="row bg-white shadow rounded-md px-3 py-2 mx-auto">
            {isLoading && <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
            <span>Load more</span>
        </button>
    </Fragment>
}

function MasonryImage(img: UnsplashImage) {
    return <button title={img.description} style={{ backgroundImage: `url('${img.urls.small}')` }}
        class="group col relative w-full h-full p-2 space-y-2 overflow-hidden shadow rounded bg-no-repeat transform transition-all duration-100 hover:scale-102 hover:shadow-lg bg-cover bg-top">
    </button>
}
