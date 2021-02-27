import { Fragment, h } from 'preact';
import { Children } from '../../../common/misc/types';
import { join, textClass } from '../../../common/misc/utils';
import { Shape } from '../../misc/types';
import useAnnotateStore from '../../stores/annotation';
import { GetBracketPaths } from '../annotations/bracket';
import { useSetStyle } from '../../hooks/styles';
import { AnnotateButton, AnnotateButtonSvg, ButtonWithModal } from './buttons';

export default function ShapeButtonGroup({ text }: { text: string }) {
    const { color: { color }, shape } = useSetStyle().style
    return <ButtonWithModal text={text} style={{ color }} button={open => <StyleButtonGeneric shape={shape} onClick={open} />}>
        <StyleButtonGeneric shape={Shape.Box} />
        <StyleButtonGeneric shape={Shape.Ellipse} />
        <StyleButtonGeneric shape={Shape.Bracket} />
        <StyleButtonGeneric shape={Shape.Arrow} />
        <StyleButtonGeneric shape={Shape.Line} />
        <StyleButtonGeneric shape={Shape.Counter} />
        <StyleButtonGeneric shape={Shape.Text} />
    </ButtonWithModal>
}

function AnnotateButtonSpan({ text, onClick }: { text: string | number, onClick: () => void }) {
    const { color: { color, useDarkText } } = useAnnotateStore(s => s.style)
    return <AnnotateButton onClick={onClick}>
        <span class={join("w-8 h-8 rounded-full font-bold text-xl font-mono grid place-items-center", textClass(useDarkText))} style={{ backgroundColor: color }}>{text}</span>
    </AnnotateButton>
}

function StyleButtonGeneric(props: { shape: Shape, onClick?: () => void }) {
    const { shape, onClick } = props
    const { style, setStyle } = useSetStyle()
    const { count } = style

    return <>
        {shape === Shape.Box && <StyleButton {...props}>
            <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" fill='none' stroke-width="2.75" />
        </StyleButton>}

        {shape === Shape.Ellipse && <StyleButton  {...props}>
            <circle cx="10" cy="10" r="8" stroke="currentColor" fill='none' stroke-width="2.75" />
        </StyleButton>}

        {shape === Shape.Bracket && <StyleButton  {...props}><BracketIcon /></StyleButton>}

        {shape === Shape.Arrow && <StyleButton  {...props}>
            <line x1="4" y1="4" x2="16" y2="16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" />
            <line x1="6" y1="16" x2="16" y2="16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" />
            <line x1="16" y1="6" x2="16" y2="16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" />
        </StyleButton>}

        {shape === Shape.Line && <StyleButton  {...props}>
            <line x1="4" y1="4" x2="16" y2="16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" />
        </StyleButton>}

        {shape === Shape.Counter && <AnnotateButtonSpan text={count ?? 1}
            onClick={onClick ?? setStyle({ shape: Shape.Counter })} />}

        {shape === Shape.Text && <AnnotateButtonSpan text="T"
            onClick={onClick ?? setStyle({ shape: Shape.Text })} />}
    </>
}

function StyleButton({ shape, onClick, children }: Children & { shape: Shape, onClick?: () => void }) {
    const setShape = () => {
        const style = useAnnotateStore.getState().style
        useAnnotateStore.setState({ style: { ...style, shape } })
    }
    return <AnnotateButtonSvg onClick={onClick ?? setShape}>{children}</AnnotateButtonSvg>
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