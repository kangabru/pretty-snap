import { createContext, Fragment, h } from 'preact';
import { createPortal, forwardRef, Ref, useContext, useEffect, useRef } from 'preact/compat';
import { useState } from 'react';
import { animated, useSpring } from 'react-spring';
import { SlideInOutContainer } from '../../../common/components/anim-container';
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
    portal?: HTMLElement, activePortal?: number, lastPortal?: number,
    setPortal?: (portalIndex: number) => void, updateChildNav?: () => void,
}>({})

/** Creates the portal context provider that enabled portal functionality inside its children.
 * A 'portal' element (containing the portal root) is passed to its children so it can be rendered in a custom location.
 */
export default function ControlsPortalContext({ children }: ChildrenWithProps<JSX.Element>) {

    // Control which portal is showing
    const [activePortal, setActivePortal] = useState<number | undefined>(undefined)
    const [lastPortal, setLastPortal] = useState<number | undefined>(undefined)
    const resetPortal = () => { setActivePortal(undefined); setLastPortal(undefined) }
    const setPortal = (newPortal: number) => {
        setLastPortal(activePortal)
        setActivePortal(newPortal)
    }

    // Add global events to hide the portal
    useDocumentListener('mousedown', resetPortal)
    useDocumentListener('keydown', e => (IsEscape(e) || IsEnter(e)) && resetPortal())

    // Portal content will be rendered inside this ref
    // Also add child navigation support so the user can navigate controls with the arrow keys
    const [portalRef, updateChildNav] = useChildNavigateWithTrigger<HTMLDivElement>([], useRef<HTMLElement>() as any)

    return <PortalContext.Provider value={{ portal: portalRef.current, activePortal, lastPortal, setPortal, updateChildNav }}>
        {/* Pass the modal to the children so they can render it wherever they want */}
        {children(<ModalPortal_Ref ref={portalRef} />)}
    </PortalContext.Provider>
}

/** Renders children inside the portal is the given portal ID is active. */
export function ControlsPortalContent({ portalIndex, children }: Children & { portalIndex: number }) {
    const { portal, activePortal, lastPortal } = useContext(PortalContext)

    const isMobile = useIsMobile()
    const portalDirection = (activePortal ?? 0) - (lastPortal ?? 0)

    const isActive = activePortal === portalIndex

    return <>{portal && createPortal(isMobile
        ? <>{isActive && children}</>
        : <SlideInOutContainer show={isActive} fromLeft={portalDirection < 0}>
            <div class="flex">{children}</div>
        </SlideInOutContainer>, portal)}</>
}

type ModalPortalProps = Record<string, unknown>
const ModalPortal_Ref = forwardRef<HTMLElement, ModalPortalProps>(ModalPortal)

/** The shared modal where portal contents will be rendered.
 * On mobile the modal renders 'inline' with other content, and on desktop it 'hovers' above content like a modal.
 */
function ModalPortal(_: ModalPortalProps, portalRef: Ref<HTMLElement>) {
    const isMobile = useIsMobile()

    const contStyle = useContainerAnimation()
    const [show, style] = useContentAnimtion(!isMobile)

    return isMobile
        ? <div onMouseDown={e => show && e.stopPropagation()} ref={portalRef as any}
            className={join(!show && "hidden", "flex justify-center flex-wrap p-2")} />

        : <animated.div onMouseDown={e => show && e.stopPropagation()} style={contStyle}
            className={join(!show && "hidden", "z-50 absolute transform -translate-x-1/2 top-full mt-2 shadow rounded-lg")}>
            <Triangle />
            <animated.div ref={portalRef as any} style={style} className="relative flex rounded-lg bg-white p-2 overflow-hidden" />
        </animated.div>
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

function useIsMobile() {
    return useWindowSmallerThan(ScreenWidth.md)
}

/** Returns a spring which animates the modal container. */
function useContainerAnimation() {
    const { activePortal } = useContext(PortalContext)

    // Shift the container to align to the selected button
    const left = ({
        [ModalId.Shape]: -3.65,
        [ModalId.Colour]: 0,
        [ModalId.ShapeStyle]: 3.65,
    } as { [_: number]: number })[activePortal as any] ?? 0

    return useSpring({
        from: { opacity: 0 }, opacity: 1,
        left: `calc(50% + ${left}rem)`,
    })
}

/** Returns a spring which animates the modal contents. */
function useContentAnimtion(animate: boolean): [boolean, any] {
    const { activePortal, portal } = useContext(PortalContext)

    const [size, setSize] = useState({ width: 0, height: remToPixels(3.5) })

    // Set the size to wrap the child element
    const update = () => {
        if (!portal?.children.length) return
        const elem = portal.children[portal.children.length - 1]
        if (elem) setSize({
            width: elem.clientWidth,
            height: elem.clientHeight,
        })
    }

    // Update the size when the selected portal changes. Sometimes the child
    // doesn't update properly when changing quickly so use timeouts as a fallback
    useEffect(() => {
        if (!animate) return
        update()
        const t1 = setTimeout(update, 500)
        const t2 = setTimeout(update, 1000)
        return () => {
            clearTimeout(t1)
            clearTimeout(t2)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [animate, portal, activePortal])

    const style = useSpring({ ...size })
    return [!!activePortal, style]
}

/** Returns a function to active the given portal. */
export function usePortalActivate(portalIndex: number): () => void {
    const { setPortal } = useContext(PortalContext)
    return () => setPortal?.(portalIndex)
}

/** A component soley used to update the 'useChidlNavigate' hook used with the portal.
 * @param deps - An array of hook dependencies that will update the child nav hook when changed. */
export function PortalUpdateChildNav({ deps }: { deps: any[] }) {
    const { updateChildNav } = useContext(PortalContext)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(updateChildNav as any, deps)
    return null
}
