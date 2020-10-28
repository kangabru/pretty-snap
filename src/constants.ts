import { UnsplashResponse } from "./unsplash"

export const urls = {
    api: process.env.URL_API,
}

export const defaultResponse: UnsplashResponse = process.env.NODE_ENV == 'production' ? {} : {
    "results": [
        {
            "width": 4000,
            "height": 6000,
            "urls": {
                "raw": "https://images.unsplash.com/photo-1601758282760-b6cc3d07523d?ixlib=rb-1.2.1\u0026ixid=eyJhcHBfaWQiOjE3ODA3NX0",
                "full": "https://images.unsplash.com/photo-1601758282760-b6cc3d07523d?ixlib=rb-1.2.1\u0026q=85\u0026fm=jpg\u0026crop=entropy\u0026cs=srgb\u0026ixid=eyJhcHBfaWQiOjE3ODA3NX0",
                "regular": "https://images.unsplash.com/photo-1601758282760-b6cc3d07523d?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=entropy\u0026cs=tinysrgb\u0026w=1080\u0026fit=max\u0026ixid=eyJhcHBfaWQiOjE3ODA3NX0",
                "small": "https://images.unsplash.com/photo-1601758282760-b6cc3d07523d?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=entropy\u0026cs=tinysrgb\u0026w=400\u0026fit=max\u0026ixid=eyJhcHBfaWQiOjE3ODA3NX0",
                "thumb": "https://images.unsplash.com/photo-1601758282760-b6cc3d07523d?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=entropy\u0026cs=tinysrgb\u0026w=200\u0026fit=max\u0026ixid=eyJhcHBfaWQiOjE3ODA3NX0"
            },
            "links": {
                "download": "https://unsplash.com/photos/OHV_IT371vI/download",
                "download_location": "https://api.unsplash.com/photos/OHV_IT371vI/download"
            },
            "user": {
                "username": "chewy",
                "name": "Chewy",
                "portfolio_url": "https://www.chewy.com/",
                "profile_image": {
                    "small": "https://images.unsplash.com/profile-1600206400067-ef9dc8ec33aaimage?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=faces\u0026cs=tinysrgb\u0026fit=crop\u0026h=32\u0026w=32",
                    "medium": "https://images.unsplash.com/profile-1600206400067-ef9dc8ec33aaimage?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=faces\u0026cs=tinysrgb\u0026fit=crop\u0026h=64\u0026w=64",
                    "large": "https://images.unsplash.com/profile-1600206400067-ef9dc8ec33aaimage?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=faces\u0026cs=tinysrgb\u0026fit=crop\u0026h=128\u0026w=128"
                },
            },
        },
        {
            "width": 3654,
            "height": 5473,
            "description": "Looking up",
            "alt_description": "low angle photography of trees at daytime",
            "urls": {
                "raw": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-1.2.1\u0026ixid=eyJhcHBfaWQiOjE3ODA3NX0",
                "full": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-1.2.1\u0026q=85\u0026fm=jpg\u0026crop=entropy\u0026cs=srgb\u0026ixid=eyJhcHBfaWQiOjE3ODA3NX0",
                "regular": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=entropy\u0026cs=tinysrgb\u0026w=1080\u0026fit=max\u0026ixid=eyJhcHBfaWQiOjE3ODA3NX0",
                "small": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=entropy\u0026cs=tinysrgb\u0026w=400\u0026fit=max\u0026ixid=eyJhcHBfaWQiOjE3ODA3NX0",
                "thumb": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=entropy\u0026cs=tinysrgb\u0026w=200\u0026fit=max\u0026ixid=eyJhcHBfaWQiOjE3ODA3NX0"
            },
            "links": {
                "download": "https://unsplash.com/photos/4rDCa5hBlCs/download",
                "download_location": "https://api.unsplash.com/photos/4rDCa5hBlCs/download"
            },
            "user": {
                "username": "mischievous_penguins",
                "name": "Casey Horner",
                "portfolio_url": "http://paypal.me./CaseyHorner",
                "profile_image": {
                    "small": "https://images.unsplash.com/profile-1502669002421-a8d274ad2897?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=faces\u0026cs=tinysrgb\u0026fit=crop\u0026h=32\u0026w=32",
                    "medium": "https://images.unsplash.com/profile-1502669002421-a8d274ad2897?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=faces\u0026cs=tinysrgb\u0026fit=crop\u0026h=64\u0026w=64",
                    "large": "https://images.unsplash.com/profile-1502669002421-a8d274ad2897?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=faces\u0026cs=tinysrgb\u0026fit=crop\u0026h=128\u0026w=128"
                },
            },
        },
    ]
}