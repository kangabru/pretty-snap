import { Fragment, h } from 'preact';
import { Children } from '../../../common/misc/types';
import { useCurrentShape, useCurrentStyle, useSetStyle } from '../../hooks/use-styles';
import { Shape, ShapeStyle, SupportedStyle, supportedStyles } from '../../misc/types';
import { AnnotateButtonSvg, ButtonWithModal } from './buttons';
import { Command } from './command';
import { ModalId, ModalUpdateChildNav } from './modal';

export default function ShapeStyleButtonGroup({ command }: Command) {
    const shapeStyle = useCurrentStyle().shapeStyle
    const [shape, supportedStyles] = useCurrentShape()

    const disabled = isDisabled(supportedStyles)
    const _command = disabled ? undefined : command

    return <ButtonWithModal modalId={ModalId.ShapeStyle} text="Style" command={_command} button={(active, open) => (
        <CurrentShape title="Shape Style" onClick={open} refocus={active} command={_command} />
    )}>
        {supportedStyles.canUseLine && <>
            <ShapeStyleButtonGeneric title="Solid line" shapeStyle={ShapeStyle.Outline} command="1" />
            <ShapeStyleButtonGeneric title="Dashed line" shapeStyle={ShapeStyle.OutlineDashed} command="2" />
        </>}
        {supportedStyles.canUseFill && <>
            <ShapeStyleButtonGeneric title="Solid fill" shapeStyle={ShapeStyle.Solid} command="3" />
            <ShapeStyleButtonGeneric title="Transparent fill" shapeStyle={ShapeStyle.Transparent} command="4" />
        </>}

        {/* Update the modal's child nav hook when the shape style changes */}
        <ModalUpdateChildNav deps={[shape, shapeStyle]} />
    </ButtonWithModal>
}

function CurrentShape(props: Pick<ShapeStyleButtonProps, 'onClick' | 'refocus' | 'command' | 'title'>) {
    const shapeStyle = useCurrentStyle().shapeStyle
    const [shape, supportedStyles] = useCurrentShape()
    const _shapeStyle = getRealShapeIcon(shape, shapeStyle)
    return <ShapeStyleButtonGeneric {...props} disabled={isDisabled(supportedStyles)} shapeStyle={_shapeStyle} />
}

function isDisabled({ canUseFill, canUseLine }: SupportedStyle) {
    return !(canUseFill || canUseLine)
}

/** Returns the most appropriate shape style based on the current shape.
 * @example
 *  - The user selects a 'box' shape with a 'fill' shape style
 *  - The user then switches to a 'line' shape
 *  - The 'fill' shape style doesn't make sense anymore so this function returns a 'line' shape style
 */
function getRealShapeIcon(shape: Shape, shapeStyle: ShapeStyle): ShapeStyle {
    const { canUseFill } = supportedStyles[shape] ?? {} as SupportedStyle
    return !canUseFill && (shapeStyle == ShapeStyle.Solid || shapeStyle == ShapeStyle.Transparent) ? ShapeStyle.Outline : shapeStyle
}

type ShapeStyleButtonProps = Command & { title: string, shapeStyle: ShapeStyle, onClick?: () => void, disabled?: boolean, refocus?: boolean }

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

function ShapeStyleButton({ title, shapeStyle, disabled, onClick, refocus, command, children }:
    Children & ShapeStyleButtonProps & { title: string }) {
    const [style, saveStyle] = useSetStyle()
    const save = () => saveStyle({ shapeStyle })

    const currentShapeStyle = getRealShapeIcon(style.shape, style.shapeStyle)
    const isTarget = shapeStyle === currentShapeStyle

    return <AnnotateButtonSvg data-target={isTarget} data-refocus={refocus} data-command={command}
        title={title} disabled={disabled} style={{ color: style.color.color }} className="m-1"
        onClick={onClick ?? save}>{children}</AnnotateButtonSvg>
}
