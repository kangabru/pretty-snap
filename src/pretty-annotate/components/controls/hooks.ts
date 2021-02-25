import { useTransition } from "react-spring"
import { StyleOptions } from "../../misc/types"
import useAnnotateStore from "../../stores/annotation"

export function useSetStyle() {
    const style = useAnnotateStore(s => s.style)
    const setStyle = (_style: Partial<StyleOptions>) => () => useAnnotateStore.setState({ style: { ...style, ..._style } })
    return { style, setStyle }
}

export function useRowButtonTransitions(ids: number[]) {
    return useTransition(ids, x => x, {
        from: { transform: 'scale(0)', width: '0rem', height: '0rem', marginLeft: '0rem', marginRight: '0rem', opacity: '1' },
        enter: { transform: 'scale(1)', width: '3rem', height: '3rem', marginLeft: '0.375rem', marginRight: '0.375rem' },
        leave: { transform: 'scale(0)', width: '0rem', height: '0rem', marginLeft: '0rem', marginRight: '0rem', opacity: '0' },
        trail: 100,
    }).sort((a, b) => a.item - b.item)
}
