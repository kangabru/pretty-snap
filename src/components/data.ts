import { UnsplashImage } from "../types"

export function testData1(divideHeight: number = 1): UnsplashImage | {} {
    return process.env.NODE_ENV == 'production' ? {} as UnsplashImage : {
        "width": 4000,
        "height": 6000 / divideHeight,
        "urls": {
            "raw": "https://images.unsplash.com/photo-1601758282760-b6cc3d07523d?ixlib=rb-1.2.1\u0026ixid=eyJhcHBfaWQiOjE3ODA3NX0",
            "full": "https://images.unsplash.com/photo-1601758282760-b6cc3d07523d?ixlib=rb-1.2.1\u0026q=85\u0026fm=jpg\u0026crop=entropy\u0026cs=srgb\u0026ixid=eyJhcHBfaWQiOjE3ODA3NX0",
            "regular": "https://images.unsplash.com/photo-1601758282760-b6cc3d07523d?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=entropy\u0026cs=tinysrgb\u0026w=1080\u0026fit=max\u0026ixid=eyJhcHBfaWQiOjE3ODA3NX0",
            "small": "https://images.unsplash.com/photo-1601758282760-b6cc3d07523d?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=entropy\u0026cs=tinysrgb\u0026w=400\u0026fit=max\u0026ixid=eyJhcHBfaWQiOjE3ODA3NX0",
            "thumb": "https://images.unsplash.com/photo-1601758282760-b6cc3d07523d?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=entropy\u0026cs=tinysrgb\u0026w=200\u0026fit=max\u0026ixid=eyJhcHBfaWQiOjE3ODA3NX0"
        },
        "links": {
            "download_location": "https://api.unsplash.com/photos/OHV_IT371vI/download"
        },
        "user": {
            "username": "chewy",
            "name": "Chewy",
            "profile_image": {
                "small": "https://images.unsplash.com/profile-1600206400067-ef9dc8ec33aaimage?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=faces\u0026cs=tinysrgb\u0026fit=crop\u0026h=32\u0026w=32",
                "medium": "https://images.unsplash.com/profile-1600206400067-ef9dc8ec33aaimage?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=faces\u0026cs=tinysrgb\u0026fit=crop\u0026h=64\u0026w=64",
                "large": "https://images.unsplash.com/profile-1600206400067-ef9dc8ec33aaimage?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=faces\u0026cs=tinysrgb\u0026fit=crop\u0026h=128\u0026w=128"
            },
        },
    }
}

export function testData2(divideHeight: number = 1): UnsplashImage | {} {
    return process.env.NODE_ENV == 'production' ? {} as UnsplashImage : {
        "width": 3654,
        "height": 5473 / divideHeight,
        "description": "Looking up",
        "urls": {
            "raw": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-1.2.1\u0026ixid=eyJhcHBfaWQiOjE3ODA3NX0",
            "full": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-1.2.1\u0026q=85\u0026fm=jpg\u0026crop=entropy\u0026cs=srgb\u0026ixid=eyJhcHBfaWQiOjE3ODA3NX0",
            "regular": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=entropy\u0026cs=tinysrgb\u0026w=1080\u0026fit=max\u0026ixid=eyJhcHBfaWQiOjE3ODA3NX0",
            "small": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=entropy\u0026cs=tinysrgb\u0026w=400\u0026fit=max\u0026ixid=eyJhcHBfaWQiOjE3ODA3NX0",
            "thumb": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=entropy\u0026cs=tinysrgb\u0026w=200\u0026fit=max\u0026ixid=eyJhcHBfaWQiOjE3ODA3NX0"
        },
        "links": {
            "download_location": "https://api.unsplash.com/photos/4rDCa5hBlCs/download"
        },
        "user": {
            "username": "mischievous_penguins",
            "name": "Casey Horner",
            "profile_image": {
                "small": "https://images.unsplash.com/profile-1502669002421-a8d274ad2897?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=faces\u0026cs=tinysrgb\u0026fit=crop\u0026h=32\u0026w=32",
                "medium": "https://images.unsplash.com/profile-1502669002421-a8d274ad2897?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=faces\u0026cs=tinysrgb\u0026fit=crop\u0026h=64\u0026w=64",
                "large": "https://images.unsplash.com/profile-1502669002421-a8d274ad2897?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=faces\u0026cs=tinysrgb\u0026fit=crop\u0026h=128\u0026w=128"
            },
        },
    }
}

