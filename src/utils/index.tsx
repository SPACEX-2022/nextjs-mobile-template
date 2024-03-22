import _ from "lodash";
import React, {useEffect, useState} from "react";

export function random(min: number, max: number, floatCount: number = 0) {
    return parseFloat(_.random(min, max, floatCount !== 0).toFixed(floatCount));
}

interface RandomPercentProps {
    min?: number,
    max?: number,
    floatCount?: number,
    color?: boolean,
    symbol?: boolean,
    percentSymbol?: boolean,
    suffix?: string,
    number?: number,
    ruler?: number,
    noDecimalZeros?: boolean,
}

export function RandomPercent(props: RandomPercentProps) {
    const {
        min = -10,
        max = 10,
        floatCount = 1,
        color = true,
        symbol = true,
        percentSymbol = true,
        suffix = '',
        number ,
        ruler ,
        noDecimalZeros = false,
    } = props;

    const [num, setNum] = useState(number == null ? random(min, max, floatCount) : number)

    useEffect(() => {
        if (number != null) {
            setNum(number);
        }
    }, [number]);

    let fontClass = '';
    let prefix = '';
    if ((ruler == null ? num : ruler) < 0) {
        if (color) fontClass = 'downColor';
    } else if ((ruler == null ? num : ruler) > 0) {
        if (color) fontClass = 'upColor';
        if (symbol) prefix = '+';
    }

    return (
        <span className={fontClass}>{prefix}{noDecimalZeros ? (String(num).split('.').length > 1 ? num.toFixed(floatCount) : num) : num.toFixed(floatCount)}{percentSymbol ? '%' : '' }{ suffix }</span>
    )
}