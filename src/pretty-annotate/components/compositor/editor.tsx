import { h } from 'preact';
import { join } from '../../../common/misc/utils';
import { AnnotationAny, Bounds, Style, StyleOptions } from '../../misc/types';
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
    const save = useAnnotateStore(s => s.saveAnnotation)
    return <ClickPane onComplete={save as any}
        onRender={pos => <GenericAnnotation {...style} {...pos} />} />
}

function DragEdits() {
    const style = useAnnotateStore(s => s.style)
    const save = useAnnotateStore(s => s.saveAnnotation)
    return <DragPane
        onComplete={bounds => { save(BoundsToData(style, bounds)) }}
        onRender={bounds => <GenericAnnotation {...style} {...BoundsToData(style, bounds)} />} />
}

function BoundsToData(options: StyleOptions, bounds: Bounds): AnnotationAny {
    const { left: _left, top: _top, width, height, negX, negY } = bounds
    const left = _left + (negX ? 0 : width)
    const top = _top + (negY ? 0 : height)

    switch (options.type) {
        case Style.Text:
        case Style.Counter:
            return { ...options, left, top }
        default:
            return { ...options, ...bounds }
    }
}
