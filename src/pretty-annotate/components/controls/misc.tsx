import { h } from 'preact';
import { animated, AnimatedValue, ForwardedProps } from 'react-spring';
import { Children, CSSClass, CSSProps } from '../../../common/misc/types';
import { join } from '../../../common/misc/utils';
import { useRowTransition } from './hooks';

export function ButtonRowWithAnim({ children, style }: Children & CSSProps) {
    const rowTransition = useRowTransition(true)
    return rowTransition.map(({ item, props }) => item && <ButtonRow style={{ ...props, ...style as any, padding: '0.75rem' }}>{children}</ButtonRow>) as any
}

export function ButtonRow({ children, class: cls, ...props }: Children & CSSClass & AnimatedValue<ForwardedProps<any>>) {
    return <animated.section {...props} className={join(cls, "col sm:flex-row justify-center space-y-5 sm:space-y-0 sm:space-x-8 p-3 rounded-lg bg-white shadow-md")}>{children}</animated.section>
}

export function AnnotateButton({ children, ...props }: AnimatedValue<ForwardedProps<any>>) {
    return <animated.button {...props} className="bg-gray-300 w-12 h-12 rounded-md grid place-items-center">{children}</animated.button>
}

export function AnnotateButtonSvg({ children, ...props }: AnimatedValue<ForwardedProps<any>>) {
    return <AnnotateButton {...props}>
        <svg class="w-8 h-8 transform" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">{children}</svg>
    </AnnotateButton>
}
