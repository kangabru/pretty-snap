import { Ref, useEffect, useRef, useState } from "preact/hooks"
import { IsDown, IsLeft, IsRight, IsUp } from "../misc/keyboard"

export enum NavKey { up, down, left, right }

// These map to function arguments, not an array. This Typescript syntax allows us to type dynamic function arguments.
type Args<T> = [refocusInputs?: any[], ref?: Ref<T>, keyNavCallback?: KeyNavCallback, nodeDepth?: 0 | 1]

/** Enables keyboard navigation of a group of elements using left and right arrows.
 * Only one element is focusable at a time which allows for quick group navigation via the keyboard.
 * Child elements can set the 'data-target' property to set the initial focus element.
 * @param refocusInputs - An array of props to check. If these change then the inital focused element will refresh
 * @param keyNavCallback - Allows containers to control how many places to move upon keyboard press.
 * @returns A ref to be used as the group container. Children directly underneath will be used for targetting.
 */
export function useChildNavigate<T extends HTMLElement>(...[refocusInputs, ref, keyNavCallback, nodeDepth]: Args<T>) {
    const containerRef = useRef<T>(ref?.current)

    useEffect(() => {
        const current = containerRef.current
        if (!current) return

        function getResetChildren(): HTMLElement[] {
            const node = getNode(containerRef, nodeDepth)
            if (!node) return []
            const children = [...node.childNodes.values()] as HTMLElement[]
            children.forEach(x => x.tabIndex = -1) // Make children unfocusabled
            return children
        }

        const onKeyDown = (e: KeyboardEvent) => {
            const navKey = GetNavKey(e)
            if (navKey === null) return

            const children = getResetChildren()
            if (!children.length) return

            const focusIndex = children.findIndex(x => x === document.activeElement)
            const indexDiff = (keyNavCallback ?? DefaultKeyNav)(navKey, focusIndex)
            const focusIndexNew = Math.max(0, Math.min(focusIndex + indexDiff, children.length - 1))

            const target = children[focusIndexNew]
            target.tabIndex = 0 // Make target focusable
            target.focus()
            target?.click()
            e.preventDefault() // Don't scroll since we've consumed this event
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
    }, [...refocusInputs ?? [], nodeDepth])

    return containerRef
}

export function getNode(ref: Ref<HTMLElement>, nodeDepth?: 0 | 1) {
    if (!ref.current) return null
    if (!nodeDepth) return ref.current
    return ref.current.firstElementChild
}

export function focusActive(node: Element | null) {
    if (node == null) return
    const children = [...node.childNodes.values()] as HTMLElement[]
    const target = children.find(x => x.dataset && x.dataset['target'] == 'true')
    target?.focus()
}

function GetNavKey(e: KeyboardEvent): NavKey | null {
    if (IsUp(e)) return NavKey.up
    if (IsDown(e)) return NavKey.down
    if (IsLeft(e)) return NavKey.left
    if (IsRight(e)) return NavKey.right
    return null
}

export type KeyNavCallback = (key: NavKey, index: number) => number
const DefaultKeyNav: KeyNavCallback = (key: NavKey) => key === NavKey.left ? -1 : key === NavKey.right ? 1 : 0

/** Equivalent to the 'useChildNavigate' hook but returns an additional initialise function.
 *
 * Reasoning:
 * Sometimes the standard 'useEffect' will not initialise properly because the ref targets a
 * components in a child component from where the hook is called. In this case the hook won't
 * initialise and thus keyboard navigation won't work.
 * @returns The group container ref and an initialise function.
 */
export function useChildNavigateWithTrigger<T extends HTMLElement>(...[refocusInputs, ...args]: Args<T>):
    [Ref<T>, () => void] {
    const [init, setInit] = useState(false)
    const ref = useChildNavigate([...refocusInputs ?? [], init], ...args)
    return [ref, () => setInit(s => !s)]
}