export const dataPineapple: UnsplashImage = {
    "id": "vAfCO8xrz0I",
    "width": 3648,
    "height": 5472,
    "description": null,
    "urls": {
        "raw": "https://images.unsplash.com/photo-1515876879333-013aa5ea1472?ixlib=rb-1.2.1\u0026ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "full": "https://images.unsplash.com/photo-1515876879333-013aa5ea1472?ixlib=rb-1.2.1\u0026q=85\u0026fm=jpg\u0026crop=entropy\u0026cs=srgb\u0026ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "regular": "https://images.unsplash.com/photo-1515876879333-013aa5ea1472?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=entropy\u0026cs=tinysrgb\u0026w=1080\u0026fit=max\u0026ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "small": "https://images.unsplash.com/photo-1515876879333-013aa5ea1472?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=entropy\u0026cs=tinysrgb\u0026w=400\u0026fit=max\u0026ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "thumb": "https://images.unsplash.com/photo-1515876879333-013aa5ea1472?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=entropy\u0026cs=tinysrgb\u0026w=200\u0026fit=max\u0026ixid=eyJhcHBfaWQiOjE3ODA3NX0"
    },
    "links": {
        "download_location": "https://api.unsplash.com/photos/vAfCO8xrz0I/download"
    },
    "user": {
        "username": "the_modern_life_mrs",
        "name": "Heather Ford",
        "profile_image": {
            "small": "https://images.unsplash.com/profile-1531112521400-3a8700c7470e?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=faces\u0026cs=tinysrgb\u0026fit=crop\u0026h=32\u0026w=32",
            "medium": "https://images.unsplash.com/profile-1531112521400-3a8700c7470e?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=faces\u0026cs=tinysrgb\u0026fit=crop\u0026h=64\u0026w=64",
            "large": "https://images.unsplash.com/profile-1531112521400-3a8700c7470e?ixlib=rb-1.2.1\u0026q=80\u0026fm=jpg\u0026crop=faces\u0026cs=tinysrgb\u0026fit=crop\u0026h=128\u0026w=128"
        },
    },
}

export const dataMountain: UnsplashImage = {
    "id": "OWsdJ-MllYA",
    "width": 4000,
    "height": 5000,
    "description": "summer 2017",
    "urls": {
        "raw": "https://images.unsplash.com/photo-1504870712357-65ea720d6078?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "full": "https://images.unsplash.com/photo-1504870712357-65ea720d6078?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "regular": "https://images.unsplash.com/photo-1504870712357-65ea720d6078?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "small": "https://images.unsplash.com/photo-1504870712357-65ea720d6078?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "thumb": "https://images.unsplash.com/photo-1504870712357-65ea720d6078?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3ODA3NX0"
    },
    "links": {
        "download_location": "https://api.unsplash.com/photos/OWsdJ-MllYA/download"
    },
    "user": {
        "username": "etienne_boesiger",
        "name": "Etienne Bösiger",
        "profile_image": {
            "small": "https://images.unsplash.com/profile-1562363215356-285d3fcdb422?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32",
            "medium": "https://images.unsplash.com/profile-1562363215356-285d3fcdb422?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64",
            "large": "https://images.unsplash.com/profile-1562363215356-285d3fcdb422?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128"
        },
    },
}

