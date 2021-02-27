import { h } from 'preact';
import { forwardRef, Ref } from 'preact/compat';
import { useState } from 'react';
import { useDocumentListener } from '../../../common/hooks/misc';
import { join } from '../../../common/misc/utils';
import { useRingColourStyle, useRingColourWithOpacity, VAR_RING_COLOR } from '../../hooks/styles';
import { colors } from '../../misc/constants';
import useAnnotateStore from '../../stores/annotation';
import { ButtonWithModal } from './buttons';

export default function ColorButtonGroup({ text }: { text: string }) {
    const [showColours, setShowColours] = useState(false)
    useDocumentListener('mousedown', () => setShowColours(false), [showColours])
    useDocumentListener('keydown', e => e.key === "Escape" && setShowColours(false), [showColours])

    const { color, useDarkText } = useAnnotateStore(s => s.style.color)
    const [ref, ringColor] = useRingColourStyle()

    return <ButtonWithModal text={text} button={open => <InnerButton ref={ref} onClick={open} {...{ color, ringColor, useDarkText }} />}>
        <ColorButton color={colors.blue} />
        <ColorButton color={colors.red} />
        <ColorButton color={colors.yellow} />
        <ColorButton color={colors.green} />
        <ColorButton color={colors.dark} />
        <ColorButton color={colors.light} useDarkText />
    </ButtonWithModal>
}

function ColorButton({ color, useDarkText }: { color: string, useDarkText?: boolean }) {
    const [ref, ringColor] = useRingColourWithOpacity(useDarkText ? colors.dark : color)
    const setColour = () => {
        const style = useAnnotateStore.getState().style
        useAnnotateStore.setState({ style: { ...style, color: { color: color, useDarkText } } })
    }
    return <InnerButton ref={ref} onClick={setColour} {...{ color, ringColor, useDarkText }} />
}

type InnerProps = h.JSX.HTMLAttributes<HTMLButtonElement> & { color: string, ringColor: string, useDarkText?: boolean }

const InnerButton = forwardRef<HTMLButtonElement, InnerProps>(InnerButtonRaw)

function InnerButtonRaw({ color, ringColor, useDarkText, ...props }: InnerProps, ref?: Ref<any>) {
    return <button ref={ref} {...props} style={{ backgroundColor: color, [VAR_RING_COLOR]: ringColor }}
        class={join("w-12 h-12 relative rounded-md grid place-items-center outline-ring border-2",
            useDarkText ? "border-gray-400" : "border-transparent")} />
}