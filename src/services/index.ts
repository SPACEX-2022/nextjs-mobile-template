import { merge } from 'lodash-es';

export function request(url: string, options: RequestInit = {}) {
    return fetch(url, merge({
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
    }, options)).then(res => {
        return res.json()
    })
}