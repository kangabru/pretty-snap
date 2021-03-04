import { Fragment, h } from 'preact';
import { Children } from '../../../common/misc/types';
import { join, textClass } from '../../../common/misc/utils';
import { useSetStyle } from '../../hooks/use-styles';
import { Shape } from '../../misc/types';
import useAnnotateStore from '../../stores/annotation';
import { GetBracketPaths } from '../annotations/bracket';
import { AnnotateButton, AnnotateButtonSvg, ButtonWithModal } from './buttons';
import { ModalId, ModalUpdateChildNav } from './modal';

export default function ShapeButtonGroup() {
    const { shape } = useSetStyle().style
    return <ButtonWithModal modalId={ModalId.Shape} text="Shape" button={(active, open) => (
        <StyleButtonGeneric shape={shape} onClick={open} refocus={active} />
    )}>
        <StyleButtonGeneric shape={Shape.Box} />
        <StyleButtonGeneric shape={Shape.Ellipse} />
        <StyleButtonGeneric shape={Shape.Bracket} />
        <StyleButtonGeneric shape={Shape.Arrow} />
        <StyleButtonGeneric shape={Shape.Line} />
        <StyleButtonGeneric shape={Shape.Counter} />
        <StyleButtonGeneric shape={Shape.Text} />

        {/* Update the modal's child nav hook when the shape changes */}
        <ModalUpdateChildNav deps={[shape]} />
    </ButtonWithModal>
}

type StyleButtonProps = { shape: Shape, onClick?: () => void, refocus?: boolean }

function StyleButtonGeneric(props: StyleButtonProps) {
    const { count } = useSetStyle().style
    const { shape } = props

    return <>
        {shape === Shape.Box && <StyleButton {...props}>
            <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" fill='none' stroke-width="2.75" />
        </StyleButton>}

        {shape === Shape.Ellipse && <StyleButton {...props}>
            <circle cx="10" cy="10" r="8" stroke="currentColor" fill='none' stroke-width="2.75" />
        </StyleButton>}

        {shape === Shape.Bracket && <StyleButton {...props}><BracketIcon /></StyleButton>}

        {shape === Shape.Arrow && <StyleButton {...props}>
            <line x1="4" y1="4" x2="16" y2="16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" />
            <line x1="6" y1="16" x2="16" y2="16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" />
            <line x1="16" y1="6" x2="16" y2="16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" />
        </StyleButton>}

        {shape === Shape.Line && <StyleButton {...props}>
            <line x1="4" y1="4" x2="16" y2="16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" />
        </StyleButton>}

        {shape === Shape.Counter && <StyleButton {...props} text={count ?? 1} />}

        {shape === Shape.Text && <StyleButton {...props} text="T" />}
    </>
}

function StyleButton({ shape, text, onClick, refocus, children }: StyleButtonProps & Partial<Children> & { text?: string | number }) {

    const { style, setStyle } = useSetStyle()
    const setShape = () => setStyle({ shape })
    const { color, useDarkText } = style.color

    const selectedShape = useAnnotateStore(s => s.style.shape)
    const isTarget = shape === selectedShape

    return text
        ? <AnnotateButton data-target={isTarget} data-refocus={refocus} onClick={onClick ?? setShape} className="m-1">
            <span style={{ backgroundColor: color }}
                class={join(textClass(useDarkText), "w-8 h-8 rounded-full font-bold text-xl font-mono grid place-items-center")}>
                {text}
            </span>
        </AnnotateButton>
        : <AnnotateButtonSvg data-target={isTarget} data-refocus={refocus} style={{ color }} className="m-1"
            onClick={onClick ?? setShape}>{children}</AnnotateButtonSvg>
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