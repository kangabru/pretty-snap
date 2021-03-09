import { Fragment, h } from 'preact';
import { useCallback } from 'react';
import { useSuperCommand } from '../../../common/hooks/use-misc';
import { Children } from '../../../common/misc/types';
import { join, textClass } from '../../../common/misc/utils';
import { useCurrentStyle } from '../../hooks/use-styles';
import { colors } from '../../misc/constants';
import { Shape, StyleOptions } from '../../misc/types';
import useAnnotateStore from '../../stores/annotation';
import { GetBracketPaths } from '../annotations/bracket';
import { AnnotateButton, AnnotateButtonSvg, ButtonWithModal } from './buttons';
import { Command } from './command';
import { ModalId, ModalUpdateChildNav } from './modal';

export default function ShapeButtonGroup({ command }: Command) {
    const [{ shape }, saveStyle] = useSetShape()

    useSuperCommand('V', useCallback(() => saveStyle(Shape.Mouse), [saveStyle]))
    useSuperCommand('T', useCallback(() => saveStyle(Shape.Text), [saveStyle]))

    return <ButtonWithModal modalId={ModalId.Shape} text="Shape" command={command} button={(active, open) => (
        <StyleButtonGeneric shape={shape} onClick={open} refocus={active} command={command} />
    )}>
        <StyleButtonGeneric shape={Shape.Mouse} command="V" />
        <StyleButtonGeneric shape={Shape.Box} command="1" />
        <StyleButtonGeneric shape={Shape.Ellipse} command="2" />
        <StyleButtonGeneric shape={Shape.Bracket} command="3" />
        <StyleButtonGeneric shape={Shape.Arrow} command="4" />
        <StyleButtonGeneric shape={Shape.Line} command="5" />
        <StyleButtonGeneric shape={Shape.Counter} command="6" />
        <StyleButtonGeneric shape={Shape.Text} command="T" />

        {/* Update the modal's child nav hook when the shape changes */}
        <ModalUpdateChildNav deps={[shape]} />
    </ButtonWithModal>
}

type StyleButtonProps = Command & { shape: Shape, onClick?: () => void, refocus?: boolean }

function StyleButtonGeneric(props: StyleButtonProps) {
    const { count } = useCurrentStyle()
    const { shape } = props

    return <>
        {shape === Shape.Mouse && <StyleButton {...props}>
            <path fill={colors.dark} fill-rule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clip-rule="evenodd" />
        </StyleButton>}

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

function StyleButton({ shape, text, onClick, refocus, command, children }: StyleButtonProps & Partial<Children> & { text?: string | number }) {
    const [style, save] = useSetShape()

    const selectedShape = style.shape
    const isTarget = shape === selectedShape
    const { color, useDarkText } = style.color

    const onSave = () => onClick ? onClick() : save(shape)

    return text
        ? <AnnotateButton data-target={isTarget} data-refocus={refocus} data-command={command} onClick={onSave} className="m-1">
            <span style={{ backgroundColor: color }} class={join(textClass(useDarkText),
                "w-8 h-8 rounded-full font-bold text-xl font-mono grid place-items-center")}>{text}</span>
        </AnnotateButton>
        : <AnnotateButtonSvg data-target={isTarget} data-refocus={refocus} data-command={command} style={{ color }}
            className="m-1" onClick={onSave}>{children}</AnnotateButtonSvg>
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

/** The shape tool uses global settings and styles because edits can only be done via the mouse shape tool.
 *  Other styles (like colour and shape style) differ as they will update based on the current annotation being edited.
 */
export function useSetShape(): [StyleOptions, (_: Shape) => void] {
    const style = useAnnotateStore(s => s.style)
    const saveStyle = (shape: Shape) => useAnnotateStore.setState({
        editId: undefined, // Shape changes cancel edits
        style: { ...style, shape },
    })
    return [style, saveStyle]
}
