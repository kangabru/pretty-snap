/**
 * This is a Cloudflare worker script used to proxy unsplash API calls.
 *
 * Requires the following environment variable:
 *      ACCESS_KEY - Your unsplash access key
 *
 * @see https://workers.cloudflare.com/
 */

const URL_BASE = "https://api.unsplash.com/search/photos"

const routesGET = {
    "/splash": unsplash,
}

addEventListener("fetch", event => {
    const request = event.request

    // Handle any route requests
    const route = new URL(request.url).pathname
    if (request.method === "GET" && routesGET[route])
        return routesGET[route](event)

    // Pass the request forward
    return event.respondWith(fetch(request))
})

function unsplash(event) {
    const params = new URL(event.request.url).searchParams // query=mountains&page=1
    return event.respondWith(fetch(`${URL_BASE}?${params}`, {
        headers: {
            'Accept-Version': 'v1',
            'Authorization': `Client-ID ${ACCESS_KEY}`
        }
    }))
}