export const dataValley: UnsplashImage = {
    "id": "YsoS7vH3x_I",
    "width": 4763,
    "height": 3155,
    "description": "Symmetry in Yosemite",
    "urls": {
        "raw": "https://images.unsplash.com/photo-1480499484268-a85a2414da81?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "full": "https://images.unsplash.com/photo-1480499484268-a85a2414da81?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "regular": "https://images.unsplash.com/photo-1480499484268-a85a2414da81?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "small": "https://images.unsplash.com/photo-1480499484268-a85a2414da81?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "thumb": "https://images.unsplash.com/photo-1480499484268-a85a2414da81?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3ODA3NX0"
    },
    "links": {
        "download_location": "https://api.unsplash.com/photos/YsoS7vH3x_I/download"
    },
    "user": {
        "username": "desrecits",
        "name": "Des Récits",
        "profile_image": {
            "small": "https://images.unsplash.com/profile-1602019205969-13d2c23b24dfimage?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32",
            "medium": "https://images.unsplash.com/profile-1602019205969-13d2c23b24dfimage?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64",
            "large": "https://images.unsplash.com/profile-1602019205969-13d2c23b24dfimage?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128"
        },
    },
}

export const dataAbstract: UnsplashImage = {
    "id": "ruJm3dBXCqw",
    "width": 4000,
    "height": 6000,
    "description": null,
    "urls": {
        "raw": "https://images.unsplash.com/photo-1557672172-298e090bd0f1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "full": "https://images.unsplash.com/photo-1557672172-298e090bd0f1?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "regular": "https://images.unsplash.com/photo-1557672172-298e090bd0f1?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "small": "https://images.unsplash.com/photo-1557672172-298e090bd0f1?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "thumb": "https://images.unsplash.com/photo-1557672172-298e090bd0f1?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3ODA3NX0"
    },
    "links": {
        "download_location": "https://api.unsplash.com/photos/ruJm3dBXCqw/download"
    },
    "user": {
        "username": "pawel_czerwinski",
        "name": "Paweł Czerwiński",
        "profile_image": {
            "small": "https://images.unsplash.com/profile-1592328433409-d9ce8a5333eaimage?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32",
            "medium": "https://images.unsplash.com/profile-1592328433409-d9ce8a5333eaimage?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64",
            "large": "https://images.unsplash.com/profile-1592328433409-d9ce8a5333eaimage?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128"
        },
    },
}

export const dataPalms: UnsplashImage = {
    "id": "toB7tKXne7U",
    "width": 4000,
    "height": 6000,
    "description": "https://www.instagram.com/petefogden/",
    "urls": {
        "raw": "https://images.unsplash.com/photo-1514125669375-59ee3985d08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "full": "https://images.unsplash.com/photo-1514125669375-59ee3985d08b?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "regular": "https://images.unsplash.com/photo-1514125669375-59ee3985d08b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "small": "https://images.unsplash.com/photo-1514125669375-59ee3985d08b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "thumb": "https://images.unsplash.com/photo-1514125669375-59ee3985d08b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3ODA3NX0"
    },
    "links": {
        "download_location": "https://api.unsplash.com/photos/toB7tKXne7U/download"
    },
    "user": {
        "username": "petefogden",
        "name": "Peter Fogden",
        "profile_image": {
            "small": "https://images.unsplash.com/profile-fb-1470863193-26594853c231.jpg?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32",
            "medium": "https://images.unsplash.com/profile-fb-1470863193-26594853c231.jpg?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64",
            "large": "https://images.unsplash.com/profile-fb-1470863193-26594853c231.jpg?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128"
        },
    },
}

