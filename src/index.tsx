import { h, render } from 'preact';
import PrettyBackground from './pretty-bg/index'
import './index.css';

render(<App />, document.getElementById('root') as HTMLElement)

function App() {
    return <PrettyBackground />
}
