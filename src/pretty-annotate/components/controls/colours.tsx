import { h } from 'preact';
import { forwardRef, Ref } from 'preact/compat';
import { join } from '../../../common/misc/utils';
import { useRingColourStyle, useRingColourWithOpacity, VAR_RING_COLOR } from '../../hooks/use-styles';
import { colors } from '../../misc/constants';
import useAnnotateStore from '../../stores/annotation';
import { ButtonWithModal } from './buttons';
import { PortalUpdateChildNav } from './portal';

export default function ColorButtonGroup() {
    const { color, useDarkText } = useAnnotateStore(s => s.style.color)
    const [buttonRef, ringColor] = useRingColourStyle()

    return <ButtonWithModal portalId="colors" text="Colour" button={open => (
        <InnerButton_Ref ref={buttonRef} onClick={open} {...{ color, ringColor, useDarkText }} />
    )}>
        <ColorButton color={colors.blue} />
        <ColorButton color={colors.red} />
        <ColorButton color={colors.yellow} />
        <ColorButton color={colors.green} />
        <ColorButton color={colors.dark} />
        <ColorButton color={colors.light} useDarkText />

        {/* Update the portal's child nav hook when the colour changes */}
        <PortalUpdateChildNav deps={[color, useDarkText]} />
    </ButtonWithModal>
}

function ColorButton({ color, useDarkText }: { color: string, useDarkText?: boolean }) {
    const [ref, ringColor] = useRingColourWithOpacity(useDarkText ? colors.dark : color)
    const setColour = () => {
        const style = useAnnotateStore.getState().style
        useAnnotateStore.setState({ style: { ...style, color: { color: color, useDarkText } } })
    }

    const { color: _color, useDarkText: _useDarkText } = useAnnotateStore(s => s.style.color)
    const isTarget = color === _color && useDarkText === _useDarkText

    return <InnerButton_Ref ref={ref} onClick={setColour} {...{ color, ringColor, useDarkText }} data-target={isTarget} />
}

type InnerProps = h.JSX.HTMLAttributes<HTMLButtonElement> & { color: string, ringColor: string, useDarkText?: boolean }

const InnerButton_Ref = forwardRef<HTMLButtonElement, InnerProps>(InnerButton)

function InnerButton({ color, ringColor, useDarkText, ...props }: InnerProps, ref?: Ref<any>) {
    return <button ref={ref} {...props} style={{ backgroundColor: color, [VAR_RING_COLOR]: ringColor }}
        class={join("w-12 h-12 m-1 relative rounded-md grid place-items-center outline-ring border-2",
            useDarkText ? "border-gray-400" : "border-transparent")} />
}