import { Fragment, h, render } from 'preact';
import './index.css';
render(<App />, document.getElementById('root') as HTMLElement)

function App() {
    return <div class="col p-5 space-y-5">
        <h1 class="text-6xl row space-x-5">
            <span>📷 Pretty Snap</span>
        </h1>
    </div>
}
