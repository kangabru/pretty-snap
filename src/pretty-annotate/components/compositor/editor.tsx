import { h } from 'preact';
import { join } from '../../../common/misc/utils';
import { Style } from '../../misc/types';
import useAnnotateStore from '../../stores/annotation';
import GenericAnnotation from '../annotations';
import { ClickPane } from './click-pane';
import { DragPane } from './drag-pane';

export default function Editor() {
    const style = useAnnotateStore(s => s.style)
    const useClick = style == Style.Counter
    return <section class={join("absolute inset-0", useClick ? "cursor-pointer" : "cursor-crosshair")}>
        {useClick ? <ClickEdits /> : <DragEdits />}
    </section>
}

function ClickEdits() {
    const style = Style.Counter
    const count = useAnnotateStore(s => s.count)
    const addAnnotation = useAnnotateStore(s => s.addAnnotation)
    return <ClickPane
        onComplete={pos => addAnnotation({ style, data: { ...pos, count } })}
        onRender={pos => <GenericAnnotation style={style} data={{ ...pos, count }} />} />
}

function DragEdits() {
    const style = useAnnotateStore(s => s.style)
    const options = useAnnotateStore(s => s.styleOptions)
    const addAnnotation = useAnnotateStore(s => s.addAnnotation)
    return <DragPane
        onComplete={bounds => addAnnotation({ style, data: { ...bounds, ...options } })}
        onRender={bounds => <GenericAnnotation style={style} data={{ ...bounds, ...options }} />} />
}