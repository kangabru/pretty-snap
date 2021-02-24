import { h } from 'preact';
import srcPreview from '../../assets/preview.jpg';
import Compositor from './components/compositor';

export default function PrettyBackground() {
    return <main class="col px-4 space-y-6">
        <Compositor />
        <Info />
        <PH />
    </main>
}

function Info() {
    return <section class="pt-5 grid md:grid-cols-2 gap-5">
        <div class="text-gray-600">
            <h2 class="text-2xl mb-6 font-semibold">What can I use this for?</h2>
            <p>To make boring screenshots awesome! Use them for:</p>
            <ul class="bullets py-5 space-y-3.5">
                <li>Product screenshots on landing pages</li>
                <li>Eye catching website <a class="text-gray-900 underline" href="https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary">summary cards</a></li>
                <li>Better screenshot posts on social media</li>
            </ul>
            <p>Found an issue or have a suggestion? <a class="text-gray-900 underline" href="https://github.com/kangabru/pretty-snap/issues/new">Let me know here!</a></p>
        </div>
        <img class="rounded-lg shadow w-full max-w-md" src={srcPreview} alt="Example output" />
    </section>
}

function PH() {
    return <a target="_blank"
        href="https://www.producthunt.com/posts/pretty-snap?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-pretty-snap">
        <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=275698&theme=light" alt="Pretty Snap - Make screenshots look 🔥 with a pretty background | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" />
    </a>
}
