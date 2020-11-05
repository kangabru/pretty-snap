import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { QuickSearch as QuickSearchButton, quickSearches } from '../../constants';
import useUnsplashStore from '../stores/unsplash';
import { join, srcToUrl } from '../utils';

export default function Controls() {
    return <div class="col sm:flex-row sm:justify-between space-y-3 sm:space-y-0 sm:space-x-3">
        <SearchInput />
        <QuickSearchButtons />
    </div>
}

function SearchInput() {
    const isSearching = useUnsplashStore(s => s.isSearching)
    const [newTerm, setNewTerm] = useState<string | null | undefined>(useUnsplashStore.getState().searchTerm)
    useEffect(() => useUnsplashStore.subscribe(setNewTerm, state => state.searchTerm), [])

    const update = (e: KeyboardEvent) => e.key == "Enter"
        ? useUnsplashStore.setState({ searchTerm: newTerm ?? "" })
        : setNewTerm((e.target as HTMLInputElement).value)

    return <div class={join("row justify-center sm:justify-start rounded border-b-2 pl-2 border-gray-200 focus-within:border-primary-light",
        isSearching && "bg-gray-100 opacity-50")}>
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>

        <input disabled={isSearching} onKeyUp={update} value={newTerm ?? ""} type="text" placeholder="Search unsplash.com"
            class="px-3 py-2 outline-none disabled:bg-transparent rounded transition" />
    </div>
}

function QuickSearchButtons() {
    return <div class="row flex-wrap justify-center">
        <QuickSearchButton {...quickSearches.nature} />
        <QuickSearchButton {...quickSearches.mountain} />
        <QuickSearchButton {...quickSearches.palm} />
        <QuickSearchButton {...quickSearches.yosemite} />
        <QuickSearchButton {...quickSearches.summer} />
        <QuickSearchButton {...quickSearches.snow} />
        <QuickSearchButton {...quickSearches.sun} />
        <QuickSearchButton {...quickSearches.abstract} />
    </div>
}

function QuickSearchButton({ searchTerm, thumb: src }: QuickSearchButton) {
    const onClick = () => useUnsplashStore.setState({ searchTerm })
    return <button onClick={onClick} title={searchTerm} style={{ backgroundImage: srcToUrl(src) }} class="w-12 h-12 m-1 bg-cover rounded-full shadow-sm hover:shadow outline-primary" />
}
