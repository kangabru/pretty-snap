import { h } from "preact"
import { animated, useTransition } from "react-spring"
import { Children, CssClass, CssStyle } from "../misc/types"
import { join } from "../misc/utils"

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

export function SlideInOutContainer({ show, children }: Children & { show: boolean }) {

    const transition = useTransition(show, null, {
        from: { left: '80%', opacity: 0 },
        enter: { left: '50%', opacity: 1 },
        leave: { left: '30%', opacity: 0 },
    })

    return transition.map(({ item, props }) => item && (
        <animated.div className="absolute left-1/2 top-0 p-1 transform -translate-x-1/2" style={props}>{children}</animated.div>
    )) as any
}