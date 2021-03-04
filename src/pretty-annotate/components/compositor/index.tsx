import { h } from 'preact';
import { useCallback } from 'react';
import useMeasure from 'react-use-measure';
import DropZone from '../../../common/components/drop-zone';
import { OUTER_BORDER_RADIUS } from '../../../common/constants';
import useExport, { Exports } from '../../../common/hooks/use-export';
import { setWarningOnClose, useWarningOnClose } from '../../../common/hooks/use-misc';
import useRenderBorderRadius from '../../../common/hooks/use-round-corners';
import { ChildrenWithProps, ForegroundImage } from '../../../common/misc/types';
import { getRenderScale } from '../../../common/misc/utils';
import useOptionsStore from '../../stores/options';
import Editor, { Viewer } from './editor';
import logo from './title.svg';

/** Renders the main image composition preview component. */
export default function Compositor({ children }: ChildrenWithProps<Exports>) {

    const image = useOptionsStore(s => s.image)
    const setImage = useCallback((image: ForegroundImage) => useOptionsStore.setState({ image }), [])
    const [exportRef, download, copy] = useExport(image?.width ?? 0, image?.height ?? 0, () => setWarningOnClose(false))

    useWarningOnClose(!!image) // Assume they're editing if they've add an image
    const [editorRef, { width }] = useMeasure()
    const renderScale = getRenderScale(width, image?.width)

    const outerRadiusRender = useRenderBorderRadius(renderScale)

    return <div class="col w-full space-y-6">
        <section ref={editorRef} style={{ borderRadius: OUTER_BORDER_RADIUS }}
            class="max-w-screen-md block w-full mx-auto overflow-hidden shadow-md">
            {image
                ? <ViewerEditor />
                : <DropZone class="bg-blue-200 p-10 pb-0 rounded-t-lg" setImage={setImage}
                    title={<img src={logo} class="max-w-sm mx-auto -mb-1" />}
                    contentProps={{ "class": "bg-white rounded-t-lg" }} />}
        </section>

        {/** A hacky hidden element used by dom-to-image to render the image.
         * We do this so we can set the image size exactly and render consistently on different browsers. */}
        {image && <div class="hidden">
            <section ref={exportRef} class="relative overflow-hidden"
                style={{ width: image?.width, height: image?.height, borderRadius: outerRadiusRender }}>
                <Image />
                <Viewer scale={renderScale} />
            </section>
        </div>}

        {image && children({ download, copy })}
    </div>
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
