import {extend} from 'just-extend';
import {Sdk, SdkConfig, JSONRequest} from './types';
import request from './request';
import {UserApi} from './users';
import {OrganizationsApi} from './organizations';

export * from './constants';

const DEFAULT_API_URL = 'https://www.eventbriteapi.com/v3';

type MakeRequestFunction = (
    baseUrl: string,
    token: string,
    defaultOptions?: object
) => JSONRequest;

const makeRequest: MakeRequestFunction = (
    baseUrl: string,
    token: string,
    defaultOptions: object = {}
) => (endpoint, options = {}) => {
    const url = `${baseUrl}${endpoint}`;
    let requestOptions = options;

    if (token) {
        requestOptions = extend(
            true,
            defaultOptions,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
            options
        );
    }

    return request(url, requestOptions);
};

const eventbrite = ({
    baseUrl = DEFAULT_API_URL,
    token,
    defaultOptions,
}: SdkConfig = {}): Sdk => {
    const jsonRequest = makeRequest(baseUrl, token, defaultOptions);

    return {
        request: jsonRequest,
        users: new UserApi(jsonRequest),
        organizations: new OrganizationsApi(jsonRequest),
    };
};

export default eventbrite;
