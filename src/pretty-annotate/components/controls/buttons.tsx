import { createContext, Fragment, h } from 'preact';
import { createPortal, forwardRef, Ref, useContext, useEffect, useRef } from 'preact/compat';
import { useState } from 'react';
import { animated, AnimatedValue, ForwardedProps } from 'react-spring';
import FadeInContainer from '../../../common/components/anim-container';
import { useDocumentListener, useWindowWidth } from '../../../common/hooks/use-misc';
import { Children, ChildrenWithProps, CssStyle } from '../../../common/misc/types';
import { join } from '../../../common/misc/utils';
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

type ButtonWithModalProps = Children & { portalId: string, text: string, button: (open: () => void) => JSX.Element }
export const ButtonWithModal_Ref = forwardRef<HTMLElement, ButtonWithModalProps>(ButtonWithModal)

export function ButtonWithModal({ portalId, text, button, children }: ButtonWithModalProps, ref?: Ref<any>) {
    const { portal, activePortal, setPortal } = useContext(PortalContext)

    return <div class="flex relative" onMouseDown={e => activePortal && e.stopPropagation()}>
        <div class="col space-y-1">
            {button(() => setPortal?.(portalId))}
            <span class="text-sm text-gray-600">{text}</span>
        </div>
        {activePortal === portalId && portal && createPortal(<>{children}</>, portal)}
    </div>
}

export function Triangle() {
    return <>
        <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full -mt-px" style={{
            borderLeft: '1rem solid transparent',
            borderRight: '1rem solid transparent',
            borderBottom: '1rem solid rgba(0, 0, 0, 0.2)',
            filter: 'blur(2px)',
        }} />
        <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full" style={{
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

export const PortalContext = createContext<{ portal?: HTMLElement, activePortal?: string, setPortal?: (id: string) => void }>({})

export function ButtonRowPortal({ children }: ChildrenWithProps<JSX.Element>) {

    const [activePortal, setPortal] = useState<string | undefined>(undefined)
    const resetPortal = () => setPortal(undefined)

    useDocumentListener('mousedown', resetPortal)
    useDocumentListener('keydown', e => (e.key === "Escape" || e.key === "Enter") && resetPortal())

    const show = !!activePortal
    const isMobile = useWindowWidth() < 768
    const portalRef = useRef<HTMLDivElement>()

    return <PortalContext.Provider value={{ portal: portalRef.current, activePortal, setPortal }}>
        {children(<>
            {isMobile
                ? <div onMouseDown={e => show && e.stopPropagation()} ref={portalRef as any} class={join(!show && "hidden", "flex justify-center flex-wrap space-x-2 p-3")} />
                : <div onMouseDown={e => show && e.stopPropagation()} class={join(!show && "hidden", "z-50 absolute left-1/2 transform -translate-x-1/2 top-full mt-2 shadow rounded-lg")}>
                    <Triangle />
                    <div ref={portalRef as any} class="relative flex space-x-2 rounded-lg bg-white p-3" />
                </div>}
        </>)}
    </PortalContext.Provider>
}
