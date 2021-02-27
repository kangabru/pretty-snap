import { h } from 'preact';
import { useCallback } from 'react';
import useMeasure from 'react-use-measure';
import ImportDetails from '../../../common/components/import-info';
import { setWarningOnClose, useWarningOnClose } from '../../../common/hooks/misc';
import useExport from '../../../common/hooks/use-export';
import { onInputChange, useImageDrop, useImagePaste } from '../../../common/hooks/use-import';
import { ForegroundImage } from '../../../common/misc/types';
import useOptionsStore from '../../stores/options';
import Controls from '../controls';
import Editor, { Viewer } from './editor';
import logo from './title.svg';

/** Renders the main image composition preview component. */
export default function Compositor() {
    const image = useOptionsStore(s => s.image)
    useWarningOnClose(!!image) // Assume they're editing if they've add an image

    const setImage = useCallback((image: ForegroundImage) => useOptionsStore.setState({ image }), [])
    const [exportRef, download, copy] = useExport(image?.width ?? 0, image?.height ?? 0, () => setWarningOnClose(false))

    useImagePaste(setImage)
    const [dropZone, isDropping, isError] = useImageDrop<HTMLDivElement>(setImage)

    const [editorRef, { width }] = useMeasure()
    const renderScale = image && width ? image?.width / width : 1

    return <main class="flex-1 px-4 space-y-6">
        <section ref={editorRef} class="block w-full max-w-screen-md mx-auto rounded-xl overflow-hidden shadow-md">
            {image
                ? <ViewerEditor />
                : <div ref={dropZone} class="w-full bg-blue-200 p-10 pb-0">
                    <label class="cursor-pointer block bg-white rounded-t-lg overflow-hidden shadow-lg">
                        <input hidden type="file" accept="image/x-png,image/jpeg" onChange={onInputChange(setImage)} />
                        <ImportDetails {...{ isDropping, isError, setImage }} title={<img src={logo} class="max-w-sm mx-auto -mb-1" />} />
                    </label>
                </div>}
        </section>

        {/** A hacky hidden element used by dom-to-image to render the image.
         * We do this so we can set the image size exactly and render consistently on different browsers. */}
        {image && <div class="hidden">
            <section ref={exportRef} class="relative" style={{ width: image?.width, height: image?.height }}>
                <Image />
                <Viewer scale={renderScale} />
            </section>
        </div>}

        {image && <Controls {...{ download, copy }} />}
    </main>
}

function ViewerEditor() {
    return <div class="relative">
        <Image />
        <Editor />
    </div>
}

function Image() {
    const image = useOptionsStore(s => s.image)
    return <img src={image?.src} class="w-full h-full" />
}
