import { Fragment, h } from 'preact';
import { FadeInContainer } from '../../../common/components/anim-container';
import { ExportButtons, ExportError } from '../../../common/components/export-buttons';
import { Exports } from '../../../common/hooks/use-export';
import { useDocumentListener } from '../../../common/hooks/use-misc';
import { ScreenWidth, useWindowLargerThan } from '../../../common/hooks/use-screen-width';
import { useRingColourStyle, VAR_RING_COLOR } from '../../hooks/use-styles';
import useAnnotateStore from '../../stores/annotation';
import useOptionsStore from '../../stores/options';
import { AnnotateButtonSvg, ButtonRowWithAnim } from './buttons';
import ColorButtonGroup from './colours';
import ControlModalContext from './modal';
import ShapeStyleButtonGroup from './shape-styles';
import ShapeButtonGroup from './shapes';

export default function Controls(props: Exports) {
    const isWide = useWindowLargerThan(ScreenWidth.sm)

    const hasEdits = !!useAnnotateStore(s => s.undos.length || s.redos.length)
    const history = hasEdits && <ButtonRowWithAnim><HistoryButtonGroup /></ButtonRowWithAnim>
    const exports = hasEdits && <ButtonRowWithAnim><ExportButtonGroup {...props} /></ButtonRowWithAnim>

    return <>
        <section class="col sm:flex-row items-center justify-center max-w-xl w-full mx-auto space-y-3 sm:space-y-0 sm:space-x-3 z-10">

            {isWide && history}

            <ControlModalContext>
                {modal => (
                    <FadeInContainer class="col relative p-2 rounded-lg bg-white shadow-md">
                        <div class="relative z-0 flex space-x-1">
                            <ShapeButtonGroup command="1" />
                            <ColorButtonGroup command="2" />
                            <ShapeStyleButtonGroup command="3" />
                        </div>
                        {modal}
                    </FadeInContainer>
                )}
            </ControlModalContext>

            {isWide && exports}

            {/* Render the history and export sections underneath the shapes on mobile */}
            {!isWide && <div class="row flex-wrap justify-center">
                <div class="p-1">{history}</div>
                <div class="p-1">{exports}</div>
            </div>}

        </section>

        <ExportError {...props} />
    </>
}

function HistoryButtonGroup() {
    const canUndo = useAnnotateStore(s => !!s.undos.length)
    const canRedo = useAnnotateStore(s => !!s.redos.length)

    const undo = useAnnotateStore(s => s.undo)
    const redo = useAnnotateStore(s => s.redo)

    // Global undo/redo keyboard shortcuts
    useDocumentListener('keydown', e => {
        const key = e.key.toLowerCase()
        const stop = () => { e.stopPropagation(); e.preventDefault() }
        if (e.ctrlKey && e.shiftKey && key === 'z') { redo(); stop() } // Ctrl + Shift + z -> redo
        else if (e.ctrlKey && key === 'y') { redo(); stop() } // Ctrl + y -> redo
        else if (e.ctrlKey && key === 'z') { undo(); stop() } // Ctrl + z -> undo
    }, [canUndo, canRedo, undo, redo])

    return <div class="flex space-x-3 text-gray-600">
        <AnnotateButtonSvg onClick={undo} disabled={!canUndo} title="Undo">
            <path stroke="currentColor" stroke-width="2.5" strokeLinecap="round" strokeLinejoin="round" d="M7 11 l-4 -4l4 -4" />
            <path stroke="currentColor" stroke-width="2.5" strokeLinecap="round" strokeLinejoin="round" d="M17 18 a11 11 0 0 0 -11 -11h-3" />
        </AnnotateButtonSvg>
        <AnnotateButtonSvg onClick={redo} disabled={!canRedo} title="Redo">
            <g style="transform: translateX(100%) scaleX(-100%)">
                <path stroke="currentColor" stroke-width="2.5" strokeLinecap="round" strokeLinejoin="round" d="M7 11 l-4 -4l4 -4" />
                <path stroke="currentColor" stroke-width="2.5" strokeLinecap="round" strokeLinejoin="round" d="M17 18 a11 11 0 0 0 -11 -11h-3" />
            </g>
        </AnnotateButtonSvg>
    </div>
}

function ExportButtonGroup(props: Exports) {
    const image = useOptionsStore(s => s.image)
    const canExport = !!image?.src
    const [ref, ringColor] = useRingColourStyle()

    return <div ref={ref} class="flex space-x-3 text-gray-600 outline-ring">
        <ExportButtons {...props} notReady={!canExport} style={{ [VAR_RING_COLOR]: ringColor }} />
    </div>
}
