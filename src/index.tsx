import { h, render } from 'preact';
import srcPandaSnap from '../assets/pandasnap.jpg';
import srcPreview from '../assets/preview.jpg';
import Compositor from './components/compositor';
import BackgroundSelector from './components/images';
import { urls } from './constants';
import './index.css';

render(<App />, document.getElementById('root') as HTMLElement)

function App() {
    return <div class="col space-y-6 text-gray-800 bg-gray-100 font-open">
        <Header />
        <Compositor />
        <BackgroundSelector />
        <Info />
        <PH />
        <Footer />
    </div>
}

function Header() {
    return <header class="w-full max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 justify-center items-center text-md pt-5 px-3">

        <div class="row space-x-2 row-start-2 md:row-start-1">
            <a class="hidden sm:inline-block w-12 h-12 sm:w-12 sm:h-12 outline-primary hover:shadow rounded-md overflow-hidden transition" target="blank" href={urls.pandasnap}><img src={srcPandaSnap} alt="Panda Snap Logo" class="pointer-events-none" /></a>
            <div class="col items-start whitespace-no-wrap">
                <span>by &nbsp;<a target="blank" class="outline-link font-semibold" href={urls.kangabru}>kangabru</a></span>
                <span>for <a target="blank" class="outline-link font-semibold" href={urls.pandasnap}>pandasnap.io</a></span>
            </div>
        </div>

        <div class="col-span-2 w-full space-y-3 text-center">
            <h1 class="text-4xl font-cursive pr-5">
                <svg class="inline w-12 h-12 mr-1 -mt-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"></path></svg>
                    Pretty Snap
                </h1>
        </div>

        <div class="flex flex-col sm:flex-row items-end sm:items-center sm:justify-end font-semibold">
            <a target="blank" href={urls.share} class="row space-x-2 button-blank">
                <span>Share</span>
                <svg class="w-6 h-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentcolor" class="0" d="M24 4.6c-.9.4-1.8.7-2.8.8 1-.6 1.8-1.6 2.2-2.7-1 .6-2 1-3.1 1.2-.9-1-2.2-1.6-3.6-1.6-2.7 0-4.9 2.2-4.9 4.9 0 .4 0 .8.1 1.1-4.2-.2-7.8-2.2-10.2-5.2-.5.8-.7 1.6-.7 2.5 0 1.7.9 3.2 2.2 4.1-.8 0-1.6-.2-2.2-.6v.1c0 2.4 1.7 4.4 3.9 4.8-.4.1-.8.2-1.3.2-.3 0-.6 0-.9-.1.6 2 2.4 3.4 4.6 3.4-1.7 1.3-3.8 2.1-6.1 2.1-.4 0-.8 0-1.2-.1 2.2 1.4 4.8 2.2 7.5 2.2 9.1 0 14-7.5 14-14v-.6c1-.7 1.8-1.6 2.5-2.5z"></path></svg>
            </a>
            <a target="blank" href={urls.github} class="row space-x-2 button-blank">
                <span>Star</span>
                <svg class="w-6 h-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentcolor" class="0" d="M7.975 16a9.39 9.39 0 003.169-.509c-.473.076-.652-.229-.652-.486l.004-.572c.003-.521.01-1.3.01-2.197 0-.944-.316-1.549-.68-1.863 2.24-.252 4.594-1.108 4.594-4.973 0-1.108-.39-2.002-1.032-2.707.1-.251.453-1.284-.1-2.668 0 0-.844-.277-2.77 1.032A9.345 9.345 0 008 .717c-.856 0-1.712.113-2.518.34C3.556-.24 2.712.025 2.712.025c-.553 1.384-.2 2.417-.1 2.668-.642.705-1.033 1.612-1.033 2.707 0 3.852 2.342 4.72 4.583 4.973-.29.252-.554.692-.642 1.347-.58.264-2.027.692-2.933-.831-.19-.302-.756-1.045-1.549-1.032-.843.012-.34.478.013.667.428.239.919 1.133 1.032 1.422.201.567.856 1.65 3.386 1.184 0 .55.006 1.079.01 1.447l.003.428c0 .265-.189.567-.692.479 1.007.34 1.926.516 3.185.516z"></path></svg>
            </a>
        </div>
    </header>
}

function Info() {
    return <section class="pt-5 grid md:grid-cols-2 gap-5 px-5">
        <div class="prose">
            <h2>What is this for?</h2>
            <p>To make boring screenshots awesome! Use them for:</p>
            <ul>
                <li>Product screenshots on landing pages</li>
                <li>Eye catching website <a href="https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary" target="blank" class="link">summary cards</a></li>
                <li>Better screenshot posts on social media</li>
            </ul>
            <p>Found an issue or have a suggestion? <a href="https://github.com/kangabru/pretty-snap/issues/new" target="blank" class="link">Let me know here!</a></p>
        </div>
        <img class="rounded-lg shadow w-full max-w-md" src={srcPreview} alt="Example output" />
    </section>
}

function PH() {
    return <a class=" md:fixed bottom-5 right-5" target="_blank"
        href="https://www.producthunt.com/posts/pretty-snap?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-pretty-snap">
        <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=275698&theme=light" alt="Pretty Snap - Make screenshots look 🔥 with a pretty background | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" />
    </a>
}

function Footer() {
    return <footer class="pb-10 text-center space-y-3 text-lg">
        <p>Made with 🤙 by <a href={urls.kangabru} target="blank" class="link font-semibold">Kangabru</a></p>
    </footer>
}