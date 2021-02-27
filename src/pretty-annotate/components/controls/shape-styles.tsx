import { h } from 'preact';
import { animated, useSpring } from 'react-spring';
import { SupportedStyle, supportedStyles } from '../../misc/types';
import { useRowButtonTransitions, useSetStyle } from './hooks';
import { AnnotateButtonSvg } from './misc';

export default function ShapeStyleButtonGroup() {
    const { style, setStyle } = useSetStyle()
    const { fill: canUseFill, line: canUseLine } = supportedStyles[style.shape] ?? {} as SupportedStyle

    const items = ([] as number[]).concat(canUseLine ? [1, 2] : []).concat(canUseFill ? [3, 4] : [])
    const buttonTransitions = useRowButtonTransitions(items)

    const { margin } = useSpring({ margin: items.length ? '0.75rem' : '0rem' })

    return <animated.div style={{ color: style.color.color, marginLeft: margin }}>
        <div className="flex -mx-1.5">
            {buttonTransitions.map(({ item, props, key }) => {

                if (item == 1) return <AnnotateButtonSvg key={key} style={props} onClick={setStyle({ style: {} })}>
                    <line x1="4" y1="4" x2="16" y2="16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" />
                </AnnotateButtonSvg>

                if (item == 2) return <AnnotateButtonSvg key={key} style={props} onClick={setStyle({ style: { dashed: true } })}>
                    <line x1="4" y1="4" x2="16" y2="16" stroke="currentcolor" stroke-width="2.75" stroke-linecap="round" stroke-dasharray="2.5,5" stroke-dashoffset="0" />
                </AnnotateButtonSvg>

                if (item == 3) return <AnnotateButtonSvg key={key} style={props} onClick={setStyle({ style: { fillOpacity: 1 } })}>
                    <rect x="2" y="2" width="16" height="16" rx="2" fill='currentColor' />
                </AnnotateButtonSvg>

                if (item == 4) return <AnnotateButtonSvg key={key} style={props} onClick={setStyle({ style: { fillOpacity: 0.3 } })}>
                    <rect x="2" y="2" width="16" height="16" rx="2" fill='currentColor' opacity="0.5" />
                </AnnotateButtonSvg>
            })}
        </div>
    </animated.div>
}