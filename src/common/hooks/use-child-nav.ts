import { Ref, useEffect, useRef, useState } from "preact/hooks"
import { IsDown, IsLeft, IsRight, IsUp } from "../misc/keyboard"

type NodeDepth = 0 | 1

/** We use enums over string because the <event.key> value is not a simple string */
export enum NavKey { up, down, left, right }

/** Allow components to provide their own navigation logic via this function. */
export type KeyNavCallback = (key: NavKey, index: number) => number

/** The default navigation function will simply increment the index up/down for respective right/left actions. */
const DefaultKeyNav: KeyNavCallback = (key: NavKey) => key === NavKey.left ? -1 : key === NavKey.right ? 1 : 0

// Define our common function arguments. This is not an array but rather how we use Typescript for typing function args.
type Args<T> = [refocusInputs?: any[], ref?: Ref<T>, keyNavCallback?: KeyNavCallback, nodeDepth?: NodeDepth]

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

        // Focus the next element via keyboard actions
        const onKeyDown = (e: KeyboardEvent) => {
            const node = getNode(containerRef, nodeDepth)
            if (!node) return

            // Try navigate via the arrow keys
            const navKey = GetNavKey(e)
            if (navKey !== null) {
                focusViaNavigate(node, navKey, keyNavCallback)
                return consumeEvent(e) // Don't scroll the page and end the function
            }

            // Try match the key to a child command
            const child = findChildWithKeyCommand(node, e.key)
            if (child) {
                getResetChildren(node)
                focusElement(child)
                return consumeEvent(e) // Stop other keyboard listeners and end the funciton
            }
        }

        // Focus the appropriate element via data set on the children
        const node = getNode(containerRef, nodeDepth)
        if (node) {
            getResetChildren(node)
            const child = findChild(node, x => x.dataset && x.dataset['target'] == 'true')
            if (child) {
                child.tabIndex = 0 // make tab focusable

                // Scroll the target to the center of the scrollable container
                const rectCont = containerRef.current.getBoundingClientRect()
                const rectElem = child.getBoundingClientRect()
                const left = rectElem.left - rectCont.left + containerRef.current.scrollLeft - rectCont.width / 2
                containerRef.current.scrollTo({ left, behavior: 'smooth' })
            }
        }

        current.addEventListener('keydown', onKeyDown)
        return () => current.removeEventListener('keydown', onKeyDown)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...refocusInputs ?? [], nodeDepth])

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
export function useChildNavigateWithTrigger<T extends HTMLElement>(...[refocusInputs, ...args]: Args<T>):
    [Ref<T>, () => void] {
    const [init, setInit] = useState(false)
    const ref = useChildNavigate([...refocusInputs ?? [], init], ...args)
    return [ref, () => setInit(s => !s)]
}

/** Returns the appropriate enum for arrow navigations events. */
function GetNavKey(e: KeyboardEvent): NavKey | null {
    if (IsUp(e)) return NavKey.up
    if (IsDown(e)) return NavKey.down
    if (IsLeft(e)) return NavKey.left
    if (IsRight(e)) return NavKey.right
    return null
}

/** Returns the parent of the focusable elements. */
export function getNode(ref: Ref<HTMLElement>, nodeDepth?: NodeDepth) {
    if (!ref.current) return null
    if (!nodeDepth) return ref.current
    return ref.current.firstElementChild
}

/** Returns all children from the given node. */
function getChildren(node: Element): HTMLElement[] {
    return node === null ? [] : [...node.childNodes.values()] as any
}

/** Returns all children elements with their tab focus removed so the next element can be focused easily.. */
function getResetChildren(node: Element): HTMLElement[] {
    const children = getChildren(node)
    children.forEach(x => x.tabIndex = -1) // Make unfocasable
    return children
}

/** Returns the first child matching the given predicate. */
function findChild(node: Element, predicate: (value: HTMLElement, index: number) => boolean) {
    return getChildren(node).find(predicate)
}

/** Focus the currently targeted child element. */
export function focusActive(node: Element) {
    findChild(node, x => x.dataset && x.dataset['target'] == 'true')?.focus()
}

/** Returns the first child that contains the given command key (like '1') in its 'data-command' tag. */
function findChildWithKeyCommand(node: Element, command: string) {
    return getChildren(node).find(x => x.dataset['command']?.toLowerCase() === command.toLowerCase())
}

function focusElement(target: HTMLElement) {
    target.tabIndex = 0 // make tab focusable
    target.focus()
    target.click?.()
}

/** Focus then next child based on the keyboard navigation (arrows keys). */
function focusViaNavigate(node: Element, navKey: NavKey, keyNavCallback?: KeyNavCallback) {
    const children = getResetChildren(node)
    const focusIndex = children.findIndex(x => x === document.activeElement)
    const indexDiff = (keyNavCallback ?? DefaultKeyNav)(navKey, focusIndex)
    const focusIndexNew = Math.max(0, Math.min(focusIndex + indexDiff, children.length - 1))
    focusElement(children[focusIndexNew])
}

function consumeEvent(e: KeyboardEvent) {
    e.preventDefault()
    e.stopPropagation()
}