import { h } from 'preact';
import { AnnotationAny } from '../../misc/types';
import useAnnotateStore from '../../stores/annotation';
import GenericAnnotation from '../annotations';

/** TODO */
export default function Viewer({ scale, hideEditing }: { scale?: number, hideEditing?: boolean }) {
    const ids = useAnnotateStore(s => s.ids)
    const editingId = useAnnotateStore(s => s.editId)

    return <section class="absolute inset-0 origin-top-left" style={{ transform: scale ? `scale(${scale})` : undefined }}>
        {ids.map(id => hideEditing && editingId === id ? null : <Annotation key={id} id={id} />)}
    </section>
}

function Annotation({ id }: { id: string }) {
    const editing = useAnnotateStore(s => !!s.editId)
    const annotation = useAnnotateStore(s => s.index[id] as AnnotationAny)
    return <GenericAnnotation id={id} {...annotation} allowEvents={!editing} />
}