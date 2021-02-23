import { h } from 'preact';
import { useCallback } from 'react';
import useMeasure from 'react-use-measure';
import useExport from '../../../common/hooks/use-export';
import { onInputChange, useImageDrop, useImagePaste } from '../../../common/hooks/use-import';
import { ForegroundImage } from '../../../common/misc/types';
import { join } from '../../../common/misc/utils';
import useOptionsStore from '../../stores/options';
import Controls from '../controls';
import Editor, { Viewer } from './editor';
import ImportDetails from './import';

/** Renders the main image composition preview component. */
export default function Compositor() {
    const image = useOptionsStore(s => s.image)
    const setImage = (image: ForegroundImage) => useOptionsStore.setState({ image })
    const [exportRef, download, copy] = useExport(image?.width || 1000, image?.height || 1000)
    const setImage = useCallback((image: ForegroundImage) => useOptionsStore.setState({ image }), [])

    useImagePaste(setImage)
    const [dropZone, isDropping, isError] = useImageDrop<HTMLDivElement>(setImage)

    const [editorRef, { width }] = useMeasure()
    const renderScale = image && width ? image?.width / width : 1


    return <main class="px-4 space-y-6">
        <section ref={editorRef} class="block w-full max-w-screen-md mx-auto rounded-xl overflow-hidden shadow-md">
            {image
                ? <ViewerEditor />
                : <div ref={dropZone} class={join("w-full", isDropping && "border-dashed border-4 rounded-xl")}>
                    <label class="cursor-pointer inline-block">
                        <input hidden type="file" accept="image/x-png,image/jpeg" onChange={onInputChange(setImage)} />
                        <ImportDetails {...{ isDropping, isError }} />
                    </label>
                </div>}
        </section>

        {/** A hacky hidden element used by dom-to-image to render the image.
         * We do this so we can set the image size exactly and render consistently on different browsers. */}
        {image && <div class="hidden">
            <section ref={exportRef} class="relative" style={{ width: image?.width, height: image?.height }}>
                <img src={image?.src} alt="Screenshot" />
                <Viewer scale={renderScale} />
            </section>
        </div>}

        <Controls {...{ download, copy }} />
    </main>
}

function ViewerEditor() {
    const image = useOptionsStore(s => s.image)
    return <div class="relative">
        <img src={image?.src} class="w-full h-full" />
        <Editor />
    </div>
}
