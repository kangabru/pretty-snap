import { Fragment, h, JSX } from 'preact';
import { urls } from '../../../common/constants';
import { ExportOptions, Exports, ExportState } from '../../../common/hooks/use-export';
import { Children } from '../../../common/misc/types';
import { join } from '../../../common/misc/utils';
import { PADDING_PERC_MAX, PADDING_PERC_MIN } from '../../misc/constants';
import useOptionsStore from '../../stores/options';
import PositionButtonGroup from './positions';

/** Renders the image compositional control component. */
export default function CompositorControls(props: Exports) {
    const hasImage = !!useOptionsStore(s => s.foreground)
    return <>
        <ExportError {...props} />
        <section class="col sm:flex-row justify-center space-y-5 sm:space-y-0 sm:space-x-8 p-3 rounded-lg bg-white shadow-md">
            <PositionButtonGroup />
            <PaddingSlider />

            {/* Export buttons */}
            <div class="row space-x-3">
                <ExportButtons {...props} notReady={!hasImage} />
            </div>
        </section>
    </>
}

function PaddingSlider() {
    const setPadding = (padding: number) => useOptionsStore.setState({ paddingPerc: padding })
    // @ts-ignore. We want the slider to go from small -> large image but internally we must reverse the padding calc
    const setPaddingSlider = (e: Event) => setPadding(PADDING_PERC_MAX - e.target.value)

    // Get the slider min/max values based on the reverse calc we do internally
    const padding = useOptionsStore(s => s.paddingPerc)
    const valInverse = PADDING_PERC_MAX - padding
    const maxInverse = PADDING_PERC_MAX - PADDING_PERC_MIN
    const minInverse = PADDING_PERC_MAX - PADDING_PERC_MAX

    return <div class="inline-flex flex-row space-x-2 text-gray-700">
        <button title="Set maximum padding" onClick={_ => setPadding(PADDING_PERC_MAX)} class="outline-primary rounded">
            <svg class="w-6 h-6" viewBox="1 1 22 22" xmlns="http://www.w3.org/2000/svg">
                <rect fill="currentColor" stroke="none" rx="2" x="8" y="8" width="8" height="8" />
                <rect fill="none" stroke="currentColor" rx="2" x="2" y="2" width="20" height="20" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
            </svg>
        </button>

        <input title="Adjust padding" class="slider" type="range" min={minInverse} max={maxInverse} value={valInverse} onChange={setPaddingSlider} />

        <button title="Set minimum padding" onClick={_ => setPadding(PADDING_PERC_MIN)} class="outline-primary rounded">
            <svg class="w-6 h-6" viewBox="1 1 22 22" xmlns="http://www.w3.org/2000/svg">
                <rect fill="currentColor" stroke="none" rx="2" x="5" y="5" width="14" height="14" />
                <rect fill="none" stroke="currentColor" rx="2" x="2" y="2" width="20" height="20" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
            </svg>
        </button>
    </div>
}

export function ExportError({ copy: { state: copyState }, download: { state: downloadState } }: Exports) {
    const hasError = copyState == ExportState.error || downloadState == ExportState.error
    return <>
        {hasError && <p class="max-w-md text-red-500 text-center">
            Oops! Something broke which means your browser might not be supported 😬
            Please try on Chrome, Firefox, or <a href={urls.github} class="underline">submit an issue on Github</a>. Sorry about that!
        </p>}
    </>
}

export function ExportButtons({ copy, download, notReady }: Exports & { notReady?: boolean }) {
    return <>
        <ExportButton {...copy} disabled={notReady || !copy.supported}
            title={copy.supported ? "Copy" : "This browser doesn't support image copy."}>
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z"></path><path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z"></path></svg>
        </ExportButton>

        <ExportButton {...download} disabled={notReady || !download.supported}
            title={download.supported ? "Download" : "This browser doesn't support image download."}>
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clip-rule="evenodd"></path></svg>
        </ExportButton>
    </>
}

type ButtonProps = Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'class' | 'children' | 'onClick'>

export function ExportButton(props: ButtonProps & Children & ExportOptions) {
    const { disabled, run, state, ...buttonProps } = props
    const isDisabled = disabled || state == ExportState.loading
    return <button {...buttonProps} disabled={isDisabled} onClick={run}
        class={join("button", isDisabled ? "pointer-events-none opacity-50 text-gray-500" : "text-primary-base")}>
        {state == ExportState.error
            ? <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            : state == ExportState.success
                ? <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                : state == ExportState.loading
                    ? <svg class="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    : props.children}
    </button>
}
