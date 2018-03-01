/// <reference path="../definitions/url-lib.d.ts"/>

import {formatUrl} from 'url-lib';
import {Sdk, SdkConfig} from './types';
import request from './request';

const DEFAULT_API_URL = 'https://www.eventbriteapi.com/v3';

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
