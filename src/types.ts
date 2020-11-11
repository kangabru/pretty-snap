import { SvgPatternCallback } from "./components/images/pattern-svgs"

export type UnsplashResponse = { results?: UnsplashImage[] }

// The response subset used with the app
export type UnsplashImage = {
    id: string,
    width: number,
    height: number,
    description?: string | null,
    urls: { raw: string, full: string, regular: string, small: string, thumb: string },
    links: { download_location: string },
    user: {
        name: string,
        username: string,
        profile_image: { small: string, medium: string, large: string },
    },
}

export type BackgroundImage = { src: string, srcRender: string, srcDownload: string }
export type BackgroundPattern = { getSrc: SvgPatternCallback, bgColour: string, svgColour: string, svgOpacity: number }
export type Foreground = { src: string, width: number, height: number }

export enum Position { Center, Top, Left, Right, Bottom }

export type Settings = {
    foreground?: Foreground,
    backgroundImage?: BackgroundImage,
    backgroundPattern?: BackgroundPattern,
    padding: number,
    position: Position,
}

export type SearchPreset = BackgroundImage & { searchTerm: string, thumb: string }
export type PatternPreset = BackgroundPattern & { sizeRem: number }