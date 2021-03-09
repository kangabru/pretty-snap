import { useMemo, useState } from "preact/hooks"
import { useWindowListener } from "./use-misc"

/** Returns whether dev mode is enabled via setting the 'dev' url paramaeter
 * @example Add '?dev=1' to the url.
 */
export default function useDevMode() {

    // Listen for hash changes and toggle a boolean so components will refresh on hash changes
    const setHash = useState(false)[1]
    useWindowListener('hashchange', () => setHash(s => !s), [])

    return useMemo(() => {
        // Extract the search params from the the hash url. /#/annotate?dev=1 -> ?dev=1
        const searchParams = "?" + location.hash.split('?').slice(-1)[0]
        const params = new URLSearchParams(searchParams)
        return !!params.get('dev')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.hash])

}