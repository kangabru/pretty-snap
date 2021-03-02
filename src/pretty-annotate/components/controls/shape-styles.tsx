import { Fragment, h } from 'preact';
import { Children } from '../../../common/misc/types';
import { useSetStyle } from '../../hooks/use-styles';
import { Shape, ShapeStyle, SupportedStyle, supportedStyles } from '../../misc/types';
import { AnnotateButtonSvg, ButtonWithModal } from './buttons';
import { ModalId, PortalUpdateChildNav } from './modal';

export default function ShapeStyleButtonGroup() {
    const { shape, shapeStyle } = useSetStyle().style
    const { canUseFill, canUseLine } = supportedStyles[shape] ?? {} as SupportedStyle

    return <ButtonWithModal modalId={ModalId.ShapeStyle} text="Style" button={open => (
        <CurrentShape onClick={open} />
    )}>
        {canUseLine && <>
            <ShapeStyleButtonGeneric shapeStyle={ShapeStyle.Outline} />
            <ShapeStyleButtonGeneric shapeStyle={ShapeStyle.OutlineDashed} />
        </>}
        {canUseFill && <>
            <ShapeStyleButtonGeneric shapeStyle={ShapeStyle.Solid} />
            <ShapeStyleButtonGeneric shapeStyle={ShapeStyle.Transparent} />
        </>}

        {/* Update the portal's child nav hook when the shape style changes */}
        <PortalUpdateChildNav modalId={ModalId.ShapeStyle} deps={[shape, shapeStyle]} />
    </ButtonWithModal>
}

function CurrentShape({ onClick }: { onClick: () => void }) {
    const { shape, shapeStyle } = useSetStyle().style
    const { canUseFill, canUseLine } = supportedStyles[shape] ?? {} as SupportedStyle
    const _shapeStyle = getRealShape(shape, shapeStyle)
    return <ShapeStyleButtonGeneric disabled={!(canUseFill || canUseLine)} shapeStyle={_shapeStyle} onClick={onClick} />
}

function getRealShape(shape: Shape, shapeStyle: ShapeStyle): ShapeStyle {
    const { canUseFill } = supportedStyles[shape] ?? {} as SupportedStyle
    return !canUseFill && (shapeStyle == ShapeStyle.Solid || shapeStyle == ShapeStyle.Transparent) ? ShapeStyle.Outline : shapeStyle
}

type ShapeStyleButtonProps = { shapeStyle: ShapeStyle, onClick?: () => void, disabled?: boolean }

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

function ShapeStyleButton({ shapeStyle, disabled, onClick, children }: Children & ShapeStyleButtonProps) {
    const { style, setStyle } = useSetStyle()
    const setShapeStyle = () => setStyle({ shapeStyle })

    const currentShapeStyle = getRealShape(style.shape, style.shapeStyle)
    const isTarget = shapeStyle === currentShapeStyle

    return <AnnotateButtonSvg data-target={isTarget} disabled={disabled}
        style={{ color: style.color.color }} className="m-1"
        onClick={onClick ?? setShapeStyle}>{children}</AnnotateButtonSvg>
}