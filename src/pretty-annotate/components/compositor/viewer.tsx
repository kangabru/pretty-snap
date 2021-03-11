import { h } from 'preact';
import { useCallback } from 'preact/hooks';
import { AnnotationAny } from '../../misc/types';
import useAnnotateStore from '../../stores/annotation';
import GenericAnnotation from '../annotations';

/** Renders all annotations saved to the global store.
 * @param hideEditing - Set to true to hide the currently selected annotation (e.g. to display custom edits not yet saved to store)
 */
export default function Viewer({ scale, hideEditing }: { scale?: number, hideEditing?: boolean }) {
    const ids = useAnnotateStore(s => s.ids)
    const editingId = useAnnotateStore(s => s.editId)

    return <section class="absolute inset-0 origin-top-left" style={{ transform: scale ? `scale(${scale})` : undefined }}>
        {ids.map(id => hideEditing && editingId === id ? null : <Annotation key={id} id={id} />)}
    </section>
}

function Annotation({ id }: { id: string }) {
    const editing = useAnnotateStore(s => !!s.editId)
    const annotation = useAnnotateStore(useCallback(s => s.index[id], [id])) as AnnotationAny
    return <GenericAnnotation id={id} {...annotation} allowEvents={!editing} />
}