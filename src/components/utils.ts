import { useState } from "preact/hooks"
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