import { Ref, useEffect, useRef, useState } from "preact/hooks"

/** Enables keyboard navigation of a group of elements using left and right arrows.
 * Only one element is focusable at a time which allows for quick group navigation via the keyboard.
 * Child elements can set the 'data-target' property to set the initial focus element.
 * @param refocusInputs - An array of props to check. If these change then the inital focused element will refresh
 * @returns A ref to be used as the group container. Children directly underneath will be used for targetting.
 */
export function useChildNavigate<T extends HTMLElement>(refocusInputs?: any[], ref?: Ref<T>) {
    const containerRef = useRef<T>(ref?.current)

    useEffect(() => {
        const current = containerRef.current
        if (!current) return

        function getResetChildren(): HTMLElement[] {
            if (!containerRef.current) return []
            const children = [...containerRef.current.childNodes.values()] as HTMLElement[]
            children.forEach(x => x.tabIndex = -1) // Make children unfocusabled
            return children
        }

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

        const children = getResetChildren()
        const initIndex = Math.max(0, children.findIndex(x => x.dataset && x.dataset['target'] == 'true'))
        if (children[initIndex]) {
            children[initIndex].tabIndex = 0

            // Scroll the target to the center of the scrollable container
            const rectCont = containerRef.current.getBoundingClientRect()
            const rectElem = children[initIndex].getBoundingClientRect()
            const left = rectElem.left - rectCont.left + containerRef.current.scrollLeft - rectCont.width / 2
            containerRef.current.scrollTo({ left, behavior: 'smooth' })
        }

        current.addEventListener('keydown', onKeyDown)
        return () => current.removeEventListener('keydown', onKeyDown)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, refocusInputs ?? [])

    return containerRef
}

/** Equivalent to the 'useChildNavigate' hook but returns an additional initialise function.
 *
 * Reasoning:
 * Sometimes the standard 'useEffect' will not initialise properly because the ref targets a
 * components in a child component from where the hook is called. In this case the hook won't
 * initialise and thus keyboard navigation won't work.
 * @returns The group container ref and an initialise function.
 */
export function useChildNavigateWithTrigger<T extends HTMLElement>(refocusInputs?: any[], _ref?: Ref<T>):
    [Ref<T>, () => void] {
    const [init, setInit] = useState(false)
    const ref = useChildNavigate([...refocusInputs ?? [], init], _ref)
    return [ref, () => setInit(s => !s)]
}
