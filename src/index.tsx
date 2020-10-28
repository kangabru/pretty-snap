import { Fragment, h, render } from 'preact';
import { useState } from 'preact/hooks';
import useMeasure from 'react-use-measure';
import { useDownload } from './canvas';
import './index.css';
import { useUnsplash, UnsplashImage } from './unsplash';
import { DataImage, onInputChange, useImageDrop, useImagePaste } from './upload';

const IMG_BG_DEFAULT = "https://images.unsplash.com/photo-1480499484268-a85a2414da81?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1355&q=80"

render(<App />, document.getElementById('root') as HTMLElement)

function App() {
    return <div class="col p-5 space-y-5">
        <h1 class="text-6xl row space-x-5">
            <span>📸 Pretty Snap</span>
        </h1>
        <Image />
        <MasonryImages />
        <Controls />
    </div>
}

function Image() {
    const [dataImage, setDataImage] = useState<DataImage | undefined>(undefined)
    const dataUrl = dataImage?.dataUrl
    const [dataUrlBg,] = useState(IMG_BG_DEFAULT)

    useImagePaste(setDataImage)
    const [dropZone, isDropping] = useImageDrop<HTMLDivElement>(setDataImage)

    const padding = 40

    const [ref, download, isDownloading] = useDownload({ dataImage, padding })

    return <Fragment>
        <button class="bg-blue-500 rounded-lg py-2 px-3 shadow-lg" onClick={download}>Download</button>
        <div> {/* div required so parent padding doesn't affect snapshot */}
            <section ref={ref} class={join("inline-block bg-gray-200 bg-cover bg-center", !isDownloading && "rounded-xl overflow-hidden")}
                style={{ padding, backgroundImage: `url('${dataUrlBg}')` }}>
                {dataUrl ? <img src={dataUrl} alt="Screenshot" class="rounded shadow" />
                    : <div ref={dropZone} class="bg-white shadow h-64 rounded-lg p-5">
                        <div class={join("border-dashed border-4 w-full h-full rounded-lg px-20 col justify-center text-2xl space-y-5",
                            isDropping ? "bg-blue-500" : "border-gray-500")}>
                            <Fragment>
                                <p class="font-bold">Ctrl + V</p>
                                <label class="px-2 py-2 bg-white shadow rounded-lg cursor-pointer">
                                    Upload
                            <input hidden type="file" accept="image/*" onChange={onInputChange(setDataImage)} />
                                </label>
                            </Fragment>
                        </div>
                    </div>
                }
            </section>
        </div>
    </Fragment>
}

type RenderImage = UnsplashImage & { x: number, y: number, widthLocal: number, heightLocal: number }

function MasonryImages() {
    const IMG_PADDING = 10
    const IMG_PADDING_2 = 2 * IMG_PADDING
    const IMG_WIDTH_TARGET = 180

    const [bind, { width }] = useMeasure()

    const columns = Math.max(1, Math.floor(width / IMG_WIDTH_TARGET))
    const heights = new Array(columns).fill(0) // Each column gets a height starting with zero

    const unsplashImages = useUnsplash()
    const widthLocal = (width - IMG_PADDING_2) / columns
    const images = unsplashImages.results?.map<RenderImage>(img => {
        // Convert real to local heights
        const heightLocal = img.width && img.height ? (widthLocal - 2 * IMG_PADDING) / img.width * img.height + 2 * IMG_PADDING : 0

        const column = heights.indexOf(Math.min(...heights)) // Basic masonry-grid placing, puts tile into the smallest column using Math.min
        const x = widthLocal * column, y = (heights[column] += heightLocal) - heightLocal
        return { ...img, x, y, widthLocal, heightLocal }
    }) ?? []

    const heightMax = Math.max(...heights) + IMG_PADDING_2
    const widthMax = images.length ? width : "100%"

    return <div ref={bind} class="w-full h-full">
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
}

function MasonryImage(img: UnsplashImage) {
    return <button title={img.description} style={{ backgroundImage: `url('${img.urls.small}')` }}
        class="group col relative w-full h-full p-2 space-y-2 overflow-hidden shadow rounded bg-no-repeat transform transition-all duration-100 hover:scale-102 hover:shadow-lg bg-cover bg-top">
    </button>
}

function Controls() {
    return <div class="w-full rounded bg-gray-200 p-5 space-x-3 row justify-center">
        <input type="range" min="1" max="30" value="10"></input>
        <input type="range" min="1" max="30" value="10"></input>
        <button class="px-2 py-2 bg-white shadow rounded-lg"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></button>
        <button class="px-2 py-2 bg-white shadow rounded-lg"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path></svg></button>
    </div>
}

type ClassProp = string | boolean | undefined | null
export function join(...classes: ClassProp[]): string {
    return classes.filter(x => !!x).join(" ")
}