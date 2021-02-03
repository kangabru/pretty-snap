import React from 'react';
import { Annotation, AnnotationAny } from '../../misc/types';
import useAnnotateStore from '../../stores/annotation';
import GenericAnnotation from '../annotations';

export default function Viewer() {
    const ids = useAnnotateStore(s => s.ids)
    return <section className="absolute inset-0">
        {ids.map(id => <Annotation id={id} />)}
    </section>
}

function Annotation({ id }: { id: string }) {
    const annotation = useAnnotateStore(s => s.index[id] as AnnotationAny)
    return <GenericAnnotation {...annotation} />
}
