import { h } from 'preact';
import { getRandomItem, srcToUrlSvg } from '../../../common/misc/utils';
import colours from '../../data/colours';
import patterns from '../../data/patterns';
import { quickPatterns } from '../../misc/constants';
import { BackgroundPattern, PatternPreset } from '../../misc/types';
import useOptionsStore from '../../stores/options';
import { ImagePreset, ImagePresets, RandButton } from '../image-selector/presets';

export default function QuickPatterns() {
    const random = () => useOptionsStore.getState().setPattern(getRandomPattern())
    const pattern = useOptionsStore(s => s.backgroundPattern)
    return <ImagePresets focusArgs={[pattern]}>
        {...quickPatterns.map(qs => <QuickPattern {...qs} />)}
        <RandButton onClick={random} />
    </ImagePresets>
}

function QuickPattern(pattern: PatternPreset) {
    const { getSrc, bgColour, svgColour, svgOpacity } = pattern
    const onClick = () => useOptionsStore.getState().setPattern(pattern)

    const c = useOptionsStore(s => s.backgroundPattern)
    const isTarget = c?.getSrc == getSrc && c?.bgColour == bgColour && c.svgColour == svgColour && c.svgOpacity == svgOpacity

    return <ImagePreset onClick={onClick} target={isTarget} style={{
        backgroundColor: bgColour,
        backgroundPosition: "center",
        backgroundSize: `${pattern.sizeRem}rem`,
        backgroundImage: srcToUrlSvg(getSrc({ svgColour, svgOpacity }).url),
    }} />
}

function getRandomPattern(): BackgroundPattern {
    const getSrc = getRandomItem(Object.values(patterns))

    const { white, black, ..._colours } = colours
    const bgColour = getRandomItem(Object.values(_colours))
    const svgColour = getRandomItem([white, black])
    const svgOpacity = getRandomItem(svgColour == white ? [0.5, 0.75, 1] : [0.25, 0.5, 0.75])
    return { getSrc, bgColour, svgColour, svgOpacity }
}
