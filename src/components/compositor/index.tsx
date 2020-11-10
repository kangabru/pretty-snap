import { Fragment, h } from 'preact';
import mergeRefs from 'react-merge-refs';
import { Foreground } from '../../types';
import useOptionsStore from '../stores/options';
import { join } from '../utils';
import Controls from './controls';
import useCompositionStyles, { CLASSES_INNER, CLASSES_OUTER_IMAGE, CLASSES_OUTER_PATTERN } from './use-styles';
import { useCopy, useDownload } from './use-export';
import { onInputChange, useImageDrop, useImagePaste } from './use-upload';

/** Renders the main image composition preview component. */
export default function Compositor() {
    // Get the ref used to export the final image
    const [ref1, download, downloadState] = useDownload()
    const [ref2, canCopy, copy, copyState] = useCopy()
    const ref = mergeRefs([ref1, ref2])

    // Handle foreground inputs
    const image = useOptionsStore(s => s.backgroundImage)
    const pattern = useOptionsStore(s => s.backgroundPattern)
    const foreground = useOptionsStore(s => s.foreground)
    const setForeground = (foreground: Foreground) => useOptionsStore.setState({ foreground })

    useImagePaste(setForeground)
    const [dropZone, isDropping, isError] = useImageDrop<HTMLDivElement>(setForeground)

    // Get the styles for the preview and hidden render components
    const [refPreviewContainer, stylesScreen, stylesRender] = useCompositionStyles()

    const backgroundClasses = image ? CLASSES_OUTER_IMAGE : join(CLASSES_OUTER_PATTERN, pattern?.bgColour)

    return <Fragment>
        {/* Renders the preview */}
        <section ref={refPreviewContainer} class={join(backgroundClasses, "mx-4 inline-block max max-w-screen-lg rounded-xl overflow-hidden shadow-md")} style={stylesScreen.outer as any}>
            <div ref={dropZone} class={join("w-full", isDropping && "border-dashed border-4 rounded-xl")}>
                <label class="cursor-pointer">
                    <input hidden type="file" accept="image/x-png,image/jpeg" onChange={onInputChange(setForeground)} />
                    {foreground?.src ? <img src={foreground?.src} alt="Screenshot" class={CLASSES_INNER} style={stylesScreen.inner as any} />
                        : <div class={join(CLASSES_INNER, "p-4 sm:py-8 sm:px-12 space-y-5 bg-white")} style={stylesScreen.inner as any}>
                            <InfoSection {...{ isDropping, isError }} />
                        </div>}
                </label>
            </div>
        </section>

        {/** A hacky hidden element used by dom-to-image to render the image.
         * We do this so we can set the image size exactly and render consistently on different browsers. */}
        {foreground && <div class="hidden">
            <section ref={ref} class={backgroundClasses} style={stylesRender.outer as any}>
                <img src={foreground.src} alt="Screenshot" class={CLASSES_INNER} style={stylesRender.inner as any} />
            </section>
        </div>}

        <Controls {...{ download, downloadState, canCopy, copy, copyState }} />
    </Fragment>
}

/** Renders the initial info section within the compositor before the user has selected an image. */
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
