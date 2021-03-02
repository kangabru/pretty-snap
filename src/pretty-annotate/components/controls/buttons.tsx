import { h } from 'preact';
import { AnimatedValue, ForwardedProps } from 'react-spring';
import FadeInContainer from '../../../common/components/anim-container';
import { Children, CssStyle } from '../../../common/misc/types';
import { join } from '../../../common/misc/utils';
import { useRingColourStyle, VAR_RING_COLOR } from '../../hooks/use-styles';
import { ControlModalContent, ModalId, usePortalActivate } from './modal';

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

type ButtonWithModalProps = Children & {
    modalId: ModalId, text: string,
    button: (isActive: boolean, activate: () => void) => JSX.Element
}

/** Renders the provided activation button, then renders children inside the modal portal when the given portal ID is active. */
export function ButtonWithModal({ modalId, text, button, children }: ButtonWithModalProps) {
    const [isActive, activate] = usePortalActivate(modalId)
    return <div class="flex relative" onMouseDown={e => e.stopPropagation()}>
        <div class="col">
            {button(isActive, activate)}
            <span class="text-sm text-gray-600">{text}</span>
        </div>
        <ControlModalContent modalId={modalId}>{children}</ControlModalContent>
    </div>
}
