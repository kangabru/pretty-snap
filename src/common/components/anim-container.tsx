import { h } from "preact"
import { animated, config, useTransition } from "react-spring"
import { Children, CssClass, CssStyle } from "../misc/types"
import { join } from "../misc/utils"

/** Fades and scales the container in view. */
export default function FadeInContainer({ class: cls, style, children }: Children & CssStyle & CssClass) {

    const rowTransition = useTransition(true, null, {
        from: { transform: 'scale(0)', opacity: 1 },
        enter: { transform: 'scale(1)' },
    })

    return rowTransition.map(({ item, props }) => item && (
        <animated.section style={{ ...props, ...style as any }} className={join(cls)}>
            {children}
        </animated.section>
    )) as any
}

/** Fades contents in and out from the sizes. */
export function SlideInOutContainer({ show, fromLeft, children }: Children & { show: boolean, fromLeft: boolean }) {

    const transition = useTransition(show, null, {
        config: config.wobbly,
        from: { left: fromLeft ? '30%' : '80%', opacity: 0 },
        enter: { left: '50%', opacity: 1 },
        leave: { left: fromLeft ? '80%' : '30%', opacity: 0 },
    })

    return transition.map(({ item, props }) => item && (
        <animated.div className="absolute left-1/2 top-0 p-1 transform -translate-x-1/2 bg-white" style={props}>{children}</animated.div>
    )) as any
}