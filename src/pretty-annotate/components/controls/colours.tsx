import { h } from 'preact';
import { colors } from '../../misc/constants';
import useAnnotateStore from '../../stores/annotation';

export default function ColorButtonGroup() {
    const color = colors.red
    return <div class="flex">
        <button style={{ backgroundColor: color }} class="w-12 h-12 rounded-md grid place-items-center" />
        {/* <ColorButton color={colors.red} />
        <ColorButton color={colors.yellow} />
        <ColorButton color={colors.green} />
        <ColorButton color={colors.blue} />
        <ColorButton color={colors.dark} />
        <ColorButton color={colors.light} useDarkText /> */}
    </div>
}

function ColorButton({ color, useDarkText }: { color: string, useDarkText?: boolean }) {
    const setColour = () => {
        const style = useAnnotateStore.getState().style
        useAnnotateStore.setState({ style: { ...style, color: { color: color, useDarkText } } })
    }
    return <button onClick={setColour} style={{ backgroundColor: color }} class="w-12 h-12 rounded-md grid place-items-center" />
}