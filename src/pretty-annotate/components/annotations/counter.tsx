import { h } from 'preact';
import { Style, StyleData } from '../../misc/types';

type CountereProps = StyleData<Style.Counter>

export default function Counter({ count: value, left, top }: CountereProps) {
    return <div class="absolute bg-black w-8 h-8 rounded-full text-white font-bold text-xl font-mono grid place-items-center select-none transform -translate-x-6 -translate-y-6" style={{ left, top }}>
        {value}
    </div>
}
