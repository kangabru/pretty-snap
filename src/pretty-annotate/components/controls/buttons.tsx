import { h } from 'preact';
import { AnimatedValue, ForwardedProps } from 'react-spring';
import { FadeInContainer } from '../../../common/components/anim-container';
import { useDocumentListener } from '../../../common/hooks/use-misc';
import { IsKey } from '../../../common/misc/keyboard';
import { Children, CssStyle } from '../../../common/misc/types';
import { join } from '../../../common/misc/utils';
import { useRingColourStyle, VAR_RING_COLOR } from '../../hooks/use-styles';
import CommandText, { Command } from './command';
import { ControlModalContent, ModalId, useModalActivate } from './modal';

export function ButtonRowWithAnim({ children, style }: Children & CssStyle) {
    return <FadeInContainer class="relative z-0 flex space-x-3 p-3 rounded-lg bg-white shadow-md" style={style}>
        {children}
    </FadeInContainer>
}

type ButtonProps = h.JSX.HTMLAttributes<HTMLButtonElement> & Command

/** Renders the annotation button but with children wrapped in an SVG element. */
export function AnnotateButtonSvg({ children, ...props }: ButtonProps & AnimatedValue<ForwardedProps<any>>) {
    return <AnnotateButton {...props}>
        <svg class="w-8 h-8" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">{children}</svg>
    </AnnotateButton>
}

/** Renders the common control button which has a distinctive style. */
export function AnnotateButton({ children, style, className, command, ...props }: ButtonProps & AnimatedValue<ForwardedProps<any>>) {
    const [ref, ringColor] = useRingColourStyle()
    return <button ref={ref} {...props} style={{ ...style as any, [VAR_RING_COLOR]: ringColor }}
        className={join(className, "button w-12 h-12 grid place-items-center outline-ring relative")}>
        {children}

        {/* Allow components to set the 'data-command' prop which the child nav will pick up for keyboard command */}
        <CommandText command={props['data-command']} />
    </button>
}

type ButtonWithModalProps = Children & Command & {
    modalId: ModalId, text: string,
    button: (isActive: boolean, activate: () => void) => JSX.Element
}

/** Renders the provided activation button, then renders children inside the modal portal when the given portal ID is active. */
export function ButtonWithModal({ modalId, text, button, command, children }: ButtonWithModalProps) {
    const [isActive, activate] = useModalActivate(modalId)

    // Allow for key 'commands' to active the modal
    useDocumentListener('keypress', e => {
        if (command && IsKey(e, command)) {
            activate()
            e.preventDefault()
            e.stopPropagation()
        }
    }, [command])

    return <div class="flex relative" onMouseDown={e => e.stopPropagation()}>
        <div class="col">
            {button(isActive, activate)}
            <span class="text-sm text-gray-600">{text}</span>
        </div>
        <ControlModalContent modalId={modalId}>{children}</ControlModalContent>
    </div>
}
