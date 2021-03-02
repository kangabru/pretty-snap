import { h } from "preact"
import { animated, useTransition } from "react-spring"
import { Children, CssClass, CssStyle } from "../misc/types"
import { join } from "../misc/utils"

/** Fades and scales the container in view. */
export default function FadeInContainer({ show, class: cls, style, children }: Children & CssStyle & CssClass & { show?: boolean, }) {

    const rowTransition = useTransition(show ?? true, null, {
        from: { transform: 'scale(0)', opacity: 0 },
        enter: { transform: 'scale(1)', opacity: 1 },
        leave: { transform: 'scale(1)', opacity: 0 },
    })

    return rowTransition.map(({ item, props }) => item && (
        <animated.section style={{ ...props, ...style as any }} className={join(cls)}>
            {children}
        </animated.section>
    )) as any
}
