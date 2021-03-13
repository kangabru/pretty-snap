import { h } from 'preact';
import { FadeInContainer } from '../../../common/components/anim-container';
import { ExportButtons, ExportError } from '../../../common/components/export-buttons';
import { Exports } from '../../../common/hooks/use-export';
import { PADDING_PERC_MAX, PADDING_PERC_MIN } from '../../misc/constants';
import useOptionsStore from '../../stores/options';
import PositionButtonGroup from './positions';

/** Renders the image compositional control component. */
export default function Controls(props: Exports) {
    const hasImage = !!useOptionsStore(s => s.foreground)
    return <section aria-label="Image controls and export" class="space-y-20">
        <ExportError {...props} />
        <FadeInContainer class="col sm:flex-row justify-center space-y-5 sm:space-y-0 sm:space-x-8 p-3 rounded-lg bg-white shadow-md">
            <PositionButtonGroup />
            <PaddingSlider />

            {/* Export buttons */}
            <div class="row space-x-3 text-primary">
                <ExportButtons {...props} notReady={!hasImage} class="outline-primary" />
            </div>
        </FadeInContainer>
    </section>
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
