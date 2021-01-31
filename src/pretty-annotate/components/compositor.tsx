import { Fragment, h } from 'preact';
import mergeRefs from 'react-merge-refs';
import { animated } from 'react-spring';
import NotSupportedWarning from '../../common/components/not-supported';
import { useCopy, useDownload } from '../../common/hooks/use-export';
import { onInputChange, useImageDrop, useImagePaste } from '../../common/hooks/use-import';
import { ForegroundImage } from '../../common/misc/types';
import { join } from '../../common/misc/utils';
import useAnnotateStore from '../../common/stores/options';

/** Renders the main image composition preview component. */
export default function Compositor() {
    // Get the ref used to export the final image
    const [ref1, ,] = useDownload()
    const [ref2, , ,] = useCopy()
    const ref = mergeRefs([ref1, ref2])

    const image = useAnnotateStore(s => s.image)
    const setImage = (image: ForegroundImage) => useAnnotateStore.setState({ image })

    useImagePaste(setImage)
    const [dropZone, isDropping, isError] = useImageDrop<HTMLDivElement>(setImage)

    return <>
        {/* Renders the preview */}
        <section class="mx-4 inline-block max max-w-screen-lg rounded-xl overflow-hidden shadow-md">
            <div ref={dropZone} class={join("w-full", isDropping && "border-dashed border-4 rounded-xl")}>
                <label class="cursor-pointer">
                    <input hidden type="file" accept="image/x-png,image/jpeg" onChange={onInputChange(setImage)} />
                    {image?.src ? <animated.img src={image?.src} alt="Screenshot" />
                        : <animated.div className={join("p-4 sm:py-8 sm:px-12 space-y-5 bg-white")}>
                            <ImportDetails {...{ isDropping, isError }} />
                        </animated.div>}
                </label>
            </div>
        </section>

        {/** A hacky hidden element used by dom-to-image to render the image.
         * We do this so we can set the image size exactly and render consistently on different browsers. */}
        {image && <div class="hidden">
            <section ref={ref}>
                <img src={image.src} alt="Screenshot" />
            </section>
        </div>}

        <NotSupportedWarning />
    </>
}

/** Renders the initial info section within the compositor before the user has selected an image. */
function ImportDetails({ isDropping, isError }: { isDropping: boolean, isError: boolean }) {
    return <>
        <h2 class="max-w-sm mx-auto space-x-1 text-xl sm:text-3xl text-center font-open font-semibold select-none">
            Annotate screenshots right in your browser
        </h2>
        <div class={join("w-full py-4 px-6 space-y-2 text-base text-center sm:text-lg rounded-3xl border-4 select-none",
            isDropping ? "border-solid" : "border-dashed",
            isError ? "border-red-500" : "border-gray-400")}>
            <p class="font-semibold text-lg sm:text-2xl">Get started</p>
            {isError
                ? <p class="text-red-400 font-semibold">Please use an image file!</p>
                : <p class="max-w-sm mx-auto"><b>Add a snapshot:</b> click here, paste from clipboard, or drop an image</p>}
        </div>
    </>
}
