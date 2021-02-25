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

        <ButtonRowWithAnim>
            <ColorButtonGroup />
            <ShapeStyleButtonGroup />

            <HistoryButtonGroup />
            <ExportButtonGroup {...props} />
        </ButtonRowWithAnim>

        <ExportError {...props} />
    </section>
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
