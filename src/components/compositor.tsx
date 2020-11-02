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
    const [dropZone, isDropping] = useImageDrop<HTMLDivElement>(setDataImage)

    const padding = useStore(s => s.padding)
    const srcBg = useStore(s => s.backgroundSrc)

    const settings = { dataImage, padding }
    const [_ref, download, downloadState] = useDownload(settings)
    const [ref, canCopy, copy, copyState] = useCopy(settings, _ref)

    const [refScreenOuter, stylesScreen, stylesRender] = useCompositionStyles(srcBg, dataImage)

    return <Fragment>

        {/* The compositor viewer */}
        <section ref={refScreenOuter} class={join(CLASSES_OUTER, "inline-block max-w-screen-lg rounded-xl overflow-hidden")} style={stylesScreen.outer}>
            {dataUrl ? <img src={dataUrl} alt="Screenshot" class={CLASSES_INNER} style={stylesScreen.inner} />
                : <div ref={dropZone} class="bg-white shadow h-64 rounded-lg p-5" style={stylesScreen.inner}>
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
            <section ref={ref} class={CLASSES_OUTER} style={stylesRender.outer}>
                <img src={dataImage.dataUrl} alt="Screenshot" class={CLASSES_INNER} style={stylesRender.inner} />
            </section>
        </div>}

        {/* Controls */}
        <div class="row justify-center w-full max-w-xl space-x-3 p-3 rounded-lg bg-white shadow-lg">

            <PositionButtonGroup />

            <PaddingSlider />

            <ControlButton onClick={copy} disabled={!canCopy} title={canCopy ? "Copy" : "This browser doesn't support image copy."} status={copyState}>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            </ControlButton>

            <ControlButton onClick={download} title="Download" status={downloadState}>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path></svg>
            </ControlButton>
        </div>
    </Fragment>
}

function PositionButtonGroup() {
    return <div class="inline-flex" role="group">
        <PositionButton position={Position.Center} />
        <PositionButton position={Position.Bottom} />
        <PositionButton position={Position.Left} />
        <PositionButton position={Position.Right} />
    </div>
}

function PositionButton(props: { position: Position }) {
    const { position } = props
    const positionActual = useStore(x => x.position)
    const setPosition = () => useStore.setState({ position: props.position })
    const isSelected = positionActual == position

    const cData: { cx: number, cy: number } = {
        [Position.Left]: { cx: 7, cy: 12 },
        [Position.Center]: { cx: 12, cy: 12 },
        [Position.Bottom]: { cx: 12, cy: 17 },
        [Position.Right]: { cx: 17, cy: 12 },
    }[position]

    const title = {
        [Position.Left]: "Left",
        [Position.Center]: "Center",
        [Position.Bottom]: "Bottom",
        [Position.Right]: "Right",
    }[position]

    return <button onClick={setPosition} title={title} class={join(
        "p-2 focus:outline-none focus:shadow-outline bg-gray-200",
        isSelected ? "bg-primary hover:opacity-75 text-white z-10" : "hover:bg-gray-400",
        position == Position.Center && "rounded-l",
        position == Position.Right && "rounded-r",
    )} tabIndex={position == positionActual ? 0 : -1}>
        <svg class="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle fill="currentColor" r="2.5" {...cData} />
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
    </button>
}

function PaddingSlider() {
    const padding = useStore(s => s.padding)
    const setPadding = (e: Event) => useStore.setState({ padding: e.target?.value })
    return <div class="inline-flex flex-row space-x-2 text-primary">
        <svg class="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
        <input class="slider" type="range" min={PADDING_MIN} max={PADDING_MAX} value={padding} onChange={setPadding} />
        <svg class="w-6 h-6 transform scale-50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
    </div>
}

function ControlButton(props: Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'class' | 'children'> & { status: SaveState, children: JSX.Element }) {
    const { status, disabled, ...buttonProps } = props
    const isDisabled = disabled || status == SaveState.disabled || status == SaveState.loading
    return <button {...buttonProps} class="pill" disabled={isDisabled}>
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
