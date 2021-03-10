import { h } from 'preact';
import { SelectableAreaProps } from '.';
import useDevMode from '../../../common/hooks/use-dev-mode';
import { textClass, join, remToPixels } from '../../../common/misc/utils';
import { Shape, Annotation, Bounds } from '../../misc/types';

const SIZE = remToPixels(2)
const OFFSET = remToPixels(1.5) // offset so the mouse doesn't cover the number

export default function Counter({ count, left, top, color: { color, useDarkText } }: Annotation<Shape.Counter>) {
    return <div style={{ left, top, backgroundColor: color, width: SIZE, height: SIZE, transform: `translateX(-${OFFSET}px) translateY(-${OFFSET}px)` }}
        class={join(textClass(useDarkText), "absolute rounded-full font-bold text-xl font-mono grid place-items-center select-none")}>
        {count}
    </div>
}

export function CounterSelectableArea({ annotation, events, class: cls }: SelectableAreaProps) {
    const { left, top } = annotation as Bounds
    const isDevMode = useDevMode()
    const diameter = SIZE * 1.5, radius = diameter / 2
    const offset = radius + OFFSET - SIZE / 2 // perfectly center the area over the counter

    return <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
        class={join("absolute", isDevMode ? "opacity-30" : "opacity-0")}
        style={{ left: left - offset, top: top - offset }} width={diameter} height={diameter}>
        <circle cx={radius} cy={radius} r={radius} {...events} class={join("cursor-pointer", cls)} />
    </svg>
}
