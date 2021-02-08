import { Ref, useEffect, useRef } from "preact/hooks"

/** Enables keyboard navigation of a group of elements using left and right arrows.
 * Only one element is focusable at a time which allows for quick group navigation via the keyboard.
 * Child elements can set the 'data-target' property to set the initial focus element.
 * @param refocusInputs - An array of props to check. If these change then the inital focused element will refresh
 * @returns A ref to be used as the group container. Children directly underneath will be used for targetting.
 */
export function useChildNavigate<T extends HTMLElement>(refocusInputs?: any[], ref?: Ref<T>) {
    const containerRef = useRef<T>(ref?.current)

    function getResetChildren(): HTMLElement[] {
        if (!containerRef.current) return []
        const children = [...containerRef.current.childNodes.values()] as HTMLElement[]
        children.forEach(x => x.tabIndex = -1) // Make children unfocusabled
        return children
    }

    useEffect(() => {
        const current = containerRef.current
        if (!current) return

        const onKeyDown = (e: KeyboardEvent) => {
            const isLeft = e.key == "ArrowLeft" || e.key == "Left"
            const isRight = e.key == "ArrowRight" || e.key == "Right"
            if (!(isLeft || isRight)) return

            const children = getResetChildren()
            if (!children.length) return

            const focusIndex = children.findIndex(x => x === document.activeElement)
            const focusIndexNew = isLeft ? Math.max(focusIndex - 1, 0) : isRight ? Math.min(focusIndex + 1, children.length - 1) : focusIndex

            const target = children[focusIndexNew]
            target.tabIndex = 0 // Make target focusable
            target.focus()
            target?.click()
        }

        current.addEventListener('keydown', onKeyDown)
        return () => current.removeEventListener('keydown', onKeyDown)
    }, [])

    useEffect(() => {
        if (!containerRef.current) return
        const children = getResetChildren()
        const initIndex = Math.max(0, children.findIndex(x => x.dataset && x.dataset['target'] == 'true'))
        children[initIndex].tabIndex = 0

        // Scroll the target to the center of the scrollable container
        const rectCont = containerRef.current.getBoundingClientRect()
        const rectElem = children[initIndex].getBoundingClientRect()
        const left = rectElem.left - rectCont.left + containerRef.current.scrollLeft - rectCont.width / 2
        containerRef.current.scrollTo({ left, behavior: 'smooth' })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, refocusInputs ?? [])

    return containerRef
}
