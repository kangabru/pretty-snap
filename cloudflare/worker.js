/**
 * This is a Cloudflare worker script used to proxy unsplash API calls.
 * Production route:
 *      *prettysnap.app/api/*
 *
 * Requires the following environment variable:
 *      ACCESS_KEY - Your unsplash access key
 *
 * @see https://workers.cloudflare.com
 * @see https://www.youtube.com/watch?v=48NWaLkDcME
 */

const URL_API_ROOT = "/api"
const URL_SEARCH = "https://api.unsplash.com/search/photos"
const URL_RANDOM = "https://api.unsplash.com/photos/random"

const unsplashHeaders = {
    'Accept-Version': 'v1',
    'Authorization': `Client-ID ${ACCESS_KEY}`
}

const routesGET = {
    "/search": unsplashSearch,
    "/random": unsplashRandom,
}

const routesPOST = {
    "/use": unsplashDownload,
}

addEventListener("fetch", event => {
    const request = event.request

    const path = new URL(request.url).pathname
    const route = path.replace(URL_API_ROOT, '') // '/api/search' => '/search'

    // Pass the request forward for non-API calls
    if (!path.startsWith(URL_API_ROOT))
        return event.respondWith(fetch(request))

    if (request.method === "GET" && routesGET[route])
        return event.respondWith(routesGET[route](event))

    if (request.method === "POST" && routesPOST[route])
        return event.respondWith(routesPOST[route](event))

    return event.respondWith(new Response(null, { status: 404 }))
})

/** Use to proxy the unsplash search API.
 * @access GET request with unsplash search params appended.
 * @returns Unsplash JSON search response.
 * @see https://unsplash.com/documentation#search-photos
 */
function unsplashSearch(event) {
    const params = new URL(event.request.url).searchParams // query=mountains&page=1
    return fetch(`${URL_SEARCH}?${params}`, { headers: unsplashHeaders })
}

/** Returns a random Unsplash image.
 * @access GET request with no params.
 * @returns Unsplash JSON image response.
 * @see https://unsplash.com/documentation#get-a-random-photo
 */
function unsplashRandom(event) {
    return fetch(URL_RANDOM, { headers: unsplashHeaders })
}

/** Use to trigger a download event as required by the API guidelines.
 * @access POST request with the body as the download url in plain text.
 * @returns 200 on success
 * @see https://help.unsplash.com/en/articles/2511258-guideline-triggering-a-download
 */
async function unsplashDownload(event) {
    const unsplashDownloadUrl = await event.request.text()
    return fetch(unsplashDownloadUrl, { headers: unsplashHeaders })
}
