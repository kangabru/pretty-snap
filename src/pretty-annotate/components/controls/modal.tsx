import { createContext, Fragment, h } from 'preact';
import { createPortal, forwardRef, Ref, useContext, useEffect, useRef } from 'preact/compat';
import { useState } from 'react';
import { animated, config, useSpring, useTransition } from 'react-spring';
import { focusActive, getNode, useChildNavigateWithTrigger } from '../../../common/hooks/use-child-nav';
import { useDocumentListener } from '../../../common/hooks/use-misc';
import { ScreenWidth, useWindowSmallerThan } from '../../../common/hooks/use-screen-width';
import { IsEnter, IsEscape } from '../../../common/misc/keyboard';
import { Children, ChildrenWithProps } from '../../../common/misc/types';
import { join, remToPixels } from '../../../common/misc/utils';

/** Renders a common modal that displays the various controls for the Colour, Shape, and Shape Style groups.
 * The modal hovers over elements on desktop and renders inline on mobile.
 *
 * The modal works using a react 'portal' that allows components to render children in DOM nodes outside of their component structure.
 * @see https://reactjs.org/docs/portals.html
 *
 * Usage:
 * - Wrap everything that requires the modal in the <ControlModalContext> component.
 *   A 'portal' element that renders the common controls is passed to its children so that it can be rendered in a custom location.
 *
 * - The <ControlModalContent> component will render the given children inside the modal when the given portal ID is active.
 *
 * - The <PortalUpdateChildNav> component provides the ability to refresh the child nav hook when portal controls refresh.
 */

export enum ModalId {
    Shape = 1,
    Colour = 2,
    ShapeStyle = 3,
}

type Id = { modalId: ModalId }

const ModalOffsets: { [_: number]: number } = {
    [ModalId.Shape]: -3.65,
    [ModalId.Colour]: 0,
    [ModalId.ShapeStyle]: 3.65,
}

const PortalContext = createContext<{
    portal?: HTMLElement, activeId?: ModalId, lastActiveId?: ModalId,
    setPortal?: (modalId: ModalId) => void, updateChildNav?: () => void,
}>({})

/** Creates the portal context provider that enabled portal functionality inside its children.
 * A 'portal' element (containing the portal root) is passed to its children so it can be rendered in a custom location.
 */
export default function ControlModalContext({ children }: ChildrenWithProps<JSX.Element>) {

    // Control which portal is showing. Track the last portal for directional animations.
    const [activeId, setactiveId] = useState<ModalId | undefined>(undefined)
    const [lastActiveId, setlastActiveId] = useState<ModalId | undefined>(undefined)

    const resetPortal = () => { RefocusElement(); setactiveId(undefined); setlastActiveId(undefined) }
    const setPortal = (newPortal: number) => { setlastActiveId(activeId); setactiveId(newPortal) }

    // Add global events to hide the portal
    useDocumentListener('mousedown', resetPortal)
    useDocumentListener('keydown', e => (IsEscape(e) || IsEnter(e)) && resetPortal())

    // Portal content will be rendered inside this ref
    const _portalRef = useRef<HTMLElement>()
    const [portalRef, updateChildNav] = usePortalChildNav(_portalRef)

    return <PortalContext.Provider value={{ portal: portalRef.current, activeId, lastActiveId, setPortal, updateChildNav }}>
        {children(<ModalPortal_Ref ref={portalRef} />)} {/* Pass the modal to the children so they can render it wherever they want */}
    </PortalContext.Provider>
}

/** This hook adds child navigation support to all portal contents so the user can navigate controls via arrow keys. */
function usePortalChildNav(_portalRef: Ref<HTMLElement>): [Ref<HTMLElement>, () => void] {
    const childDepth = useIsMobile() ? 0 : 1 // We render an extra div for animations on desktop
    const [portalRef, _updateChildNav] = useChildNavigateWithTrigger([], _portalRef, undefined, childDepth)

    return [portalRef, () => {
        _updateChildNav()
        focusActive(getNode(portalRef, childDepth)) // Focus upon open
    }]
}

type ModalPortalProps = Record<string, unknown>
const ModalPortal_Ref = forwardRef<HTMLElement, ModalPortalProps>(ModalPortal)