export const dataValley2: UnsplashImage = {
    "id": "zOXUvQ3Xo3s",
    "width": 6000,
    "height": 4000,
    "description": "Yosemite Valley, California",
    "urls": {
        "raw": "https://images.unsplash.com/photo-1527549993586-dff825b37782?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "full": "https://images.unsplash.com/photo-1527549993586-dff825b37782?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "regular": "https://images.unsplash.com/photo-1527549993586-dff825b37782?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "small": "https://images.unsplash.com/photo-1527549993586-dff825b37782?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "thumb": "https://images.unsplash.com/photo-1527549993586-dff825b37782?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3ODA3NX0"
    },
    "links": {
        "download_location": "https://api.unsplash.com/photos/zOXUvQ3Xo3s/download"
    },
    "user": {
        "username": "pablofierro",
        "name": "Pablo Fierro",
        "profile_image": {
            "small": "https://images.unsplash.com/profile-fb-1488575915-009588950ad3.jpg?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32",
            "medium": "https://images.unsplash.com/profile-fb-1488575915-009588950ad3.jpg?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64",
            "large": "https://images.unsplash.com/profile-fb-1488575915-009588950ad3.jpg?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128"
        },
    },
}

export const dataSnow: UnsplashImage = {
    "id": "kVKz9qnJC-k",
    "width": 5920,
    "height": 3947,
    "description": "Winter Wonderland in Shirakawa, Japan",
    "urls": {
        "raw": "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "full": "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "regular": "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "small": "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "thumb": "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3ODA3NX0"
    },
    "links": {
        "download_location": "https://api.unsplash.com/photos/kVKz9qnJC-k/download"
    },
    "user": {
        "username": "fabianmardi",
        "name": "Fabian Mardi",
        "profile_image": {
            "small": "https://images.unsplash.com/profile-1466590964174-4df15948ab11?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32",
            "medium": "https://images.unsplash.com/profile-1466590964174-4df15948ab11?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64",
            "large": "https://images.unsplash.com/profile-1466590964174-4df15948ab11?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128"
        },
    },
}

export const dataSun: UnsplashImage = {
    "id": "0x6RTts1jRU",
    "width": 3840,
    "height": 2160,
    "description": "Layers",
    "urls": {
        "raw": "https://images.unsplash.com/photo-1504386106331-3e4e71712b38?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "full": "https://images.unsplash.com/photo-1504386106331-3e4e71712b38?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "regular": "https://images.unsplash.com/photo-1504386106331-3e4e71712b38?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "small": "https://images.unsplash.com/photo-1504386106331-3e4e71712b38?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "thumb": "https://images.unsplash.com/photo-1504386106331-3e4e71712b38?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3ODA3NX0"
    },
    "links": {
        "download_location": "https://api.unsplash.com/photos/0x6RTts1jRU/download"
    },
    "user": {
        "username": "grin",
        "name": "Andrey Grinkevich",
        "profile_image": {
            "small": "https://images.unsplash.com/profile-1494967817872-b7b7568d9b4f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32",
            "medium": "https://images.unsplash.com/profile-1494967817872-b7b7568d9b4f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64",
            "large": "https://images.unsplash.com/profile-1494967817872-b7b7568d9b4f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128"
        },
    },
}

export const dataColourful: UnsplashImage = {
    "id": "OjnmCKmzr3A",
    "width": 3024,
    "height": 4032,
    "description": null,
    "urls": {
        "raw": "https://images.unsplash.com/photo-1533122250115-6bb28e9a48c3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "full": "https://images.unsplash.com/photo-1533122250115-6bb28e9a48c3?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "regular": "https://images.unsplash.com/photo-1533122250115-6bb28e9a48c3?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "small": "https://images.unsplash.com/photo-1533122250115-6bb28e9a48c3?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE3ODA3NX0",
        "thumb": "https://images.unsplash.com/photo-1533122250115-6bb28e9a48c3?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3ODA3NX0"
    },
    "links": {
        "download_location": "https://api.unsplash.com/photos/OjnmCKmzr3A/download"
    },
    "user": {
        "username": "socialcut",
        "name": "S O C I A L . C U T",
        "profile_image": {
            "small": "https://images.unsplash.com/profile-1532395639957-0e7294b2b796?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32",
            "medium": "https://images.unsplash.com/profile-1532395639957-0e7294b2b796?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64",
            "large": "https://images.unsplash.com/profile-1532395639957-0e7294b2b796?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128"
        },
    },
}