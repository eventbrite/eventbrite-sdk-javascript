/// <reference path="../definitions/url-lib.d.ts"/>

import {formatUrl} from 'url-lib';
import request from './request';

const DEFAULT_API_URL = 'https://www.eventbriteapi.com/v3';

export interface SdkConfig {
    token?: string;
    baseUrl?: string;
}

export interface Sdk {
    request: (apiPath: string, options?: RequestInit) => Promise<{}>;
}

const eventbrite = ({
    baseUrl = DEFAULT_API_URL,
    token,
}: SdkConfig = {}): Sdk => ({
    request: (endpoint, options?) => {
        let url = `${baseUrl}${endpoint}`;

        if (token) {
            url = formatUrl(url, {token});
        }

        return request(url, options);
    },
});

export default eventbrite;
