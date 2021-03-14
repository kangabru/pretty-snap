import { createContext, Fragment, h } from 'preact';
import { createPortal, forwardRef } from 'preact/compat';
import { Ref, useContext, useEffect, useRef, useState } from 'preact/hooks';
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
 *   A 'modal' element that renders the common controls is passed to its children so that it can be rendered in a custom location.
 *
 * - The <ControlModalContent> component will render the given children inside the modal when the given modal ID is active.
 *
 * - The <ModalUpdateChildNav> component provides the ability to refresh the child nav hook when modal controls refresh.
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

const ModalContext = createContext<{
    modal?: HTMLElement, activeId?: ModalId, lastActiveId?: ModalId,
    setModal?: (modalId: ModalId) => void, updateChildNav?: () => void,
}>({})

/** Pass the modal to the children so they can render it wherever they want */
type ChildrenCallback = JSX.Element

/** Creates the modal context provider that enabled modal functionality inside its children.
 * A 'modal' element (containing the modal root) is passed to its children so it can be rendered in a custom location.
 */
export default function ControlModalContext({ children }: ChildrenWithProps<ChildrenCallback>) {

    // Control which modal is showing. Track the last modal for directional animations.
    const [activeId, setactiveId] = useState<ModalId | undefined>(undefined)
    const [lastActiveId, setlastActiveId] = useState<ModalId | undefined>(undefined)

    const resetModal = () => { RefocusElement(); setactiveId(undefined); setlastActiveId(undefined) }
    const setModal = (newModal: number) => { setlastActiveId(activeId); setactiveId(newModal) }

    // Add global events to hide the modal
    useDocumentListener('mousedown', resetModal)
    useDocumentListener('keydown', e => {
        if (IsEscape(e) || IsEnter(e)) {
            resetModal()
            e.preventDefault() // stop default enter action
        }
    })

    // Modal content will be rendered inside this ref
    const _modalRef = useRef<HTMLElement>()
    const [modalRef, updateChildNav] = useModalChildNav(_modalRef)

    return <ModalContext.Provider value={{ modal: modalRef.current, activeId, lastActiveId, setModal, updateChildNav }}>
        {children(<ModalPortal_Ref ref={modalRef} />)}
    </ModalContext.Provider>
}

/** This hook adds child navigation support to all modal contents so the user can navigate controls via arrow keys. */
function useModalChildNav(_modalRef: Ref<HTMLElement>): [Ref<HTMLElement>, () => void] {
    const childDepth = useIsMobile() ? 0 : 1 // We render an extra div for animations on desktop
    const [modalRef, _updateChildNav] = useChildNavigateWithTrigger([], _modalRef, undefined, childDepth)

    return [modalRef, () => {
        _updateChildNav()
        const node = getNode(modalRef, childDepth)
        node && focusActive(node) // Focus upon open
    }]
}

type ModalPortalProps = Record<string, unknown>
const ModalPortal_Ref = forwardRef<HTMLElement, ModalPortalProps>(ModalPortal)

/** The shared react portal where modal contents will be rendered.
 * On mobile the modal renders inline while on desktop it hovers above content.
 */
function ModalPortal(_: ModalPortalProps, modalRef: Ref<HTMLElement>) {
    const isMobile = useIsMobile()

    // Animate the container to align with the selected shape/colour/style button
    const contStyle = useContainerAnimation()

    // The modal contents are dynamic so animate the content container to fit them
    const [show, style] = useContentAnimation(!isMobile)

    return isMobile // Render stuff inline on mobile
        ? <div onMouseDown={e => show && e.stopPropagation()} ref={modalRef as any}
            className={join("flex justify-center flex-wrap p-2")} />

        // Render stuff above other content like a modal
        : <FadeInModalContainer show={show}>
            <animated.div onMouseDown={e => show && e.stopPropagation()} style={contStyle}
                className={join("z-50 absolute transform -translate-x-1/2 top-full mt-2 shadow rounded-lg")}>
                <Triangle />
                <animated.div ref={modalRef as any} style={style} className="relative flex rounded-lg bg-white p-2 overflow-hidden" />
            </animated.div>
        </FadeInModalContainer>
}

export function FadeInModalContainer({ show, children }: Children & { show: boolean, }) {
    const rowTransition = useSpring({ opacity: show ? 1 : 0 })
    return <animated.section aria-aria-label="Controls modal" style={rowTransition} className={join(!show && "pointer-events-none")}>{children}</animated.section>
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
    const { activeId } = useContext(ModalContext)

    // Shift the container to align to the selected button
    const left = ModalOffsets[activeId ?? -1] ?? 0

    return useSpring({
        from: { opacity: 0 }, opacity: 1,
        left: `calc(50% + ${left}rem)`,
    })
}

/** Returns a spring which animates the modal contents. */
function useContentAnimation(animate: boolean): [boolean, any] {
    const { activeId, modal } = useContext(ModalContext)

    const [size, setSize] = useState({ width: 0, height: remToPixels(3.5) })

    // Set the size to wrap the child element
    const update = () => {
        if (!modal?.children.length) return
        const elem = modal.children[modal.children.length - 1]
        if (elem) setSize({
            width: elem.clientWidth,
            height: elem.clientHeight,
        })
    }

    // Update the size when the selected modal changes. Sometimes the child
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
    }, [animate, modal, activeId])

    const style = useSpring({ ...size })
    return [!!activeId, style]
}

/** Renders children inside the modal is the given modal ID is active. */
export function ControlModalContent({ modalId, children }: Children & Id) {
    const isMobile = useIsMobile()
    const { modal, activeId } = useContext(ModalContext)
    const isActive = activeId === modalId

    // Render children in the modal and add some tasty animations in hover mode on desktop
    return <>{modal && createPortal(
        isMobile
            ? <>{isActive && children}</>
            : <SlideInOutContainer show={isActive}>{children}</SlideInOutContainer>
        , modal)}</>
}

/** Fades contents in and out from the sides. */
function SlideInOutContainer({ show, children }: Children & { show: boolean }) {
    const { activeId, lastActiveId } = useContext(ModalContext)

    const modalDirection = (activeId ?? 0) - (lastActiveId ?? 0)
    const fromLeft = modalDirection < 0, noSlide = lastActiveId === undefined

    const transition = useTransition(show, null, {
        config: config.wobbly,
        from: { opacity: 0, left: noSlide ? '50%' : fromLeft ? '30%' : '80%' },
        enter: { opacity: 1, left: '50%' },
        leave: { opacity: 0, left: fromLeft ? '80%' : '30%' },
    })

    return transition.map(({ item, props }) => item && (
        <animated.div className="flex absolute left-1/2 top-0 p-1 transform -translate-x-1/2 bg-white" style={props}>{children}</animated.div>
    )) as any
}

/** Returns a function to activate the given modal. */
export function useModalActivate(modalId: ModalId): [boolean, () => void] {
    const { activeId, setModal: setModal } = useContext(ModalContext)
    return [activeId === modalId, () => setModal?.(modalId)]
}

/** A component soley used to update the 'useChidlNavigate' hook used within the modal.
 * @param deps - An array of hook dependencies that will update the child nav hook when changed. */
export function ModalUpdateChildNav({ deps }: { deps: any[] }) {
    const { updateChildNav } = useContext(ModalContext)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(updateChildNav as any, deps)
    return null // treat as JSX element
}

/** Refocuses the last control group button to be used when the modal is closed via the keyboard. */
function RefocusElement() {
    (document.querySelector('[data-refocus]') as HTMLElement)?.focus()
}