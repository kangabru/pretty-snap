import { h } from 'preact';
import { animated, AnimatedValue, ForwardedProps, useTransition } from 'react-spring';
import { ExportButtons, ExportError } from '../../../common/components/export';
import { Exports } from '../../../common/hooks/use-export';
import { Children, CSSClass, CSSProps } from '../../../common/misc/types';
import { join, textClass } from '../../../common/misc/utils';
import { colors } from '../../misc/constants';
import { Shape, StyleOptions, SupportedStyle, supportedStyles } from '../../misc/types';
import useAnnotateStore from '../../stores/annotation';
import useOptionsStore from '../../stores/options';
import { GetBracketPaths } from '../annotations/bracket';

export default function Controls(props: Exports) {
    return <section class="col max-w-xl w-full mx-auto space-y-3">
        <ButtonRowWithAnim>
            <ShapeButtonGroup />
        </ButtonRowWithAnim>

        <ButtonRowWithAnim>
            <ColorButtonGroup />
            <ShapeStyleButtonGroup />

            <HistoryButtonGroup />
            <ExportButtonGroup {...props} />
        </ButtonRowWithAnim>

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

function ShapeStyleButtonGroup() {
    const { style, setStyle } = useSetStyle()
    const { fill: canUseFill, line: canUseLine } = supportedStyles[style.shape] ?? {} as SupportedStyle

    const items = ([] as number[]).concat(canUseLine ? [1, 2] : []).concat(canUseFill ? [3, 4] : [])

    const rowTransition = useRowTransition(canUseFill || canUseLine as boolean)
    const buttonTransitions = useRowButtonTransitions(items)

    return rowTransition.map(({ item, props }) => item && <animated.div className="flex" style={{ ...props, color: style.color.color }}>
        {buttonTransitions.map(({ item, props, key }) => {

            if (item == 1) return <AnnotateButtonSvg key={key} style={props} onClick={setStyle({ style: {} })}>
                <line x1="4" y1="4" x2="16" y2="16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" />
            </AnnotateButtonSvg>

            if (item == 2) return <AnnotateButtonSvg key={key} style={props} onClick={setStyle({ style: { dashed: true } })}>
                <line x1="4" y1="4" x2="16" y2="16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" stroke-dasharray="2.5,5" stroke-dashoffset="0" />
            </AnnotateButtonSvg>

            if (item == 3) return <AnnotateButtonSvg key={key} style={props} onClick={setStyle({ style: { fillOpacity: 1 } })}>
                <rect x="2" y="2" width="16" height="16" rx="2" fill='currentColor' />
            </AnnotateButtonSvg>

            if (item == 4) return <AnnotateButtonSvg key={key} style={props} onClick={setStyle({ style: { fillOpacity: 0.3 } })}>
                <rect x="2" y="2" width="16" height="16" rx="2" fill='currentColor' opacity="0.5" />
            </AnnotateButtonSvg>
        })}
    </animated.div>) as any
}

function ColorButtonGroup() {
    const color = colors.red
    return <div class="flex">
        <button style={{ backgroundColor: color }} class="w-12 h-12 rounded-md grid place-items-center" />
        {/* <ColorButton color={colors.red} />
        <ColorButton color={colors.yellow} />
        <ColorButton color={colors.green} />
        <ColorButton color={colors.blue} />
        <ColorButton color={colors.dark} />
        <ColorButton color={colors.light} useDarkText /> */}
    </div>
}

function HistoryButtonGroup() {
    const undo = useAnnotateStore(s => s.undo)
    const redo = useAnnotateStore(s => s.redo)
    return <div class="flex">
        <AnnotateButtonSvg onClick={undo}>
            <path fill="currentColor" d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"></path>
        </AnnotateButtonSvg>
        <AnnotateButtonSvg onClick={redo}>
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z"></path></svg>
        </AnnotateButtonSvg>
    </div>
}

function ExportButtonGroup(props: Exports) {
    const image = useOptionsStore(s => s.image)
    const canExport = !!image?.src
    return <div class="flex">
        <ExportButtons {...props} notReady={!canExport} />
    </div>
}

function useRowTransition(canShow: boolean) {
    return useTransition(canShow, null, {
        from: { transform: 'scale(0)', padding: '0rem 0rem', margin: '0rem 0rem', opacity: 1 },
        enter: { transform: 'scale(1)', padding: '0rem 0.375rem', margin: '0rem 0.5rem' },
        leave: { transform: 'scale(0)', padding: '0rem 0rem', margin: '0rem 0rem', opacity: 0 },
    })
}

function useRowButtonTransitions(ids: number[]) {
    return useTransition(ids, x => x, {
        from: { transform: 'scale(0)', width: '0rem', height: '0rem', marginLeft: '0rem', marginRight: '0rem', opacity: '1' },
        enter: { transform: 'scale(1)', width: '3rem', height: '3rem', marginLeft: '0.375rem', marginRight: '0.375rem' },
        leave: { transform: 'scale(0)', width: '0rem', height: '0rem', marginLeft: '0rem', marginRight: '0rem', opacity: '0' },
        trail: 100,
    }).sort((a, b) => a.item - b.item)
}

function ButtonRowWithAnim({ children, style }: Children & CSSProps) {
    const rowTransition = useRowTransition(true)
    return rowTransition.map(({ item, props }) => item && <ButtonRow style={{ ...props, ...style as any, padding: '0.75rem' }}>{children}</ButtonRow>) as any
}

function ButtonRow({ children, class: cls, ...props }: Children & CSSClass & AnimatedValue<ForwardedProps<any>>) {
    return <animated.section {...props} className={join(cls, "col sm:flex-row justify-center space-y-5 sm:space-y-0 sm:space-x-8 p-3 rounded-lg bg-white shadow-md")}>{children}</animated.section>
}

function AnnotateButton({ children, ...props }: AnimatedValue<ForwardedProps<any>>) {
    return <animated.button {...props} className="bg-gray-300 w-12 h-12 rounded-md grid place-items-center">{children}</animated.button>
}

function AnnotateButtonSvg({ children, ...props }: AnimatedValue<ForwardedProps<any>>) {
    return <AnnotateButton {...props}>
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