import { Fragment, h } from 'preact';
import { forwardRef, Ref, useEffect } from 'preact/compat';
import { useState } from 'react';
import { animated, AnimatedValue, ForwardedProps } from 'react-spring';
import FadeInContainer from '../../../common/components/anim-container';
import { useDocumentListener } from '../../../common/hooks/use-misc';
import { Children, CssStyle } from '../../../common/misc/types';
import { useRingColourStyle, VAR_RING_COLOR } from '../../hooks/use-styles';

export function ButtonRowWithAnim({ children, style }: Children & CssStyle) {
    return <FadeInContainer class="relative z-0 flex space-x-3 p-3 rounded-lg bg-white shadow-md" style={style}>
        {children}
    </FadeInContainer>
}

export function AnnotateButtonSvg({ children, ...props }: AnimatedValue<ForwardedProps<any>>) {
    return <AnnotateButton {...props}>
        <svg class="w-8 h-8 transform" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">{children}</svg>
    </AnnotateButton>
}

export function AnnotateButton({ children, style, ...props }: AnimatedValue<ForwardedProps<any>>) {
    const [ref, ringColor] = useRingColourStyle()
    return <animated.button ref={ref} {...props} style={{ ...style, [VAR_RING_COLOR]: ringColor }}
        className="button w-12 h-12 grid place-items-center outline-ring">
        {children}
    </animated.button>
}

type ButtonWithModalProps = CssStyle & Children & { text: string, button: (open: () => void) => JSX.Element }
export const ButtonWithModal_Ref = forwardRef<HTMLElement, ButtonWithModalProps>(ButtonWithModal)

export function ButtonWithModal({ text, button, children, style }: ButtonWithModalProps, ref?: Ref<any>) {
    const [showModal, setShowModal] = useState(false)
    useDocumentListener('mousedown', () => setShowModal(false), [showModal])
    useDocumentListener('keydown', e => (e.key === "Escape" || e.key === "Enter") && setShowModal(false), [showModal])

    return <div class="flex relative" style={style} onMouseDown={e => showModal && e.stopPropagation()}>
        <div class="col space-y-1">
            {button(() => setShowModal(true))}
            <span class="text-sm text-gray-600">{text}</span>
        </div>
        <ButtonRowModal_Ref ref={ref} show={showModal}>{children}</ButtonRowModal_Ref>
    </div>
}

type ButtonRowModalProps = Children & { show: boolean }
const ButtonRowModal_Ref = forwardRef<HTMLElement, ButtonRowModalProps>(ButtonRowModal)

export function ButtonRowModal({ show, children }: ButtonRowModalProps, ref?: Ref<any>) {
    return show ? <div class="z-50 absolute top-full mt-2 -ml-2 shadow rounded-lg">
        <Triangle />
        <div ref={ref} class="relative flex space-x-2 rounded-lg bg-white p-3">{children}</div>
    </div> : null
}

function Triangle() {
    return <>
        <div class="absolute top-0 left-4 transform -translate-y-full -mt-px" style={{
            borderLeft: '1rem solid transparent',
            borderRight: '1rem solid transparent',
            borderBottom: '1rem solid rgba(0, 0, 0, 0.2)',
            filter: 'blur(2px)',
        }} />
        <div class="absolute top-0 left-4 transform -translate-y-full" style={{
            borderLeft: '1rem solid transparent',
            borderRight: '1rem solid transparent',
            borderBottom: '1rem solid white',
        }} />
    </>
}

/** A function soley used to initialise the 'useChidlNavigate' hook in a parent component. */
export function ChildNavInit({ init }: { init: () => void }) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(init, [])
    return null
}
