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

    const image = useOptionsStore(s => s.image)
    const setImage = useCallback((image: ForegroundImage) => useOptionsStore.setState({ image }), [])
    const onExport = useCallback(() => setWarningOnClose(false), [])

    useWarningOnClose(!!image) // Assume they're editing if they've add an image

    return <ExportWrapper exportWidth={image?.width} exportHeight={image?.width} onExport={onExport}

        renderClient={
            ({ ref, download, copy }) => (
                <div class="col w-full space-y-6">
                    <section ref={ref} style={{ borderRadius: OUTER_BORDER_RADIUS }}
                        class="max-w-screen-md block w-full mx-auto overflow-hidden shadow-md">
                        {image
                            ? <ViewerEditor />
                            : <DropZone class="bg-blue-200 p-5 sm:p-10 pb-0 sm:pb-0 rounded-t-lg" setImage={setImage}
                                title={<img src={logo} class="max-w-sm mx-auto -mb-1" />}
                                contentProps={{ "class": "bg-white rounded-t-lg" }} />}
                    </section>

                    {image && children({ download, copy })}
                </div>
            )}

        renderExport={
            ({ ref, width, height }) => (
                <div ref={ref as any}>
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

function Image({ style }: CssStyle) {
    const image = useOptionsStore(s => s.image)
    return <img src={image?.src} class="w-full h-full" style={style} />
}
