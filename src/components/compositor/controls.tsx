import { h, JSX } from 'preact';
import { PADDING_MAX, PADDING_MIN } from '../../constants';
import { SaveState } from '../hooks/canvas';
import useOptionsStore from '../stores/options';
import { join } from '../utils';
import PositionButtonGroup from './controls-positions';

export default function Controls(props: { canCopy: boolean, copy: () => void, copyState: SaveState, download: () => void, downloadState: SaveState, }) {
    const { canCopy, copy, copyState, download, downloadState } = props
    return <section class="col sm:flex-row justify-center space-y-5 sm:space-y-0 sm:space-x-8 p-3 rounded-lg bg-white shadow-md">

        <PositionButtonGroup />
        <PaddingSlider />

        <div class="row space-x-3">
            <ControlButton onClick={copy} disabled={!canCopy} title={canCopy ? "Copy" : "This browser doesn't support image copy."} status={copyState}>
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            </ControlButton>

            <ControlButton onClick={download} title="Download" status={downloadState}>
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path></svg>
            </ControlButton>
        </div>
    </section>
}

function PaddingSlider() {
    // @ts-ignore
    const setPadding = (e: Event) => useOptionsStore.setState({ padding: PADDING_MAX - e.target.value })
    const padding = useOptionsStore(s => s.padding)

    const valInverse = PADDING_MAX - padding
    const maxInverse = PADDING_MAX - PADDING_MIN
    const minInverse = PADDING_MAX - PADDING_MAX

    return <div class="inline-flex flex-row space-x-2 text-primary-base">
        <svg class="w-6 h-6 transform scale-50" viewBox="2 2 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
        <input class="slider" type="range" min={minInverse} max={maxInverse} value={valInverse} onChange={setPadding} />
        <svg class="w-6 h-6" viewBox="2 2 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
    </div>
}

function ControlButton(props: Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'class' | 'children'> & { status: SaveState, children: JSX.Element }) {
    const { status, disabled, ...buttonProps } = props
    const isDisabled = disabled || status == SaveState.disabled || status == SaveState.loading
    return <button {...buttonProps} class={join("button", isDisabled && "pointer-events-none opacity-50")} disabled={isDisabled}>
        {status == SaveState.error
            ? <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            : status == SaveState.success
                ? <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                : status == SaveState.loading
                    ? <svg class="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    : props.children
        }
    </button>
}
