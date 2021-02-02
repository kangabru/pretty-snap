import { h } from 'preact';
import { Annotation, AnnotationItem } from '../../misc/types';
import useAnnotateStore from '../../stores/annotation';
import GenericAnnotation from '../annotations';

export default function Viewer() {
    const ids = useAnnotateStore(s => s.ids)
    return <section class="absolute inset-0">
        {ids.map(id => <Annotation id={id} />)}
    </section>
}

function Annotation({ id }: { id: string }) {
    const annotation = useAnnotateStore(s => s.index[id] as AnnotationItem<any>)
    return <GenericAnnotation {...annotation} />
}