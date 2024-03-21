import _ from "lodash";
import {useState} from "react";

function randomPercent() {
    return _.random(-10, 10, true);
}

export function RandomPercent(props: { color?: boolean }) {
    const {
        color = true
    } = props;

    const [num] = useState(randomPercent())

    let fontClass = '';
    let prefix = '';
    if (num < 0) {
        if (color) fontClass = 'downColor';
        // prefix = '-';
    } else if (num > 0) {
        if (color) fontClass = 'upColor';
        prefix = '+';
    }

    return (
        <span className={fontClass}>{prefix}{ num.toFixed(1) }%</span>
    )
}