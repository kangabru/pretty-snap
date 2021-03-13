import { Fragment, h, Ref } from 'preact';
import useMeasure from 'react-use-measure';
import useExport, { ExportOptions } from '../hooks/use-export';
import useExportBorderRadius from '../hooks/use-round-corners';

type ClientChildProps = { width: number, height: number, ref: Ref<HTMLElement>, download: ExportOptions, copy: ExportOptions }
type ExportChildProps = { width: number, height: number, ref: Ref<HTMLElement> }

type ExportWrapperProps = {
    onExport: () => void,
    exportWidth: number | undefined,
    exportHeight: number | undefined,
    renderClient: (_: ClientChildProps) => JSX.Element,
    renderExport: (_: ExportChildProps) => JSX.Element,
}

function ExportWrapper(props: ExportWrapperProps) {
    const [clientRef, { width, height }] = useMeasure()
    const scale = getScale([width, height], [props.exportWidth, props.exportHeight])
    const [exportRef, download, copy] = useExport({ scale, width, height }, props.onExport)

    const exportBorderRadius = useExportBorderRadius()

    return <>
        {props.renderClient({ ref: clientRef, width, height, download, copy })}

        <div class="hidden">
            <div ref={exportRef as any}>
                <section class="overflow-hidden" style={{ width, height, borderRadius: exportBorderRadius }}>
                    {props.renderExport({ width, height, ref: exportRef })}
                </section>
            </div>
        </div>
    </>
}

type SizeMaybe = [number | undefined, number | undefined]

function getScale([clientW, clientH]: SizeMaybe, [exportW, exportH]: SizeMaybe) {
    const scaleW = (exportW ?? 1) / (clientW ?? 1)
    const scaleH = (exportH ?? 1) / (clientH ?? 1)
    return Math.min(scaleW, scaleH) // they should be the same but use min just in case
}

export default ExportWrapper