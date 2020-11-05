import { Fragment, h, Ref } from 'preact';
import { forwardRef } from 'preact/compat';
import { StateUpdater, useState } from 'preact/hooks';
import { Foreground } from '../../types';
import { Settings, useCopy, useDownload } from '../hooks/canvas';
import { onInputChange, useImageDrop, useImagePaste } from '../hooks/upload';
import useOptionsStore from '../stores/options';
import { join } from '../utils';
import Controls from './controls';
import useCompositionStyles, { CLASSES_INNER, CLASSES_OUTER } from './styles';

export default function Compositor() {
    const [foreground, setForeground] = useState<Foreground | undefined>(undefined)

    const padding = useOptionsStore(s => s.padding)
    const position = useOptionsStore(s => s.position)
    const settings: Settings = { foreground, padding, position }

    const [_ref, download, downloadState] = useDownload(settings)
    const [ref, canCopy, copy, copyState] = useCopy(settings, _ref)

    const ViewerWrap = forwardRef<HTMLElement, ViewerProps>(Viewer)

    return <Fragment>
        <ViewerWrap {...{ foreground, setForeground }} ref={ref} />
        <Controls {...{ canCopy, copy, copyState, download, downloadState }} />
    </Fragment>
}

type ViewerProps = { foreground: Foreground | undefined, setForeground: StateUpdater<Foreground | undefined> }
function Viewer({ foreground, setForeground }: ViewerProps, ref: Ref<HTMLElement>) {
    const dataUrl = foreground?.src

    useImagePaste(setForeground)
    const [dropZone, isDropping, isError] = useImageDrop<HTMLDivElement>(setForeground)

    const [refScreenOuter, stylesScreen, stylesRender] = useCompositionStyles(foreground)

    return <Fragment>
        <section ref={refScreenOuter} class={join(CLASSES_OUTER, "mx-4 inline-block max max-w-screen-lg rounded-xl overflow-hidden shadow-md")} style={stylesScreen.outer as any}>
            <div ref={dropZone} class={join("w-full", isDropping && "border-dashed border-4 rounded-xl")}>
                <label class="cursor-pointer">
                    <input hidden type="file" accept="image/x-png,image/jpeg" onChange={onInputChange(setForeground)} />
                    {dataUrl ? <img src={dataUrl} alt="Screenshot" class={CLASSES_INNER} style={stylesScreen.inner as any} />
                        : <div class={join(CLASSES_INNER, "p-4 sm:py-8 sm:px-12 space-y-5 bg-white")} style={stylesScreen.inner as any}>
                            <InfoSection {...{ isDropping, isError }} />
                        </div>}
                </label>
            </div>
        </section>

        {/* A hacky hidden element used to render consistent on different browsers. */}
        {foreground && <div class="hidden">
            <section ref={ref} class={CLASSES_OUTER} style={stylesRender.outer as any}>
                <img src={foreground.src} alt="Screenshot" class={CLASSES_INNER} style={stylesRender.inner as any} />
            </section>
        </div>}
    </Fragment>
}

function InfoSection({ isDropping, isError }: { isDropping: boolean, isError: boolean }) {
    return <Fragment>
        <h2 class="max-w-sm mx-auto space-x-1 text-xl sm:text-3xl text-center font-open font-semibold">
            Make snapshots look
            <svg class="inline w-6 h-6 sm:w-10 sm:h-10 mx-1 text-orange-500" fill="currentColor" viewBox="0 1 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"></path></svg>
            with a pretty background
        </h2>
        <div class={join("w-full py-4 px-6 space-y-2 text-base text-center sm:text-lg rounded-3xl border-4",
            isDropping ? "border-solid" : "border-dashed",
            isError ? "border-red-500" : "border-gray-400")}>
            <p class="font-semibold text-lg sm:text-2xl">Get started</p>
            {isError
                ? <p class="text-red-400 font-semibold">Please use an image file!</p>
                : <p class="max-w-sm mx-auto"><b>Add a snapshot:</b> click here, paste from clipboard, or drop an image</p>}
        </div>
    </Fragment>
}
