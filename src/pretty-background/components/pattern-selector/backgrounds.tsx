import { h } from 'preact';
import { useChildNavigate } from '../../../common/hooks/use-child-nav';
import { srcToUrlSvg } from '../../../common/misc/utils';
import colours from '../../data/colours';
import patterns, { SvgPatternCallback } from '../../data/patterns';
import useOptionsStore from '../../stores/options';
import { TargetIndicator } from './colours';

export default function Patterns() {
    const getSrc = useOptionsStore(s => s.backgroundPattern?.getSrc)
    const ref = useChildNavigate<HTMLDivElement>([getSrc])

    return <div ref={ref} class="grid grid-rows-1 grid-flow-col gap-2 p-2 overflow-x-scroll" tabIndex={-1}>
        <Pattern getSrc={patterns.none} />
        <Pattern getSrc={patterns.bubbles} />
        <Pattern getSrc={patterns.circlesOverlap} />
        <Pattern getSrc={patterns.polka} />
        <Pattern getSrc={patterns.random} />
        <Pattern getSrc={patterns.ticTacToe} />
        <Pattern getSrc={patterns.wiggle} />
        <Pattern getSrc={patterns.yyy} />
        <Pattern getSrc={patterns.anchors} />
        <Pattern getSrc={patterns.circuit} />
        <Pattern getSrc={patterns.stripes} />
        <Pattern getSrc={patterns.triangles} />
        <Pattern getSrc={patterns.squares} />
        <Pattern getSrc={patterns.waves} />
        <Pattern getSrc={patterns.crosses} />
        <Pattern getSrc={patterns.hexagons} />
        <Pattern getSrc={patterns.squarish} />
        <Pattern getSrc={patterns.diamonds} />
        <Pattern getSrc={patterns.leaf} />
        <Pattern getSrc={patterns.squaresInSquares} />
        <Pattern getSrc={patterns.aztec} />
        <Pattern getSrc={patterns.waves2} />
        <Pattern getSrc={patterns.squaresCircles} />
        <Pattern getSrc={patterns.endlessClouds} />
    </div>
}

function Pattern({ getSrc }: { getSrc: SvgPatternCallback }) {
    const bg = useOptionsStore(s => s.backgroundPattern) ?? { svgColour: colours.black, svgOpacity: 0.25, bgColour: colours.orange200 }
    const onClick = () => useOptionsStore.getState().setPatternSrc(getSrc)
    const backgroundImage = bg ? srcToUrlSvg(getSrc(bg).url) : ""

    const currentGetSrc = useOptionsStore(s => s.backgroundPattern?.getSrc)
    const isTarget = getSrc == currentGetSrc

    return <button data-target={isTarget} onClick={onClick} class="relative w-24 h-24 rounded outline-primary" style={{ backgroundColor: bg?.bgColour ?? "black" }}>
        <div class="absolute inset-0 bg-repeat" style={{ backgroundImage }} />
        {isTarget && <TargetIndicator isLarge useOutline />}
    </button>
}
