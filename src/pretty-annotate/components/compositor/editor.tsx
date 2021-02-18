import { h } from 'preact';
import { join } from '../../../common/misc/utils';
import { Annotation, AnnotationAny, Bounds, Style, StyleOptions } from '../../misc/types';
import useAnnotateStore from '../../stores/annotation';
import GenericAnnotation from '../annotations';
import { DragPane } from './drag-pane';

const clickTypes = new Set([Style.Counter, Style.Text])

export default function Editor() {
    return <section class="absolute inset-0">
        <EditorPane />
        <Viewer />
    </section>
}

export function Viewer({ scale }: { scale?: number }) {
    const ids = useAnnotateStore(s => s.ids)
    return <section class="absolute inset-0 pointer-events-none origin-top-left" style={{ transform: scale ? `scale(${scale})` : undefined }}>
        {ids.map(id => <Annotation key={id} id={id} />)}
    </section>
}

function Annotation({ id }: { id: string }) {
    const editing = useAnnotateStore(s => !!s.idEditing)
    const annotation = useAnnotateStore(s => s.index[id] as AnnotationAny)
    return <GenericAnnotation id={id} {...annotation} allowEvents={!editing} />
}

function EditorPane() {
    const style = useAnnotateStore(s => s.style)
    const useClick = clickTypes.has(style.type)
    return <section class={join("absolute inset-0", useClick ? "cursor-pointer" : "cursor-crosshair")}>
        <DragEdits />
    </section>
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
