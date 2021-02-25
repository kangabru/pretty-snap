import { h } from 'preact';
import { ExportButtons, ExportError } from '../../../common/components/export';
import { Exports } from '../../../common/hooks/use-export';
import useAnnotateStore from '../../stores/annotation';
import useOptionsStore from '../../stores/options';
import ColorButtonGroup from './colours';
import { AnnotateButtonSvg, ButtonRowWithAnim } from './misc';
import ShapeStyleButtonGroup from './shape-styles';
import ShapeButtonGroup from './shapes';

export default function Controls(props: Exports) {
    return <section class="col max-w-xl w-full mx-auto space-y-3">
        <ButtonRowWithAnim>
            <ShapeButtonGroup />
        </ButtonRowWithAnim>

        <div class="flex space-x-3">
            <ButtonRowWithAnim>
                <ColorButtonGroup />
                <ShapeStyleButtonGroup />
            </ButtonRowWithAnim>

            <ButtonRowWithAnim>
                <HistoryButtonGroup />
            </ButtonRowWithAnim>

            <ButtonRowWithAnim>
                <ExportButtonGroup {...props} />
            </ButtonRowWithAnim>
        </div>

        <ExportError {...props} />
    </section>
}

function HistoryButtonGroup() {
    const canUndo = useAnnotateStore(s => !!s.undos.length)
    const canRedo = useAnnotateStore(s => !!s.redos.length)

    const undo = useAnnotateStore(s => s.undo)
    const redo = useAnnotateStore(s => s.redo)

    return <div class="flex space-x-3 text-gray-700">
        <AnnotateButtonSvg onClick={undo} disabled={!canUndo}>
            <path stroke="currentColor" stroke-width="2.5" strokeLinecap="round" strokeLinejoin="round" d="M7 11 l-4 -4l4 -4" />
            <path stroke="currentColor" stroke-width="2.5" strokeLinecap="round" strokeLinejoin="round" d="M17 18 a11 11 0 0 0 -11 -11h-3" />
        </AnnotateButtonSvg>
        <AnnotateButtonSvg onClick={redo} disabled={!canRedo}>
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
    return <div class="flex space-x-3">
        <ExportButtons {...props} notReady={!canExport} />
    </div>
}
