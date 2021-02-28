import { h } from 'preact';
import { useCallback } from 'react';
import useMeasure from 'react-use-measure';
import DropZone from '../../../common/components/drop-zone';
import { setWarningOnClose, useWarningOnClose } from '../../../common/hooks/use-misc';
import useExport from '../../../common/hooks/use-export';
import { ForegroundImage } from '../../../common/misc/types';
import useOptionsStore from '../../stores/options';
import Controls from '../controls';
import Editor, { Viewer } from './editor';
import logo from './title.svg';

/** Renders the main image composition preview component. */
export default function Compositor() {

    const image = useOptionsStore(s => s.image)
    const setImage = useCallback((image: ForegroundImage) => useOptionsStore.setState({ image }), [])
    const [exportRef, download, copy] = useExport(image?.width ?? 0, image?.height ?? 0, () => setWarningOnClose(false))

    useWarningOnClose(!!image) // Assume they're editing if they've add an image
    const [editorRef, { width }] = useMeasure()
    const renderScale = image && width ? image?.width / width : 1

    return <main class="flex-1 px-4 space-y-6">
        <section ref={editorRef} class="block w-full max-w-screen-md mx-auto rounded-xl overflow-hidden shadow-md">
            {image
                ? <ViewerEditor />
                : <DropZone class="bg-blue-200 p-10 pb-0 rounded-t-lg" setImage={setImage}
                    title={<img src={logo} class="max-w-sm mx-auto -mb-1" />}
                    contentProps={{ "class": "bg-white rounded-t-lg" }} />}
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
