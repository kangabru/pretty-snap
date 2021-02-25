import { h } from 'preact';
import { Children } from '../../../common/misc/types';
import { join, textClass } from '../../../common/misc/utils';
import { Shape } from '../../misc/types';
import useAnnotateStore from '../../stores/annotation';
import { GetBracketPaths } from '../annotations/bracket';
import { useSetStyle } from './hooks';
import { AnnotateButton, AnnotateButtonSvg } from './misc';

export default function ShapeButtonGroup() {
    const { style, setStyle } = useSetStyle()
    const { color: { color }, count } = style

    return <div class="flex justify-center space-x-3" style={{ color }}>
        <StyleButton shape={Shape.Box}>
            <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" fill='none' stroke-width="2.75" />
        </StyleButton>

        <StyleButton shape={Shape.Ellipse}>
            <circle cx="10" cy="10" r="8" stroke="currentColor" fill='none' stroke-width="2.75" />
        </StyleButton>

        <StyleButton shape={Shape.Bracket}><BracketIcon /></StyleButton>

        <StyleButton shape={Shape.Arrow}>
            <line x1="4" y1="4" x2="16" y2="16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" />
            <line x1="6" y1="16" x2="16" y2="16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" />
            <line x1="16" y1="6" x2="16" y2="16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" />
        </StyleButton>

        <StyleButton shape={Shape.Line}>
            <line x1="4" y1="4" x2="16" y2="16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" />
        </StyleButton>

        <AnnotateButtonSpan text={count ?? 1} onClick={setStyle({ shape: Shape.Counter })} />
        <AnnotateButtonSpan text="T" onClick={setStyle({ shape: Shape.Text })} />
    </div>
}

function AnnotateButtonSpan({ text, onClick }: { text: string | number, onClick: () => void }) {
    const { color: { color, useDarkText } } = useAnnotateStore(s => s.style)
    return <AnnotateButton onClick={onClick}>
        <span class={join("w-8 h-8 rounded-full font-bold text-xl font-mono grid place-items-center", textClass(useDarkText))} style={{ backgroundColor: color }}>{text}</span>
    </AnnotateButton>
}

function StyleButton({ shape, children }: Children & { shape: Shape }) {
    const setShape = () => {
        const style = useAnnotateStore.getState().style
        useAnnotateStore.setState({ style: { ...style, shape } })
    }
    return <AnnotateButtonSvg onClick={setShape}>{children}</AnnotateButtonSvg>
}

function BracketIcon() {

    // Define the bracket for a 20x20 box
    const padding = 3, rad = 3.5
    const span = (Math.sqrt(2 * 20 ** 2) - 2 * padding - 4 * rad) / 2
    const [d1, d2] = GetBracketPaths(rad, span)

    return <g style="transform: translateX(20px) translateY(20px) rotate(-135deg)">
        <g style={{ transform: `translateX(${padding}px) translateY(-1px)` }}
            stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" strokeLinejoin="round">
            <path d={d1} /><path d={d2} />
        </g>
    </g>
}