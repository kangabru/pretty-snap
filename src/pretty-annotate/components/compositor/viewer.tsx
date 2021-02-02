import { h } from 'preact';
import useAnnotateStore from '../../stores/annotation';
import { Box } from '../annotations/box';

export default function Viewer() {
    const ids = useAnnotateStore(s => s.ids)
    return <section class="absolute inset-0">
        {ids.map(id => <Annotation id={id} />)}
    </section>
}

function Annotation(props: { id: string }) {
    const annotation = useAnnotateStore(s => s.index[props.id])
    console.log(annotation);

    return <Box {...annotation.data} />
}