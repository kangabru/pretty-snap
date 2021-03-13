import { h } from 'preact';
import { Children } from '../misc/types';

export default function AppInfo({ image, children }: Children & { image: string }) {
    return <section class="grid md:grid-cols-2 gap-5 place-items-center" aria-label="App usage information">
        <div class="text-gray-600">{children}</div>
        <img class="rounded-lg shadow w-full max-w-md" src={image} alt="App screenshot" />
    </section>
}