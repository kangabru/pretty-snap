import { h } from 'preact';
import { Style, Annotation } from '../../misc/types';

export default function Counter({ count, colour, ...rest }: Annotation<Style.Counter>) {
    const left = rest.left
    const top = rest.top
    return <div style={{ left, top, backgroundColor: colour }}
        class="absolute bg-black w-8 h-8 rounded-full text-white font-bold text-xl font-mono grid place-items-center select-none transform -translate-x-6 -translate-y-6">
        {count}
    </div>
}
