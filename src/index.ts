import {Sdk, SdkConfig} from './types';
import request from './request';

const DEFAULT_API_URL = 'https://www.eventbriteapi.com/v3';

const eventbrite = ({
    baseUrl = DEFAULT_API_URL,
    token,
}: SdkConfig = {}): Sdk => ({
    request: (endpoint, options = {}) => {
        const url = `${baseUrl}${endpoint}`;
        let requestOptions = options;

        if (token) {
            requestOptions = {
                ...requestOptions,
                headers: {
                    ...(requestOptions.headers || {}),
                    Authorization: `Bearer ${token}`,
                },
            };
        }

        return request(url, requestOptions);
    },
});

export default eventbrite;
