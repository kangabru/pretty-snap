import { Fragment, h } from 'preact';
import { ExportButtons, ExportError } from '../../common/components/export';
import { Exports } from '../../common/hooks/use-export';
import { Children, CSSClass, CSSProps } from '../../common/misc/types';
import { join, textClass } from '../../common/misc/utils';
import { colors } from '../misc/constants';
import { Shape, StyleOptions, SupportedStyle, supportedStyles } from '../misc/types';
import useAnnotateStore from '../stores/annotation';
import useOptionsStore from '../stores/options';

export default function Controls(props: Exports) {
    return <section class="hidden col max-w-xl w-full mx-auto">
        <ShapeButtonGroup />
        <ShapeStyleButtonGroup />
        <ColorButtonGroup />

        <div class="flex text-gray-800">
            <HistoryButtonGroup />
            <ExportButtonGroup {...props} />
        </div>

        <ExportError {...props} />
    </section>
}

function useSetStyle() {
    const style = useAnnotateStore(s => s.style)
    const setStyle = (_style: Partial<StyleOptions>) => () => useAnnotateStore.setState({ style: { ...style, ..._style } })
    return { style, setStyle }
}

function ShapeButtonGroup() {
    const { style, setStyle } = useSetStyle()
    const { color: { color }, count } = style
    return <ButtonRow style={{ color }}>
        <div class="flex justify-center space-x-3">
            <StyleButton shape={Shape.Box}>
                <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" fill='none' stroke-width="2.75" />
            </StyleButton>

            <StyleButton shape={Shape.Ellipse}>
                <circle cx="10" cy="10" r="8" stroke="currentColor" fill='none' stroke-width="2.75" />
            </StyleButton>

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
    </ButtonRow>
}

function ShapeStyleButtonGroup() {
    const { style, setStyle } = useSetStyle()
    const { fill: canUseFill, line: canUseLine } = supportedStyles[style.shape] ?? {} as SupportedStyle
    const canUseShapeStyle = canUseFill || canUseLine
    return canUseShapeStyle ? <ButtonRow style={{ color: style.color.color }}>
        <div class="flex justify-center space-x-3">
            {canUseLine && <>
                <AnnotateButtonSvg onClick={setStyle({ style: {} })}>
                    <line x1="4" y1="4" x2="16" y2="16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" />
                </AnnotateButtonSvg>
                <AnnotateButtonSvg onClick={setStyle({ style: { dashed: true } })}>
                    <line x1="4" y1="4" x2="16" y2="16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" stroke-dasharray="2.5,5" stroke-dashoffset="0" />
                </AnnotateButtonSvg>
            </>}
            {canUseFill && <>
                <AnnotateButtonSvg onClick={setStyle({ style: { fillOpacity: 1 } })}>
                    <rect x="2" y="2" width="16" height="16" rx="2" fill='currentColor' />
                </AnnotateButtonSvg>
                <AnnotateButtonSvg onClick={setStyle({ style: { fillOpacity: 0.5 } })}>
                    <rect x="2" y="2" width="16" height="16" rx="2" fill='currentColor' opacity="0.5" />
                </AnnotateButtonSvg>
            </>}
        </div>
    </ButtonRow> : null
}

function ColorButtonGroup() {
    return <ButtonRow>
        <ColorButton color={colors.red} />
        <ColorButton color={colors.yellow} />
        <ColorButton color={colors.green} />
        <ColorButton color={colors.blue} />
        <ColorButton color={colors.dark} />
        <ColorButton color={colors.light} useDarkText />
    </ButtonRow>
}

function HistoryButtonGroup() {
    const undo = useAnnotateStore(s => s.undo)
    const redo = useAnnotateStore(s => s.redo)
    return <ButtonRow>
        <AnnotateButtonSvg onClick={undo}>
            <path fill="currentColor" d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"></path>
        </AnnotateButtonSvg>
        <AnnotateButtonSvg onClick={redo}>
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z"></path></svg>
        </AnnotateButtonSvg>
    </ButtonRow>
}

function ExportButtonGroup(props: Exports) {
    const image = useOptionsStore(s => s.image)
    const canExport = !!image?.src
    return <ButtonRow>
        <ExportButtons {...props} notReady={!canExport} />
    </ButtonRow>
}

function ButtonRow({ children, class: cls, style }: Children & CSSClass & CSSProps) {
    return <section class={join(cls, "flex p-3 space-x-3 bg-gray-200 max-w-lg rounded-lg m-2")} style={style}>{children}</section>
}

function AnnotateButton({ children, onClick }: Children & { onClick: () => void }) {
    return <button class="bg-gray-300 w-12 h-12 rounded-md grid place-items-center" onClick={onClick}>{children}</button>
}

function AnnotateButtonSvg({ children, onClick }: Children & { onClick: () => void }) {
    return <AnnotateButton onClick={onClick}>
        <svg class="w-8 h-8 transform" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">{children}</svg>
    </AnnotateButton>
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

function ColorButton({ color, useDarkText }: { color: string, useDarkText?: boolean }) {
    const setColour = () => {
        const style = useAnnotateStore.getState().style
        useAnnotateStore.setState({ style: { ...style, color: { color: color, useDarkText } } })
    }
    return <button onClick={setColour} style={{ backgroundColor: color }} class="w-12 h-12 rounded-md grid place-items-center" />
}
