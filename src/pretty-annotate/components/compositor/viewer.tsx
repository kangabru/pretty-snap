import { h } from 'preact';
import useAnnotateStore from '../../stores/annotation';
import { Box } from '../annotations/box';

export default function Viewer() {
    const ids = useAnnotateStore(s => s.annotationIds)
    return <section class="absolute inset-0">
        {ids.map(id => <Annotation id={id} />)}
    </section>
}

function Annotation(props: { id: string }) {
    const annotation = useAnnotateStore(s => s.annotationIndex[props.id])
    console.log(annotation);

    return <Box {...annotation.data} />
}