import { Fragment, h } from 'preact';
import { useState } from 'preact/hooks';
import { useDownload } from './hooks/canvas';
import { DataImage, onInputChange, useImageDrop, useImagePaste } from './hooks/upload';
import { join } from './utils';

const IMG_BG_DEFAULT = "https://images.unsplash.com/photo-1480499484268-a85a2414da81?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1355&q=80"

export default function Compositor() {
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