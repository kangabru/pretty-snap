/**
 * This is a Cloudflare worker script used to proxy unsplash API calls.
 *
 * Requires the following environment variable:
 *      ACCESS_KEY - Your unsplash access key
 *
 * @see https://workers.cloudflare.com/
 */

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const url = request.url

    // Look for valid params
    if (url.search(/\?/) == -1)
        return new Response('No params provided', { status: 400 })

    // Pass query onwards
    const params = url.match(/\?.*/)[0] // '?page=1&query=nature'
    return fetch('https://api.unsplash.com/search/photos' + params, {
        headers: {
            'Accept-Version': 'v1',
            'Authorization': `Client-ID ${ACCESS_KEY}`
        }
    })
}