declare var process: {
    env: {
        NODE_ENV: 'development' | 'production',
        URL_API: string,
        DEV_USE_API: boolean | undefined
    }
}

declare module "*.png" { const value: any; export = value; }
declare module "*.jpg" { const value: any; export = value; }
declare module "*.svg" { const value: any; export = value; }

declare function plausible(event: string): void

declare var InstallTrigger: {} | undefined
declare interface Window {
    chrome: {
        webstore: {} | undefined
        runtime: {} | undefined
    }
}
