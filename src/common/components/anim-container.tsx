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