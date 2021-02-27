import { Fragment, h } from 'preact';
import { Children } from '../../../common/misc/types';
import { useSetStyle } from '../../hooks/styles';
import { Shape, ShapeStyle, SupportedStyle, supportedStyles } from '../../misc/types';
import { AnnotateButtonSvg, ButtonWithModal_Ref, ChildNavInit } from './buttons';

export default function ShapeStyleButtonGroup({ text }: { text: string }) {
    const { fill: canUseFill, line: canUseLine } = supportedStyles[shape] ?? {} as SupportedStyle
    const { shape, shapeStyle, color: { color } } = useSetStyle().style

    const currentShapeStyle = useCurrentShapeStyle(!!canUseFill)

    return <ButtonWithModal text={text} style={{ color }} button={open => <ButtonGeneric
        disabled={!(canUseFill || canUseLine)}
        shapeStyle={currentShapeStyle} onClick={open} />}>
        {canUseLine && <>
            <ButtonGeneric shapeStyle={ShapeStyle.Outline} />
            <ButtonGeneric shapeStyle={ShapeStyle.OutlineDashed} />
        </>}
        {canUseFill && <>
            <ButtonGeneric shapeStyle={ShapeStyle.Solid} />
            <ButtonGeneric shapeStyle={ShapeStyle.Transparent} />
        </>}
    </ButtonWithModal>
}

function useCurrentShapeStyle(canUseFill: boolean): ShapeStyle {
    const { fillOpacity, dashed } = useSetStyle().style.style
    if (canUseFill && fillOpacity) return fillOpacity >= 1
        ? ShapeStyle.Solid
        : ShapeStyle.Transparent
    return dashed ? ShapeStyle.OutlineDashed : ShapeStyle.Outline
}

function ButtonGeneric({ onClick, disabled, shapeStyle }: { shapeStyle: ShapeStyle, onClick?: () => void, disabled?: boolean }) {
    const { setStyle } = useSetStyle()
    return <>
        {shapeStyle === ShapeStyle.Outline && <AnnotateButtonSvg disabled={disabled} onClick={onClick ?? setStyle({ style: {} })}>
            <path d="m4,4 C 10,5 10,15 16,16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" />
        </AnnotateButtonSvg>}

        {shapeStyle === ShapeStyle.OutlineDashed && <AnnotateButtonSvg disabled={disabled} onClick={onClick ?? setStyle({ style: { dashed: true } })}>
            <path d="m4,4 C 10,5 10,15 16,16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" stroke-dasharray="3,4.2" stroke-dashoffset="0" />
        </AnnotateButtonSvg>}

        {shapeStyle === ShapeStyle.Solid && <AnnotateButtonSvg disabled={disabled} onClick={onClick ?? setStyle({ style: { fillOpacity: 1 } })}>
            <rect x="2" y="2" width="16" height="16" rx="2" fill='currentColor' />
        </AnnotateButtonSvg>}

        {shapeStyle === ShapeStyle.Transparent && <AnnotateButtonSvg disabled={disabled} onClick={onClick ?? setStyle({ style: { fillOpacity: 0.3 } })}>
            <rect x="2" y="2" width="16" height="16" rx="2" fill='currentColor' opacity="0.5" />
        </AnnotateButtonSvg>}
    </>
}