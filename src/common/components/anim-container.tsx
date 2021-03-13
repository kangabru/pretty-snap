import { h } from "preact"
import { CSSProperties } from "react"
import { animated, useTransition } from "react-spring"
import { Children, CssClass, CssStyle } from "../misc/types"
import { join } from "../misc/utils"

export default function AnimContainer({ show, config, class: cls, style, children }:
    Children & CssStyle & CssClass & { show?: boolean, } &
    { config: { from?: CSSProperties, enter?: CSSProperties, leave?: CSSProperties } }) {

    const rowTransition = useTransition(show ?? true, null, config)

    return rowTransition.map(({ item, props }) => item && (
        <animated.div style={{ ...props, ...style as any }} className={join(cls)}>{children}</animated.div>
    )) as any
}

/** Fades and scales the container in view. */
export function FadeInContainer(props: Children & CssStyle & CssClass & { show?: boolean, }) {
    return <AnimContainer {...props} config={{
        from: { transform: 'scale(0)', opacity: 0 },
        enter: { transform: 'scale(1)', opacity: 1 },
        leave: { transform: 'scale(1)', opacity: 0 },
    }} />
}