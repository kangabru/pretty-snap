import { h } from 'preact';
import { forwardRef, Ref, useEffect } from 'preact/compat';
import { AnimatedValue, ForwardedProps } from 'react-spring';
import FadeInContainer from '../../../common/components/anim-container';
import { Children, CssStyle } from '../../../common/misc/types';
import { join } from '../../../common/misc/utils';
import { useRingColourStyle, VAR_RING_COLOR } from '../../hooks/use-styles';
import { ControlsPortalContent, usePortal } from './portal';

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

export function AnnotateButton({ children, style, className, ...props }: AnimatedValue<ForwardedProps<any>>) {
    const [ref, ringColor] = useRingColourStyle()
    return <button ref={ref} {...props} style={{ ...style, [VAR_RING_COLOR]: ringColor }}
        className={join(className, "button w-12 h-12 grid place-items-center outline-ring")}>
        {children}
    </button>
}

type ButtonWithModalProps = Children & { portalId: string, text: string, button: (open: () => void) => JSX.Element }
export const ButtonWithModal_Ref = forwardRef<HTMLElement, ButtonWithModalProps>(ButtonWithModal)

/** Renders the provided activation button, then renders children inside the modal portal when the given portal ID is active. */
export function ButtonWithModal({ portalId, text, button, children }: ButtonWithModalProps, ref?: Ref<any>) {
    const [isActive, activate] = usePortal(portalId)
    return <div class="flex relative" onMouseDown={e => !isActive && e.stopPropagation()}>
        <div class="col">
            {button(activate)}
            <span class="text-sm text-gray-600">{text}</span>
        </div>
        <ControlsPortalContent portalId={portalId}>{children}</ControlsPortalContent>
    </div>
}

/** A function soley used to initialise the 'useChidlNavigate' hook in a parent component. */
export function ChildNavInit({ init }: { init: () => void }) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(init, [])
    return null
}