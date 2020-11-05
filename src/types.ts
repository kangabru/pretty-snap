export type UnsplashResponse = { results?: UnsplashImage[] }
export type UnsplashImage = {
    width: number,
    height: number,
    description?: string,
    alt_description?: string,
    urls: { raw: string, full: string, regular: string, small: string, thumb: string },
    links: {
        download: string,
        download_location: string,
    },
    user: {
        name: string,
        username: string,
        portfolio_url: string,
        profile_image: {
            small: string,
            medium: string,
            large: string,
        },
    },
}

export type Background = { src: string }
export type Foreground = { src: string, width: number, height: number }
export enum Position { Center, Top, Left, Right, Bottom }

export type Settings = {
    foreground: Foreground | undefined,
    background: Background,
    padding: number,
    position: Position,
}

export type SettingsStore = Omit<Settings, 'foreground'>
