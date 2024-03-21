import _ from "lodash";
import {useState} from "react";

function randomPercent() {
    return _.random(-10, 10, true);
}

export function RandomPercent(props: { color?: boolean, symbol?: boolean }) {
    const {
        color = true,
        symbol = true,
    } = props;

    const [num] = useState(randomPercent())

    let fontClass = '';
    let prefix = '';
    if (num < 0) {
        if (color) fontClass = 'downColor';
    } else if (num > 0) {
        if (color) fontClass = 'upColor';
        if (symbol) prefix = '+';
    }

    return (
        <span className={fontClass}>{prefix}{ num.toFixed(1) }%</span>
    )
}