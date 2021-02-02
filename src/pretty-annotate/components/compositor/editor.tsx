import { h } from 'preact';
import useAnnotateStore from '../../stores/annotation';
import GenericAnnotation from '../annotations';
import { Dragger } from './resizer';

export default function Editor() {
    const style = useAnnotateStore(s => s.style)
    const options = useAnnotateStore(s => s.styleOptions)
    const addAnnotation = useAnnotateStore(s => s.addAnnotation)
    return <section class="absolute inset-0 cursor-crosshair">
        <Dragger
            onComplete={bounds => addAnnotation({ style, data: { ...bounds, ...options } })}
            render={bounds => <GenericAnnotation style={style} data={{ ...bounds, ...options }} />} />
    </section>
}
