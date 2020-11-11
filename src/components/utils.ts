import { useEffect, useRef, useState } from "preact/hooks"
import { paramsOrientLeft, paramsOrientRight, urls } from "../constants"
import { BackgroundImage, PatternPreset, SearchPreset, UnsplashImage } from "../types"
import { testData1, testData2 } from "./data"
import { SvgPatternCallback } from "./images/pattern-svgs"

type ClassProp = string | boolean | undefined | null
export const join = (...classes: ClassProp[]): string => classes.filter(x => !!x).join(" ")

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
export const getBackgroundFromImage = (image: UnsplashImage, extraParams: string = ""): BackgroundImage => ({
    src: image.urls.regular + extraParams,
    srcRender: image.urls.full + extraParams,
    srcDownload: image.links.download_location,
})

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
    const rotateParams = orient == Orientation.Left ? paramsOrientLeft : orient == Orientation.Right ? paramsOrientRight : ""
    return { searchTerm, thumb, ...getBackgroundFromImage(image, rotateParams) }
}

export function getQuickPattern(getSrc: SvgPatternCallback, bgColour: string, svgColour: string, svgOpacity: number, sizeRem: number): PatternPreset {
    return { getSrc, bgColour, svgColour, svgOpacity, sizeRem }
}

/** Enables keyboard navigation of a group of elements using left and right arrows.
 * The returned ref is for the container of the focusable element.
 * Only one element is focusable at any time allows for quick group navigation via the keyboard.
 */
export function useChildNavigate<T extends HTMLElement>() {
    const continerRef = useRef<T>()

    const [hasSetup, setHasSetup] = useState(false)

    function getResetChildren(): HTMLElement[] {
        if (!continerRef.current) return []
        const children = [...continerRef.current.childNodes.values()] as HTMLElement[]
        children.forEach(x => x.tabIndex = -1) // Make children unfocusabled
        return children
    }

    useEffect(() => {
        const current = continerRef.current
        if (!current) return

        const onKeyDown = (e: KeyboardEvent) => {
            const children = getResetChildren()
            if (!children.length) return

            const focusIndex = children.findIndex(x => x === document.activeElement)
            const focusIndexNew = e.key == 'ArrowRight' ? Math.min(focusIndex + 1, children.length - 1) :
                e.key == 'ArrowLeft' ? Math.max(focusIndex - 1, 0) :
                    focusIndex

            const target = children[focusIndexNew]
            target.tabIndex = 0 // Make target focusable
            target.focus()
            target?.click()
        }

        current.addEventListener('keydown', onKeyDown)
        return () => current.removeEventListener('keydown', onKeyDown)
    }, [continerRef.current])


    useEffect(() => {
        if (hasSetup || !continerRef.current) return
        const children = getResetChildren()
        if (children.length) children[0].tabIndex = 0
        setHasSetup(true)
    }, [continerRef.current])

    return continerRef
}
