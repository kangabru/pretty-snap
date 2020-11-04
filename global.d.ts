declare var process: {
    env: {
        NODE_ENV: 'development' | 'production',
        URL_API: string,
    }
}

declare module "*.png" {
    const value: any;
    export = value;
}

declare module "*.jpg" {
    const value: any;
    export = value;
}
