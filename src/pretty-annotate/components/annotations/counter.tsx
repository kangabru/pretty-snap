import { h } from 'preact';
import { textClass, join } from '../../../common/misc/utils';
import { Shape, Annotation } from '../../misc/types';

export default function Counter({ count, left, top, color: { color, useDarkText } }: Annotation<Shape.Counter>) {
    return <div style={{ left, top, backgroundColor: color }}
        class={join(textClass(useDarkText), "absolute w-8 h-8 rounded-full font-bold text-xl font-mono grid place-items-center select-none transform -translate-x-6 -translate-y-6")}>
        {count}
    </div>
}
