import React from 'react';
import srcPreview from '../../assets/preview.jpg';
import Compositor from './components/compositor';

export default function PrettyBackground() {
    return <main className="col px-4 space-y-6">
        <Compositor />
        <Info />
        <PH />
    </main>
}

function Info() {
    return <section className="pt-5 grid md:grid-cols-2 gap-5">
        <div className="prose">
            <h2>What is this for?</h2>
            <p>To make boring screenshots awesome! Use them for:</p>
            <ul>
                <li>Product screenshots on landing pages</li>
                <li>Eye catching website <a href="https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary" className="link">summary cards</a></li>
                <li>Better screenshot posts on social media</li>
            </ul>
            <p>Found an issue or have a suggestion? <a href="https://github.com/kangabru/pretty-snap/issues/new" className="link">Let me know here!</a></p>
        </div>
        <img className="rounded-lg shadow w-full max-w-md" src={srcPreview} alt="Example output" />
    </section>
}

function PH() {
    return <a target="_blank"
        href="https://www.producthunt.com/posts/pretty-snap?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-pretty-snap">
        <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=275698&theme=light" alt="Pretty Snap - Make screenshots look 🔥 with a pretty background | Product Hunt" style={{ width: 250, height: 54, }} width="250" height="54" />
    </a>
}
