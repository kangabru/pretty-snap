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

export type Background = { src: string, srcRender: string, srcDownload: string }
export type Foreground = { src: string, width: number, height: number }
export enum Position { Center, Top, Left, Right, Bottom }

export type Settings = {
    foreground?: Foreground,
    background: Background,
    padding: number,
    position: Position,
}

export type QuickSearch = Background & { searchTerm: string, thumb: string }