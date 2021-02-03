import React from 'react';
import { CSSProperties, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import { useChildNavigate } from '../../../common/hooks/use-child-nav';
import { join } from '../../../common/misc/utils';

/** Renders the little icons used to set predefined backgrounds */
export function ImagePresets(props: { children: any, focusArgs?: any[] }) {
    const ref = useChildNavigate<HTMLDivElement>(props.focusArgs)
    return <div ref={ref} className="row flex-wrap justify-center pr-4">{props.children}</div>
}

export function ImagePreset(props: { title?: string, onClick: () => void, classes?: string, style?: CSSProperties, target?: boolean }) {
    return <button onClick={props.onClick} title={props.title} style={props.style as any} data-target={props.target}
        className={join(props.classes, "w-12 h-12 m-1 -mr-4 z-0 bg-cover rounded-full shadow border-white border-2 transform hover:scale-105 outline-primary")}>
    </button>
}

export function RandButton(props: { onClick: () => void }) {
    const [isDown, setIsDown] = useState(false)
    const setDown = () => setIsDown(true), setUp = () => setIsDown(false)
    const { angle } = useSpring({ angle: isDown ? 270 : 0, config: { tension: 40, friction: 8 } })

    const onEnter = () => { setDown(); setTimeout(setUp, 250) }
    const onHover = () => { setDown(); setTimeout(setUp, 20) }

    return <button className="button bg-primary-base hover:bg-primary-base text-white rounded-full border-white border-2 shadow transform hover:scale-105"
        onClick={props.onClick} onMouseEnter={onHover} onMouseDown={setDown} onMouseUp={setUp} onKeyPress={e => e.key == "Enter" && onEnter()}>
        <animated.svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"
            style={{ transform: angle.interpolate(a => `rotate(${a}deg)`) }}>
            <path fill="currentcolor" fillRule="nonzero" stroke="none" stroke-width="1" d="M7.38 5.555l15.592-1.367A3.419 3.419 0 0126.673 7.3L28.05 23.06a3.422 3.422 0 01-3.106 3.71L9.352 28.137a3.419 3.419 0 01-3.702-3.113L4.275 9.265a3.422 3.422 0 013.106-3.71zm.2 2.274a1.14 1.14 0 00-1.036 1.237l1.375 15.759a1.14 1.14 0 001.234 1.038l15.591-1.368a1.14 1.14 0 001.036-1.236l-1.376-15.76a1.14 1.14 0 00-1.234-1.037L7.58 7.829zm3.254 5.39a1.69 1.69 0 01-1.825-1.545 1.692 1.692 0 011.53-1.84 1.69 1.69 0 011.825 1.546 1.692 1.692 0 01-1.53 1.839zm10.065-.883a1.69 1.69 0 01-1.826-1.545 1.692 1.692 0 011.53-1.84 1.69 1.69 0 011.825 1.546 1.692 1.692 0 01-1.53 1.84zM11.72 23.373a1.69 1.69 0 01-1.825-1.545 1.692 1.692 0 011.53-1.84 1.69 1.69 0 011.825 1.545 1.692 1.692 0 01-1.53 1.84zm10.065-.883a1.69 1.69 0 01-1.825-1.545 1.692 1.692 0 011.53-1.84 1.69 1.69 0 011.825 1.546 1.692 1.692 0 01-1.53 1.84zm-5.476-4.635a1.69 1.69 0 01-1.825-1.546 1.692 1.692 0 011.53-1.839 1.69 1.69 0 011.825 1.545 1.692 1.692 0 01-1.53 1.84zM29.183 6.823l-.015.002A.915.915 0 0128.167 6c-.265-2.544-2.523-4.39-5.045-4.121h-.007a.916.916 0 01-1.002-.824.922.922 0 01.808-1.018h.002l.007-.001a6.387 6.387 0 014.718 1.408 6.498 6.498 0 012.347 4.363.922.922 0 01-.812 1.016zM8.547 32h-.008a6.395 6.395 0 01-4.578-1.818 6.51 6.51 0 01-1.96-4.553.92.92 0 01.895-.942h.016c.503-.008.917.4.926.91.044 2.559 2.134 4.595 4.67 4.55h.006a.918.918 0 01.927.91.92.92 0 01-.894.943z"></path>
        </animated.svg>
    </button>
}