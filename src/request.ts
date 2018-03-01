import {isPlainObject} from 'lodash';
import {JSONResponseData, ParsedResponseError} from './types';
import 'isomorphic-fetch';

/**
 * Return a promise that is resolved or rejected depending on the response's
 * status code.
 */
export const checkStatus = (res: Response): Promise<Response> => {
    if (res.status >= 300) {
        return Promise.reject(res);
    }
    return Promise.resolve(res);
};

/**
 * Calls fetch on provided url with default options necessary for interacting
 * with our JSON API. Parses the JSON, provides appropriate headers, and asserts
 * a valid status from the server.
 */
export const fetchJSON = (
    url: string,
    {headers, method, mode, ...options}: RequestInit = {}
): Promise<{}> => {
    let fetchHeaders = headers as HeadersInit;

    if (method !== 'GET') {
        fetchHeaders = {
            'Content-Type': 'application/json',
            ...headers,
        };
    }

    const fetchOptions = {
        method,
        mode,
        headers: fetchHeaders,
        credentials: mode === 'cors' ? 'include' : 'same-origin',
        ...options,
    } as RequestInit;

    return fetch(url, fetchOptions)
        .then(checkStatus)
        .then((res: Response) => {
            let resJSON = {};

            if ('json' in res) {
                resJSON = res.json();
            }

            return resJSON;
        });
};

const hasArgumentsError = (responseData: JSONResponseData): boolean =>
    isPlainObject(responseData['error_detail']) &&
    isPlainObject(responseData['error_detail']['ARGUMENTS_ERROR']);

/**
 * Parse v3 errors into an array of objects representing the errors returned by
 * the API. The format of the parsed errors looks like:
 *
 *  {
 *      status_code: 400,
 *      error: 'ERROR_CODE',
 *      description: 'Description of the error
 *  }
 *
 * An ARGUMENTS_ERROR looks like:
 *
 *  {
 *      error: 'ARGUMENTS_ERROR',
 *      description: 'Some of the fields were invalid or something',
 *      argumentErrors: {
 *          attr1: ['INVALID'],
 *          attr2: ['This field is required']
 *      }
 *  }
 *
 */
export const parseError = (
    responseData: JSONResponseData
): ParsedResponseError => {
    if (!responseData.error) {
        // Weird error format, return null
        return null;
    }

    let error = {
        error: responseData.error,
        description: responseData['error_description'],
    } as ParsedResponseError;

    if (hasArgumentsError(responseData)) {
        error.argumentErrors = responseData['error_detail']['ARGUMENTS_ERROR'];
    }

    return error;
};

/**
 * Designed to work with `checkStatus`, or any function that
 * raises an error on an invalid status. The error raised should have a `response`
 * property with the original response object.
 *
 * Example usage:
 *
 * fetchJSON('/api/v3/test/path', {'body': someData})
 *     .catch(catchStatusError)
 *     .catch(({response, parsedError}) => doSomethingOnError())
 *     .then(doSomethingOnSuccess);
 */
export const catchStatusError = (response: Response): Promise<any> =>
    new Promise((resolve, reject) => {
        response
            .json()
            .then((responseData) => parseError(responseData))
            .then((parsedError) => reject({response, parsedError}))
            .catch(() => reject({response}));
    });

/**
 * fetchV3 is a simple wrapper for http/fetchJSON that parses v3 errors received
 * by the API.
 */
export default (url: string, options?: RequestInit): Promise<{}> =>
    fetchJSON(url, options).catch(catchStatusError);
