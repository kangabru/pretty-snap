import { h } from 'preact';
import { useCallback } from 'react';
import DropZone from '../../../common/components/drop-zone';
import ExportWrapper from '../../../common/components/export';
import { OUTER_BORDER_RADIUS } from '../../../common/constants';
import { Exports } from '../../../common/hooks/use-export';
import { setWarningOnClose, useWarningOnClose } from '../../../common/hooks/use-misc';
import { ChildrenWithProps, CssStyle, ForegroundImage } from '../../../common/misc/types';
import { Shape } from '../../misc/types';
import useAnnotateStore from '../../stores/annotation';
import useOptionsStore from '../../stores/options';
import Dragger from './dragger';
import Editor from './editor';
import logo from './title.svg';
import Viewer from './viewer';

/** Renders the main image composition preview component. */
export default function Compositor({ children }: ChildrenWithProps<Exports>) {

    // This is the user's imported image
    const image = useOptionsStore(s => s.image)
    const setImage = useCallback((image: ForegroundImage) => useOptionsStore.setState({ image }), [])

    // Assume they're editing if they've added an image but haven't exported it
    useWarningOnClose(!!image)
    const onExport = useCallback(() => setWarningOnClose(false), [])

    return <ExportWrapper onExport={onExport} exportWidth={image?.width} exportHeight={image?.width}

        // The visible component the user interacts with
        renderClient={
            ({ ref, download, copy }) => (
                <div class="col w-full space-y-6">

                    {/* The image compositor where the user imports an image and draws annotations */}
                    <section ref={ref} style={{ borderRadius: OUTER_BORDER_RADIUS }}
                        class="max-w-screen-md block w-full mx-auto overflow-hidden shadow-md">
                        {image
                            ? <ViewerEditor />
                            : <DropZone class="bg-blue-200 p-5 sm:p-10 pb-0 sm:pb-0 rounded-t-lg" setImage={setImage}
                                title={<img src={logo} class="max-w-sm mx-auto -mb-1" />}
                                contentProps={{ "class": "bg-white rounded-t-lg" }} />}
                    </section>

                    {/* Render controls like export buttons etc */}
                    {image && children({ download, copy })}
                </div>
            )}

        // An invisible component that will be exported as an image
        renderExport={
            ({ ref, width, height }) => (
                <div ref={ref as any}>
                    {/* Lock the image size otherwise it will scale on export */}
                    <Image style={{ width, height }} />
                    <Viewer />
                </div>
            )}
    />
}

/** This components displays the image and allows for users to draw and edit annotations. */
function ViewerEditor() {
    const editId = useAnnotateStore(s => s.editId)
    const isEditTool = useAnnotateStore(s => s.style.shape) === Shape.Mouse
    const isEditing = editId || isEditTool

    return <section class="relative">
        <Image />
        <Viewer hideEditing />
        {isEditing ? <Editor /> : <Dragger />}
    </section>
}

/** Renders the imported image rendered behind annotations */
function Image({ style }: CssStyle) {
    const image = useOptionsStore(s => s.image)
    return <img src={image?.src} class="w-full h-full" style={style} />
}
