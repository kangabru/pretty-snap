import { h } from 'preact';
import { ExportButtons, ExportError } from '../../common/components/export';
import { Exports } from '../../common/hooks/use-export';
import { Children } from '../../common/misc/types';
import { join, textClass } from '../../common/misc/utils';
import { Style } from '../misc/types';
import useAnnotateStore from '../stores/annotation';
import useOptionsStore from '../stores/options';

export default function Controls(props: Exports) {
    const undo = useAnnotateStore(s => s.undo)
    const redo = useAnnotateStore(s => s.redo)

    const style = useAnnotateStore(s => s.style)
    const { colour: color, count } = style
    const setShape = (type: Style, dashed = false) => () => useAnnotateStore.setState({ style: { ...style, type, dashed } })

    const image = useOptionsStore(s => s.image)
    const canExport = !!image?.src

    return <section class="hidden sm:flex justify-center flex-wrap max-w-xl w-full mx-auto">

        <ExportError {...props} />

        <section class="flex justify-center space-x-3 p-3 bg-gray-200 max-w-lg rounded-lg m-2" style={{ color }}>
            <StyleButton type={Style.Box}>
                <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" fill='none' stroke-width="2.75" />
            </StyleButton>
            <StyleButton type={Style.Box} dashed>
                <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentcolor" fill='none' stroke-width="2.75" stroke-linecap="round" stroke-dasharray="3.795" stroke-dashoffset="3.795" />
            </StyleButton>

            <StyleButton type={Style.Ellipse}>
                <circle cx="10" cy="10" r="8" stroke="currentColor" fill='none' stroke-width="2.75" />
            </StyleButton>
            <StyleButton type={Style.Ellipse} dashed>
                <circle cx="10" cy="10" r="8" stroke="currentcolor" fill='none' stroke-width="2.75" stroke-linecap="round" stroke-dasharray="4.16" stroke-dashoffset="-2" />
            </StyleButton>
            </div>

            <StyleButton type={Style.Arrow}>
                <line x1="4" y1="4" x2="16" y2="16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" />
                <line x1="6" y1="16" x2="16" y2="16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" />
                <line x1="16" y1="6" x2="16" y2="16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" />
            </StyleButton>
            <StyleButton type={Style.Arrow} dashed>
                <line x1="4" y1="4" x2="16" y2="16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" stroke-dasharray="2.5,5" stroke-dashoffset="-1" />
                <line x1="6" y1="16" x2="16" y2="16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" />
                <line x1="16" y1="6" x2="16" y2="16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" />
            </StyleButton>

            <StyleButton type={Style.Line}>
                <line x1="4" y1="4" x2="16" y2="16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" />
            </StyleButton>
            <StyleButton type={Style.Line} dashed>
                <line x1="4" y1="4" x2="16" y2="16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" stroke-dasharray="2.5,5" stroke-dashoffset="0" />
            </StyleButton>

            <AnnotateButtonSpan text={count ?? 1} onClick={setShape(Style.Counter)} />
            <AnnotateButtonSpan text="T" onClick={setShape(Style.Text)} />
        </section>

        <section class="flex justify-center space-x-3 p-3 bg-gray-200 max-w-lg rounded-lg m-2">
            <ColourButton colour="#f87171" /> {/* red 400 */}
            <ColourButton colour="#facc15" /> {/* yellow 400 */}
            <ColourButton colour="#4ade80" /> {/* green 400 */}
            <ColourButton colour="#60a5fa" /> {/* blue 400 */}
            <ColourButton colour="#1e293b" /> {/* blue gray 800 */}
            <ColourButton colour="white" useDarkText />
        </section>

        <div class="flex">
            <section class="flex justify-center space-x-3 p-3 bg-gray-200 max-w-lg rounded-lg m-2 text-gray-800">
                <AnnotateButtonSvg onClick={undo}>
                    <path fill="currentColor" d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"></path>
                </AnnotateButtonSvg>
                <AnnotateButtonSvg onClick={redo}>
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z"></path></svg>
                </AnnotateButtonSvg>
            </section>

            <section class="flex justify-center space-x-3 p-3 bg-gray-200 max-w-lg rounded-lg m-2 text-gray-800">
                <ExportButtons {...props} notReady={!canExport} />
            </section>
        </div>
    </section>
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
    const { colour, useDarkText } = useAnnotateStore(s => s.style)
    return <AnnotateButton onClick={onClick}>
        <span class={join("w-8 h-8 rounded-full font-bold text-xl font-mono grid place-items-center", textClass(useDarkText))} style={{ backgroundColor: colour }}>{text}</span>
    </AnnotateButton>
}

function StyleButton({ type, dashed, children }: Children & { type: Style, dashed?: boolean }) {
    const setShape = () => {
        const style = useAnnotateStore.getState().style
        useAnnotateStore.setState({ style: { ...style, type, dashed } })
    }
    return <AnnotateButtonSvg onClick={setShape}>{children}</AnnotateButtonSvg>
}

function ColourButton({ colour, useDarkText }: { colour: string, useDarkText?: boolean }) {
    const setColour = () => {
        const style = useAnnotateStore.getState().style
        useAnnotateStore.setState({ style: { ...style, colour, useDarkText } })
    }
    return <button onClick={setColour} style={{ backgroundColor: colour }} class="w-12 h-12 rounded-md grid place-items-center" />
}
