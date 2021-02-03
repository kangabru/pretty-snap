import { h } from 'preact';
import { join } from '../../../common/misc/utils';
import { Style } from '../../misc/types';
import useAnnotateStore from '../../stores/annotation';
import GenericAnnotation from '../annotations';
import { ClickPane } from './click-pane';
import { DragPane } from './drag-pane';

export default function Editor() {
    const style = useAnnotateStore(s => s.style)
    const useClick = style.type == Style.Counter
    return <section class={join("absolute inset-0", useClick ? "cursor-pointer" : "cursor-crosshair")}>
        {useClick ? <ClickEdits /> : <DragEdits />}
    </section>
}

function ClickEdits() {
    const style = useAnnotateStore(s => s.style)
    const addAnnotation = useAnnotateStore(s => s.addAnnotation)
    return <ClickPane onComplete={addAnnotation}
        onRender={pos => <GenericAnnotation {...style} {...pos} />} />
}

function DragEdits() {
    const style = useAnnotateStore(s => s.style)
    const addAnnotation = useAnnotateStore(s => s.addAnnotation)
    return <DragPane onComplete={addAnnotation}
        onRender={bounds => <GenericAnnotation {...style} {...bounds} />} />
}