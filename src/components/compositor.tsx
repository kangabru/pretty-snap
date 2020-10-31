import { Fragment, h, JSX } from 'preact';
import { useState } from 'preact/hooks';
import { SaveState, useCopy, useDownload } from './hooks/canvas';
import { DataImage, onInputChange, useImageDrop, useImagePaste } from './hooks/upload';
import useStore from './store';
import { join } from './utils';

export default function Compositor() {
    const [dataImage, setDataImage] = useState<DataImage | undefined>(undefined)
    const dataUrl = dataImage?.dataUrl

    useImagePaste(setDataImage)
    const [dropZone, isDropping] = useImageDrop<HTMLDivElement>(setDataImage)

    const padding = useStore(s => s.padding)
    const srcBg = useStore(s => s.backgroundSrc)

    const settings = { dataImage, padding }
    const [_ref, download, downloadState] = useDownload(settings)
    const [ref, canCopy, copy, copyState] = useCopy(settings, _ref)

    const width = dataImage?.width ?? 0
    const height = dataImage?.height ?? 0
    const widthExt = width + 2 * padding, heightExt = height + 2 * padding

    return <Fragment>

        {/* The compositor viewer */}
        <section class="inline-block bg-gray-200 bg-cover bg-center rounded-xl overflow-hidden"
            style={{ padding, backgroundImage: `url('${srcBg}')` }}>
            {dataUrl ? <img src={dataUrl} alt="Screenshot" class="rounded shadow-xl" />
                : <div ref={dropZone} class="bg-white shadow h-64 rounded-lg p-5">
                    <div class={join("border-dashed border-4 w-full h-full rounded-lg px-20 col justify-center text-2xl space-y-5",
                        isDropping ? "bg-blue-500" : "border-gray-500")}>
                        <Fragment>
                            <p class="font-bold">Ctrl + V</p>
                            <label class="pill cursor-pointer">
                                Upload
                                    <input hidden type="file" accept="image/*" onChange={onInputChange(setDataImage)} />
                            </label>
                        </Fragment>
                    </div>
                </div>
            }
        </section>

        {/* A hacky hidden element used to render consistent on different browsers. */}
        {dataImage && <div class="hidden">
            <section ref={ref} class="bg-gray-200 bg-cover bg-center"
                style={{ padding, backgroundImage: `url('${srcBg}')`, width: widthExt, height: heightExt }}>
                <img src={dataImage.dataUrl} alt="Screenshot" class="rounded shadow-xl" style={{ width, height }} />
            </section>
        </div>}

        {/* Controls */}
        <div class="row justify-center w-full max-w-xl space-x-3 bg-gray-100 p-3 rounded-lg">
            <ControlButton onClick={copy} disabled={!canCopy} title={canCopy ? "Copy" : "This browser doesn't support image copy."} status={copyState}>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            </ControlButton>

            <ControlButton onClick={download} title="Download" status={downloadState}>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path></svg>
            </ControlButton>
        </div>
    </Fragment>
}

function ControlButton(props: Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'class' | 'children'> & { status: SaveState, children: JSX.Element }) {
    const { status, ...buttonProps } = props
    return <button {...buttonProps} class="pill" disabled={buttonProps.disabled || status == SaveState.disabled}>
        {status == SaveState.error
            ? <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            : status == SaveState.success
                ? <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                : props.children
        }
    </button>
}