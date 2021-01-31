import { ClassProp, joinRaw } from "../../common/misc/utils"
import { testData1, testData2 } from "../data/images"
import { SvgPatternCallback } from "../data/patterns"
import { paramsOrientLeft, paramsOrientRight, urls } from "./constants"
import { BackgroundImage, PatternPreset, SearchPreset, UnsplashImage } from "./types"

/** Returns a url to the authors profile as required by the API guidelines.
 *  @see https://help.unsplash.com/en/articles/2511245-unsplash-api-guidelines */
export function getUnsplashBacklinkUser(image: UnsplashImage) {
    return `${urls.unsplash}/@${image.user.username}?utm_source=pretty_snap&utm_medium=referral`
}

/** Returns a url to the authors profile as required by the API guidelines.
 *  @see https://help.unsplash.com/en/articles/2511245-unsplash-api-guidelines */
export function getUnsplashBacklinkImage(image: UnsplashImage) {
    return `${image.urls.full}?utm_source=pretty_snap&utm_medium=referral`
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
