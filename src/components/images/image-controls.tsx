import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { quickSearches } from '../../constants';
import { QuickSearch as QuickSearch } from '../../types';
import useOptionsStore from '../stores/options';
import useUnsplashStore from '../stores/unsplash';
import { join, srcToUrl } from '../utils';

/** Renders the search bar and quick search button controls used to select unsplash images. */
export default function Controls() {
    return <div class="col sm:flex-row sm:justify-between space-y-3 sm:space-y-0 sm:space-x-3">
        <SearchInput />
        <QuickSearchButtons />
    </div>
}

function SearchInput() {
    const isSearching = useUnsplashStore(s => s.isSearching)

    // Use local state to maintain the internal search input value
    const [inputValue, setInputValue] = useState<string | null | undefined>(() => useUnsplashStore.getState().searchTerm) // Get once

    // Update the input value on external state changes (like via quick search buttons)
    useEffect(() => useUnsplashStore.subscribe(setInputValue, state => state.searchTerm), [])

    // Update the inernal value on keyboard presses, and submit a new search on enter
    const update = (e: KeyboardEvent) => e.key == "Enter"
        ? useUnsplashStore.setState({ searchTerm: inputValue ?? "" })
        : setInputValue((e.target as HTMLInputElement).value)

    return <div class={join("row justify-center sm:justify-start rounded border-b-2 pl-2 border-gray-200 focus-within:border-primary-light",
        isSearching && "bg-gray-100 opacity-50")}>
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>

        <input disabled={isSearching} onKeyUp={update} value={inputValue ?? ""} type="text" placeholder="Search Unsplash"
            class="px-3 py-2 outline-none disabled:bg-transparent rounded transition" />
    </div>
}

/** Renders the little image icons used to run common search queries */
function QuickSearchButtons() {
    return <div class="row flex-wrap justify-center pr-4">
        {quickSearches.map(qs => <QuickSearch {...qs} />)}
    </div>
}

function QuickSearch({ searchTerm, thumb, ...background }: QuickSearch) {
    const onClick = () => {
        useUnsplashStore.setState({ searchTerm })
        useOptionsStore.getState().setImage(background)
    }
    return <button onClick={onClick} title={searchTerm} style={{ backgroundImage: srcToUrl(thumb) }}
        class="w-12 h-12 m-1 -mr-4 z-0 bg-cover rounded-full shadow hover:shadow-md border-white border-2 transform hover:scale-105 outline-primary" />
}
