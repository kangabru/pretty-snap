export enum Position { Center, Top, Left, Right, Bottom }

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