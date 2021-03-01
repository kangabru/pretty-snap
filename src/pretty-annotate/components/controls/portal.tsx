import { createContext, Fragment, h } from 'preact';
import { createPortal, forwardRef, Ref, useContext, useEffect, useMemo, useRef } from 'preact/compat';
import { useState } from 'react';
import { animated, useSpring } from 'react-spring';
import { useChildNavigateWithTrigger } from '../../../common/hooks/use-child-nav';
import { useDocumentListener } from '../../../common/hooks/use-misc';
import { ScreenWidth, useWindowSmallerThan } from '../../../common/hooks/use-screen-width';
import { IsEnter, IsEscape } from '../../../common/misc/keyboard';
import { Children, ChildrenWithProps } from '../../../common/misc/types';
import { join, remToPixels } from '../../../common/misc/utils';
import { ModalId } from './buttons';

/** These components create a react 'portal' that allows components to render children in DOM nodes outside of their component structure.
 * @see https://reactjs.org/docs/portals.html
 *
 * This partical components allows the Colour, Shape, and Shape Style button groups to render the options in a common modal
 * that hovers over elements on desktop, and inline on modile.
 *
 * Usage:
 * - Wrap everything that requires the portal in the <ControlPortalContext> component.
 *   A 'portal' element (containing the portal root) is passed to its children so it can be rendered in a custom location.
 * - The <ControlsPortalContent> component will render the given children inside the portal root when the given portal ID is active.
 * - The <PortalUpdateChildNav> component provides the ability to refresh the child nav hook when portal controls are refreshes
 * - The hooks expose access to the context provider such as activating a portal etc.
 */

const PortalContext = createContext<{
    portal?: HTMLElement, activePortal?: number,
    setPortal?: (portalIndex: number) => void, updateChildNav?: () => void,
}>({})

/** Creates the portal context provider that enabled portal functionality inside its children.
 * A 'portal' element (containing the portal root) is passed to its children so it can be rendered in a custom location.
 */
export default function ControlsPortalContext({ children }: ChildrenWithProps<JSX.Element>) {

    // Control which portal is showing
    const [activePortal, setPortal] = useState<number | undefined>(undefined)
    const resetPortal = () => setPortal(undefined)

    // Add global events to hide the portal
    useDocumentListener('mousedown', resetPortal)
    useDocumentListener('keydown', e => (IsEscape(e) || IsEnter(e)) && resetPortal())

    // Portal content will be rendered inside this ref
    // Also add child navigation support so the user can navigate controls with the arrow keys
    const [portalRef, updateChildNav] = useChildNavigateWithTrigger<HTMLDivElement>([], useRef<HTMLElement>() as any)

    return <PortalContext.Provider value={{ portal: portalRef.current, activePortal, setPortal, updateChildNav }}>
        {/* Pass the modal to the children so they can render it wherever they want */}
        {children(<ModalPortal_Ref ref={portalRef} />)}
    </PortalContext.Provider>
}

/** Renders children inside the portal is the given portal ID is active. */
export function ControlsPortalContent({ children }: Children) {
    const { portal } = useContext(PortalContext)
    return <>{portal && createPortal(<>{children}</>, portal)}</>
}

type ModalPortalProps = Record<string, unknown>
export const ModalPortal_Ref = forwardRef<HTMLElement, ModalPortalProps>(ModalPortal)

/** The shared modal where portal contents will be rendered.
 * On mobile the modal renders 'inline' with other content, and on desktop it 'hovers' above content like a modal.
 */
function ModalPortal(_: ModalPortalProps, portalRef: Ref<HTMLElement>) {
    const [show, style] = useContentAnimtion()

    const isMobile = useWindowSmallerThan(ScreenWidth.md)
    return isMobile
        ? <animated.div onMouseDown={e => show && e.stopPropagation()} ref={portalRef as any} style={style}
            className={join(!show && "hidden", "flex justify-center flex-wrap p-2")} />

        : <div onMouseDown={e => show && e.stopPropagation()}
            class={join(!show && "hidden", "z-50 absolute left-1/2 transform -translate-x-1/2 top-full mt-2 shadow rounded-lg")}>
            <Triangle />
            <animated.div ref={portalRef as any} style={style} className="relative flex rounded-lg bg-white p-2" />
        </div>
}

function Triangle() {
    const { activePortal } = useContext(PortalContext)

    const left = useMemo(() => ({
        [ModalId.Shape]: -3.65,
        [ModalId.Colour]: 0,
        [ModalId.ShapeStyle]: 3.65,
    } as { [_: number]: number })
    [activePortal as any] ?? 0, [activePortal])

    const style = useSpring({ left: `calc(50% + ${left}rem)` })

    return <animated.div style={style} className="absolute top-0 transform -translate-x-1/2 -translate-y-full">
        <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full -mt-px" style={{
            borderLeft: '1rem solid transparent',
            borderRight: '1rem solid transparent',
            borderBottom: '1rem solid rgba(0, 0, 0, 0.2)',
            filter: 'blur(2px)',
        }} />
        <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full" style={{
            borderLeft: '1rem solid transparent',
            borderRight: '1rem solid transparent',
            borderBottom: '1rem solid white',
        }} />
    </animated.div>
}

function useContentAnimtion(): [boolean, any] {
    const { activePortal, portal } = useContext(PortalContext)
    const show = !!activePortal

    const [size, setSize] = useState({ width: 0, height: remToPixels(3.5) })
    const update = () => {
        if (!portal?.children.length) return
        const elem = portal.children[portal.children.length - 1]
        if (elem) setSize({
            width: elem.clientWidth,
            height: elem.clientHeight,
        })
    }
    useEffect(() => {
        update()
        setTimeout(update, 250)
        setTimeout(update, 500)
    }, [portal, activePortal])

    const style = useSpring({ ...size })

    return [show, style]
}


/** Returns whether the given portal is active and and a method to active it.
 * @return [<portal is active>, <activate portal>]
 */
export function usePortal(portalIndex: number): [boolean, () => void] {
    const { activePortal, setPortal } = useContext(PortalContext)
    return [portalIndex === activePortal, () => setPortal?.(portalIndex)]
}

/** A component soley used to update the 'useChidlNavigate' hook used with the portal.
 * @param deps - An array of hook dependencies that will update the child nav hook when changed. */
export function PortalUpdateChildNav({ deps }: { deps: any[] }) {
    const { updateChildNav } = useContext(PortalContext)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(updateChildNav as any, deps)
    return null
}