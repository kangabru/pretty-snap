import { Fragment, h, JSX } from 'preact';
import { useState } from 'preact/hooks';
import { PADDING_MAX, PADDING_MIN } from '../constants';
import useCompositionStyles, { CLASSES_INNER, CLASSES_OUTER } from './compositor-styles';
import { SaveState, useCopy, useDownload } from './hooks/canvas';
import { DataImage, onInputChange, useImageDrop, useImagePaste } from './hooks/upload';
import useStore, { Position } from './store';
import { join } from './utils';

export default function Compositor() {
    const [dataImage, setDataImage] = useState<DataImage | undefined>(undefined)
    const dataUrl = dataImage?.dataUrl

    useImagePaste(setDataImage)
    const [dropZone, isDropping, isError] = useImageDrop<HTMLDivElement>(setDataImage)

    const padding = useStore(s => s.padding)
    const srcBg = useStore(s => s.backgroundSrc)

    const settings = { dataImage, padding }
    const [_ref, download, downloadState] = useDownload(settings)
    const [ref, canCopy, copy, copyState] = useCopy(settings, _ref)

    const [refScreenOuter, stylesScreen, stylesRender] = useCompositionStyles(srcBg, dataImage)

    return <Fragment>

        {/* The compositor viewer */}
        <section ref={refScreenOuter} class={join(CLASSES_OUTER, "mx-4 inline-block max max-w-screen-lg rounded-xl overflow-hidden")} style={stylesScreen.outer}>
            <div ref={dropZone} class={join("w-full", isDropping && "border-dashed border-4 rounded-xl")}>
                <label class="cursor-pointer">
                    <input hidden type="file" accept="image/x-png,image/jpeg" onChange={onInputChange(setDataImage)} />
                    {dataUrl ? <img src={dataUrl} alt="Screenshot" class={CLASSES_INNER} style={stylesScreen.inner} />
                        : <div class="col justify-center h-64 w-full py-5 px-12 space-y-5 bg-white shadow rounded" style={stylesScreen.inner}>
                            <InfoSection {...{ isDropping, isError }} />
                        </div>}
                </label>
            </div>
        </section>

        {/* A hacky hidden element used to render consistent on different browsers. */}
        {dataImage && <div class="hidden">
            <section ref={ref} class={CLASSES_OUTER} style={stylesRender.outer}>
                <img src={dataImage.dataUrl} alt="Screenshot" class={CLASSES_INNER} style={stylesRender.inner} />
            </section>
        </div>}

        {/* Controls */}
        <div class="col sm:flex-row justify-center space-y-5 sm:space-y-0 sm:space-x-3 p-3 rounded-lg bg-white shadow-lg">

            <PositionButtonGroup />

            <PaddingSlider />

            <div class="row space-x-3">
                <ControlButton onClick={copy} disabled={!canCopy} title={canCopy ? "Copy" : "This browser doesn't support image copy."} status={copyState}>
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                </ControlButton>

                <ControlButton onClick={download} title="Download" status={downloadState}>
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path></svg>
                </ControlButton>
            </div>
        </div>
    </Fragment>
}

function InfoSection({ isDropping, isError }: { isDropping: boolean, isError: boolean }) {
    return <Fragment>
        <h2 class="flex flex-wrap justify-center space-x-2 text-4xl font-open font-semibold leading-none">
            Make your snapshots <svg class="inline w-12 h-12 ml-1 -mt-1 text-orange-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"></path></svg>
        </h2>
        <div class={join("w-full p-5 space-y-2 text-xl text-center rounded-3xl border-4",
            isDropping ? "border-solid" : "border-dashed",
            isError ? "border-red-500" : "border-gray-400")}>
            <p class="font-semibold text-2xl">Add a snapshot</p>
            {isError
                ? <p class="text-red-400 font-semibold">Please use an image file!</p>
                : <p>Click here, paste from clipboard, or drop an image</p>}
        </div>
    </Fragment>
}

function PositionButtonGroup() {
    return <div class="inline-flex w-full bg-gray-100 rounded" role="group">
        <PositionButton position={Position.Center} />
        <PositionButton position={Position.Left} />
        <PositionButton position={Position.Right} />
        <PositionButton position={Position.Bottom} />
    </div>
}

function PositionButton(props: { position: Position }) {
    const { position } = props
    const positionActual = useStore(x => x.position)
    const setPosition = () => useStore.setState({ position: props.position })
    const isSelected = positionActual == position

    const cData: { x: number, y: number } = {
        [Position.Left]: { x: 2, y: 6 },
        [Position.Center]: { x: 6, y: 6 },
        [Position.Bottom]: { x: 6, y: 10 },
        [Position.Right]: { x: 10, y: 6 },
        [Position.Top]: { x: 6, y: 2 },
    }[position]

    const title = {
        [Position.Left]: "Align left",
        [Position.Center]: "Align center",
        [Position.Bottom]: "Align bottom",
        [Position.Right]: "Align right",
        [Position.Top]: "Align top",
    }[position]

    return <button onClick={setPosition} title={title} class={join(
        "flex-1 sm:flex-auto p-2 focus:outline-none focus:shadow-outline text-center transition-all duration-150 rounded",
        isSelected ? "bg-primary-base hover:bg-primary-dark text-gray-100 z-10" : "text-gray-700 hover:bg-gray-300",
        position == Position.Center && "rounded-l",
        position == Position.Right && "rounded-r",
    )} tabIndex={position == positionActual ? 0 : -1}>
        <svg class="inline w-6 h-6" viewBox="1 1 22 22" xmlns="http://www.w3.org/2000/svg">
            <rect fill="currentColor" stroke="none" rx="2" {...cData} width="12" height="12" />
            <rect fill="none" stroke="currentColor" rx="2" x="2" y="2" width="20" height="20" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
        </svg>
    </button>
}

function PaddingSlider() {
    // @ts-ignore
    const setPadding = (e: Event) => useStore.setState({ padding: PADDING_MAX - e.target.value })
    const padding = useStore(s => s.padding)

    const valInverse = PADDING_MAX - padding
    const maxInverse = PADDING_MAX - PADDING_MIN
    const minInverse = PADDING_MAX - PADDING_MAX

    return <div class="inline-flex flex-row space-x-2 text-primary-base">
        <svg class="w-6 h-6 transform scale-50" viewBox="2 2 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
        <input class="slider" type="range" min={minInverse} max={maxInverse} value={valInverse} onChange={setPadding} />
        <svg class="w-6 h-6" viewBox="2 2 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
    </div>
}

function ControlButton(props: Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'class' | 'children'> & { status: SaveState, children: JSX.Element }) {
    const { status, disabled, ...buttonProps } = props
    const isDisabled = disabled || status == SaveState.disabled || status == SaveState.loading
    return <button {...buttonProps} class="button" disabled={isDisabled}>
        {status == SaveState.error
            ? <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            : status == SaveState.success
                ? <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                : status == SaveState.loading
                    ? <svg class="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    : props.children
        }
    </button>
}
