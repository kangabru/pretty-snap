import { h } from 'preact';
import { forwardRef, Ref } from 'preact/compat';
import { join } from '../../../common/misc/utils';
import { useCurrentStyle, useRingColourStyle, useRingColourWithOpacity, useSetStyle, VAR_RING_COLOR } from '../../hooks/use-styles';
import { colors } from '../../misc/constants';
import { ButtonWithModal } from './buttons';
import CommandText, { Command } from './command';
import { ModalId, ModalUpdateChildNav } from './modal';

export default function ColorButtonGroup({ command }: Command) {
    const { color, useDarkText } = useCurrentStyle().color
    const [buttonRef, ringColor] = useRingColourStyle()

    return <ButtonWithModal modalId={ModalId.Colour} text="Colour" command={command} button={(active, onClick) => (
        <InnerButton_Ref ref={buttonRef} data-refocus={active} {...{ onClick, color, ringColor, useDarkText }} command={command} />
    )}>
        <ColorButton color={colors.blue} command="1" />
        <ColorButton color={colors.red} command="2" />
        <ColorButton color={colors.yellow} command="3" />
        <ColorButton color={colors.green} command="4" />
        <ColorButton color={colors.dark} command="5" />
        <ColorButton color={colors.light} command="6" useDarkText />

        {/* Update the modal's child nav hook when the colour changes */}
        <ModalUpdateChildNav deps={[color, useDarkText]} />
    </ButtonWithModal>
}

type ColorButtonprops = Command & { color: string, useDarkText?: boolean }

function ColorButton(props: ColorButtonprops) {
    const { color, useDarkText } = props
    const [ref, ringColor] = useRingColourWithOpacity(useDarkText ? colors.dark : color)

    const [style, saveStyle] = useSetStyle()
    const save = () => saveStyle({ color: { color: color, useDarkText } })

    const { color: _color, useDarkText: _useDarkText } = style.color
    const isTarget = color === _color && useDarkText === _useDarkText

    return <InnerButton_Ref ref={ref} onClick={save} {...{ ...props, ringColor, isTarget }} />
}

type InnerProps = h.JSX.HTMLAttributes<HTMLButtonElement> & ColorButtonprops & { ringColor: string, isTarget?: boolean }

const InnerButton_Ref = forwardRef<HTMLButtonElement, InnerProps>(InnerButton)

function InnerButton({ color, ringColor, useDarkText, isTarget, command, ...props }: InnerProps, ref?: Ref<any>) {
    return <button ref={ref} {...props} data-target={isTarget} data-command={command}
        style={{ backgroundColor: color, [VAR_RING_COLOR]: ringColor }}
        class={join("w-12 h-12 m-1 relative rounded-md grid place-items-center outline-ring border-2",
            useDarkText ? "border-gray-400" : "border-transparent")}>
        <CommandText command={command} class={useDarkText ? undefined : "text-white"} />
    </button>
}