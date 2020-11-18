import { Ref, useEffect, useRef, useState } from "preact/hooks"
import { paramsOrientLeft, paramsOrientRight, urls } from "../constants"
import { BackgroundImage, PatternPreset, SearchPreset, UnsplashImage } from "../types"
import { testData1, testData2 } from "./data"
import { SvgPatternCallback } from "./images/pattern-svgs"

type ClassProp = string | boolean | undefined | null
export const join = (...classes: ClassProp[]): string => joinRaw(classes, " ")
const joinRaw = (classes: ClassProp[], separator: string): string => classes.filter(x => !!x).join(separator)

export const getRandomItem = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)]
export const useRandomItem = <T>(items: T[]) => useState(getRandomItem(items))[0]

export const srcToUrl = (src: string) => `url('${src}')`
export const srcToUrlSvg = (src: string) => srcToUrl("data:image/svg+xml," + src)

/** Returns a url to the authors profile as required by the API guidelines.
 *  @see https://help.unsplash.com/en/articles/2511245-unsplash-api-guidelines */
export function getUnsplashBacklink(image: UnsplashImage) {
    return `${urls.unsplash}/@${image.user.username}?utm_source=pretty_snap&utm_medium=referral`
}

/** Return the src url to use for displaying an unsplash image */
const joinUrls = (...parts: ClassProp[]) => joinRaw(parts, "")
export const getImageSrc = (image?: BackgroundImage): string => joinUrls(image?.urls.regular, image?.extraParams)
export const getImageSrcRender = (image?: BackgroundImage): string => joinUrls(image?.urls.full, image?.extraParams)
export const getImageSrcDownload = (image?: BackgroundImage): string => image?.links.download_location ?? ""

/** Gets local data for development. */
export function getUnsplashBatchDev(): UnsplashImage[] {
    if (process.env.NODE_ENV == 'development')
        return [
            testData1(1),
            testData2(3),
            testData1(2),
            testData2(1),
            testData1(4),
            testData2(2),
        ] as UnsplashImage[]
    return []
}

export enum Orientation { Left, Right }

export function getQuickSearch(searchTerm: string, thumb: string, image: UnsplashImage, orient?: Orientation): SearchPreset {
    const extraParams = orient == Orientation.Left ? paramsOrientLeft : orient == Orientation.Right ? paramsOrientRight : ""
    return { searchTerm, thumb, extraParams, ...image }
}

export function getQuickPattern(getSrc: SvgPatternCallback, bgColour: string, svgColour: string, svgOpacity: number, sizeRem: number): PatternPreset {
    return { getSrc, bgColour, svgColour, svgOpacity, sizeRem }
}

/** Enables keyboard navigation of a group of elements using left and right arrows.
 * Only one element is focusable at a time which allows for quick group navigation via the keyboard.
 * Child elements can set the 'data-target' property to set the initial focus element.
 * @param refocusInputs - An array of props to check. If these change then the inital focused element will refresh
 * @returns A ref to be used as the group container. Children directly underneath will be used for targetting.
 */
export function useChildNavigate<T extends HTMLElement>(refocusInputs?: any[], ref?: Ref<T>) {
    const containerRef = ref || useRef<T>()

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
    }, [containerRef.current])


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

    }, [containerRef.current, ...refocusInputs ?? []])

    return containerRef
}