/** The shared modal where portal contents will be rendered.
 * On mobile the modal renders inline while on desktop it hovers above content.
 */
function ModalPortal(_: ModalPortalProps, portalRef: Ref<HTMLElement>) {
    const isMobile = useIsMobile()

    // Animate the container to align with the selected shape/colour/style button
    const contStyle = useContainerAnimation()

    // The portal contents are dynamic so animate the content container to fit them
    const [show, style] = useContentAnimation(!isMobile)

    return isMobile // Render stuff inline on mobile
        ? <div onMouseDown={e => show && e.stopPropagation()} ref={portalRef as any}
            className={join("flex justify-center flex-wrap p-2")} />

        // Render stuff above other content like a modal
        : <FadeInModalContainer show={show}>
            <animated.div onMouseDown={e => show && e.stopPropagation()} style={contStyle}
                className={join("z-50 absolute transform -translate-x-1/2 top-full mt-2 shadow rounded-lg")}>
                <Triangle />
                <animated.div ref={portalRef as any} style={style} className="relative flex rounded-lg bg-white p-2 overflow-hidden" />
            </animated.div>
        </FadeInModalContainer>
}

export function FadeInModalContainer({ show, children }: Children & { show: boolean, }) {
    const rowTransition = useSpring({ opacity: show ? 1 : 0 })
    return <animated.section style={rowTransition} className={join(!show && "pointer-events-none")}>{children}</animated.section>
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
    const { activeId } = useContext(PortalContext)

    // Shift the container to align to the selected button
    const left = ModalOffsets[activeId ?? -1] ?? 0

    return useSpring({
        from: { opacity: 0 }, opacity: 1,
        left: `calc(50% + ${left}rem)`,
    })
}

/** Returns a spring which animates the modal contents. */
function useContentAnimation(animate: boolean): [boolean, any] {
    const { activeId, portal } = useContext(PortalContext)

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
    }, [animate, portal, activeId])

    const style = useSpring({ ...size })
    return [!!activeId, style]
}

/** Renders children inside the portal is the given portal ID is active. */
export function ControlModalContent({ modalId, children }: Children & Id) {
    const isMobile = useIsMobile()
    const { portal, activeId } = useContext(PortalContext)
    const isActive = activeId === modalId

    // Render children in the portal and add some tasty animations in hover mode on desktop
    return <>{portal && createPortal(
        isMobile
            ? <>{isActive && children}</>
            : <SlideInOutContainer show={isActive}>{children}</SlideInOutContainer>
        , portal)}</>
}

/** Fades contents in and out from the sides. */
function SlideInOutContainer({ show, children }: Children & { show: boolean }) {
    const { activeId, lastActiveId } = useContext(PortalContext)

    const portalDirection = (activeId ?? 0) - (lastActiveId ?? 0)
    const fromLeft = portalDirection < 0

    const transition = useTransition(show, null, {
        config: config.wobbly,
        from: { left: fromLeft ? '30%' : '80%', opacity: 0 },
        enter: { left: '50%', opacity: 1 },
        leave: { left: fromLeft ? '80%' : '30%', opacity: 0 },
    })

    return transition.map(({ item, props }) => item && (
        <animated.div className="flex absolute left-1/2 top-0 p-1 transform -translate-x-1/2 bg-white" style={props}>{children}</animated.div>
    )) as any
}

/** Returns a function to activate the given portal. */
export function usePortalActivate(modalId: ModalId): [boolean, () => void] {
    const { activeId, setPortal } = useContext(PortalContext)
    return [activeId === modalId, () => setPortal?.(modalId)]
}

/** A component soley used to update the 'useChidlNavigate' hook used within the portal.
 * @param deps - An array of hook dependencies that will update the child nav hook when changed. */
export function PortalUpdateChildNav({ deps }: { deps: any[] }) {
    const { updateChildNav } = useContext(PortalContext)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(updateChildNav as any, deps)
    return null // treat as JSX element
}

/** Refocuses the last control group button to be used when the modal is closed via the keyboard. */
function RefocusElement() {
    (document.querySelector('[data-refocus]') as HTMLElement)?.focus()
}