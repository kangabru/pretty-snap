import { h } from 'preact';
import useAnnotateStore from '../../stores/annotation';
import { DashedBox } from '../annotations/box';
import { Dragger } from './resizer';

export default function Editor() {
    const addAnnotation = useAnnotateStore(s => s.addAnnotation)
    return <section class="absolute inset-0 cursor-crosshair">
        <Dragger
            onComplete={addAnnotation}
            render={dims => <DashedBox {...dims} />} />
    </section>
}
