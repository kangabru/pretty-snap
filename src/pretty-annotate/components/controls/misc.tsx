import { h } from 'preact';
import { animated, AnimatedValue, ForwardedProps, useTransition } from 'react-spring';
import { Children, CSSProps } from '../../../common/misc/types';

export function ButtonRowWithAnim({ children, style }: Children & CSSProps) {
    const rowTransition = useTransition(true, null, {
        from: { transform: 'scale(0)', opacity: 1 },
        enter: { transform: 'scale(1)' },
    })
    return rowTransition.map(({ item, props }) => item && <animated.div style={{ ...props, ...style as any }}
        className="flex space-x-3 p-3 rounded-lg bg-white shadow-md">
        {children}
    </animated.div>) as any
}

export function AnnotateButton({ children, ...props }: AnimatedValue<ForwardedProps<any>>) {
    return <animated.button {...props} className="bg-gray-100 w-12 h-12 rounded-md grid place-items-center">{children}</animated.button>
}

export function AnnotateButtonSvg({ children, ...props }: AnimatedValue<ForwardedProps<any>>) {
    return <AnnotateButton {...props}>
        <svg class="w-8 h-8 transform" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">{children}</svg>
    </AnnotateButton>
}
