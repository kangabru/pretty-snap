import React from 'react';
import { urls } from '../../misc/constants';
import Patterns from './backgrounds';
import { ColorRow, PatternColours } from './colours';
import QuickPatterns from './presets';

export default function PatternSelector() {
    return <div className="space-y-2">
        <div className="flex flex-col md:flex-row-reverse justify-between items-center space-y-3 md:space-y-0 md:space-x-3">
            <QuickPatterns />
            <PatternColours />
        </div>
        <Patterns />
        <ColorRow />
        <p className="text-gray-800 text-center pt-3">Patterns by <a className="link" href={urls.patterns}>Hero Patterns</a></p>
    </div>
}
