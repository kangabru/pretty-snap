import { Fragment, h } from 'preact';
import { Children } from '../../../common/misc/types';
import { useSetStyle } from '../../hooks/use-styles';
import { Shape, ShapeStyle, SupportedStyle, supportedStyles } from '../../misc/types';
import { AnnotateButtonSvg, ButtonWithModal } from './buttons';
import { Command } from './command';
import { ModalId, ModalUpdateChildNav } from './modal';

export default function ShapeStyleButtonGroup({ command }: Command) {
    const { shape, shapeStyle } = useSetStyle().style
    const { canUseFill, canUseLine } = supportedStyles[shape] ?? {} as SupportedStyle

    return <ButtonWithModal modalId={ModalId.ShapeStyle} text="Style" command={command} button={(active, open) => (
        <CurrentShape onClick={open} refocus={active} command={command} />
    )}>
        {canUseLine && <>
            <ShapeStyleButtonGeneric shapeStyle={ShapeStyle.Outline} command="1" />
            <ShapeStyleButtonGeneric shapeStyle={ShapeStyle.OutlineDashed} command="2" />
        </>}
        {canUseFill && <>
            <ShapeStyleButtonGeneric shapeStyle={ShapeStyle.Solid} command="3" />
            <ShapeStyleButtonGeneric shapeStyle={ShapeStyle.Transparent} command="4" />
        </>}

        {/* Update the modal's child nav hook when the shape style changes */}
        <ModalUpdateChildNav deps={[shape, shapeStyle]} />
    </ButtonWithModal>
}

function CurrentShape(props: Pick<ShapeStyleButtonProps, 'onClick' | 'refocus' | 'command'>) {
    const { shape, shapeStyle } = useSetStyle().style
    const { canUseFill, canUseLine } = supportedStyles[shape] ?? {} as SupportedStyle
    const _shapeStyle = getRealShape(shape, shapeStyle)
    return <ShapeStyleButtonGeneric {...props} disabled={!(canUseFill || canUseLine)} shapeStyle={_shapeStyle} />
}

function getRealShape(shape: Shape, shapeStyle: ShapeStyle): ShapeStyle {
    const { canUseFill } = supportedStyles[shape] ?? {} as SupportedStyle
    return !canUseFill && (shapeStyle == ShapeStyle.Solid || shapeStyle == ShapeStyle.Transparent) ? ShapeStyle.Outline : shapeStyle
}

type ShapeStyleButtonProps = Command & { shapeStyle: ShapeStyle, onClick?: () => void, disabled?: boolean, refocus?: boolean }

function ShapeStyleButtonGeneric(props: ShapeStyleButtonProps) {
    const { shapeStyle } = props
    return <>
        {shapeStyle === ShapeStyle.Outline && <ShapeStyleButton {...props}>
            <path d="m4,4 C 10,5 10,15 16,16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" />
        </ShapeStyleButton>}

        {shapeStyle === ShapeStyle.OutlineDashed && <ShapeStyleButton {...props}>
            <path d="m4,4 C 10,5 10,15 16,16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" stroke-dasharray="3,4.2" stroke-dashoffset="0" />
        </ShapeStyleButton>}

        {shapeStyle === ShapeStyle.Solid && <ShapeStyleButton {...props}>
            <rect x="2" y="2" width="16" height="16" rx="2" fill='currentColor' />
        </ShapeStyleButton>}

        {shapeStyle === ShapeStyle.Transparent && <ShapeStyleButton {...props}>
            <rect x="2" y="2" width="16" height="16" rx="2" fill='currentColor' opacity="0.5" />
        </ShapeStyleButton>}
    </>
}

function ShapeStyleButton({ shapeStyle, disabled, onClick, refocus, command, children }: Children & ShapeStyleButtonProps) {
    const { style, setStyle } = useSetStyle()
    const setShapeStyle = () => setStyle({ shapeStyle })

    const currentShapeStyle = getRealShape(style.shape, style.shapeStyle)
    const isTarget = shapeStyle === currentShapeStyle

    return <AnnotateButtonSvg data-target={isTarget} data-refocus={refocus} data-command={command}
        disabled={disabled} style={{ color: style.color.color }} className="m-1"
        onClick={onClick ?? setShapeStyle}>{children}</AnnotateButtonSvg>
}