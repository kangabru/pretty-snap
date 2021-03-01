import { createContext, Fragment, h } from 'preact';
import { createPortal, forwardRef, Ref, useContext, useRef } from 'preact/compat';
import { useState } from 'react';
import { useDocumentListener } from '../../../common/hooks/use-misc';
import { ScreenWidth, useWindowSmallerThan } from '../../../common/hooks/use-screen-width';
import { Children, ChildrenWithProps } from '../../../common/misc/types';
import { join } from '../../../common/misc/utils';

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
 * - The hooks expose access to the context provider such as activating a portal etc.
 */

const PortalContext = createContext<{ portal?: HTMLElement, activePortal?: string, setPortal?: (id: string) => void }>({})

/** Creates the portal context provider that enabled portal functionality inside its children.
 * A 'portal' element (containing the portal root) is passed to its children so it can be rendered in a custom location.
 */
export default function ControlsPortalContext({ children }: ChildrenWithProps<JSX.Element>) {

    // Control which portal is showing
    const [activePortal, setPortal] = useState<string | undefined>(undefined)
    const resetPortal = () => setPortal(undefined)

    // Add global events to hide the portal
    useDocumentListener('mousedown', resetPortal)
    useDocumentListener('keydown', e => (e.key === "Escape" || e.key === "Enter") && resetPortal())

    const portalRef = useRef<HTMLElement>() // Portal content will be rendered inside this

    return <PortalContext.Provider value={{ portal: portalRef.current, activePortal, setPortal }}>
        {/* Pass the modal to the children so they can render it wherever they want */}
        {children(<ModalPortal_Ref showPortal={!!activePortal} ref={portalRef} />)}
    </PortalContext.Provider>
}

/** Renders children inside the portal is the given portal ID is active. */
export function ControlsPortalContent({ portalId, children }: { portalId: string } & Children) {
    const { portal, activePortal } = useContext(PortalContext)
    return <>{activePortal === portalId && portal && createPortal(<>{children}</>, portal)}</>
}

/** Returns whether the given portal is active and and a method to active it.
 * @return [<portal is active>, <activate portal>]
 */
export function usePortal(portalId: string): [boolean, () => void] {
    const { activePortal, setPortal } = useContext(PortalContext)
    return [portalId === activePortal, () => setPortal?.(portalId)]
}

type ModalPortalProps = { showPortal: boolean }
export const ModalPortal_Ref = forwardRef<HTMLElement, ModalPortalProps>(ModalPortal)

/** The shared modal where portal contents will be rendered.
 * On mobile the modal renders 'inline' with other content, and on desktop it 'hovers' above content like a modal.
 */
function ModalPortal({ showPortal: show }: ModalPortalProps, portalRef: Ref<HTMLElement>) {
    const isMobile = useWindowSmallerThan(ScreenWidth.md)
    return isMobile
        ? <div onMouseDown={e => show && e.stopPropagation()} ref={portalRef as any}
            class={join(!show && "hidden", "flex justify-center flex-wrap space-x-2 p-3")} />

        : <div onMouseDown={e => show && e.stopPropagation()}
            class={join(!show && "hidden", "z-50 absolute left-1/2 transform -translate-x-1/2 top-full mt-2 shadow rounded-lg")}>
            <Triangle />
            <div ref={portalRef as any} class="relative flex space-x-2 rounded-lg bg-white p-3" />
        </div>
}

function Triangle() {
    return <>
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
    </>
}