import {JSONResponseData, ParsedResponseError} from './types';
import 'isomorphic-fetch';

/**
 * Return a promise that is resolved or rejected depending on the response's
 * status code.
 */
const _checkStatus = (res: Response): Promise<Response> => {
    if (res.status >= 400) {
        // Need to wrap the response in an object so that it matches the same error object
        // returned by _catchStatusError
        return Promise.reject(res);
    }
    return Promise.resolve(res);
};

const _tryParseJSON = (res: Response): Promise<any> => {
    try {
        return (
            res
                .json()

                // if JSON cannot parse, it'll return a rejected promise instead
                // of throwing an error, so we catch that rejection so that we can rejected
                // with the response like everything else expects
                .catch(() => Promise.reject(res))
        );
    } catch (error) {
        return Promise.reject(res);
    }
};

/**
 * Calls fetch on provided url with default options necessary for interacting
 * with our JSON API. Parses the JSON, provides appropriate headers, and asserts
 * a valid status from the server.
 */
export const _fetchJSON = (
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
        .then(_checkStatus)
        .then(_tryParseJSON);
};

const _hasArgumentsError = (responseData: JSONResponseData): boolean =>
    !!(
        responseData['error_detail'] &&
        responseData['error_detail']['ARGUMENTS_ERROR']
    );

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
const _parseError = (responseData: JSONResponseData): ParsedResponseError => {
    if (!responseData.error) {
        // Weird error format, return null
        return null;
    }

    let error = {
        error: responseData.error,
        description: responseData['error_description'],
    } as ParsedResponseError;

    if (_hasArgumentsError(responseData)) {
        error = {
            ...error,
            argumentErrors: responseData['error_detail']['ARGUMENTS_ERROR'],
        };
    }

    return error;
};

/**
 * Designed to work with `_checkStatus`, or any function that
 * raises an error on an invalid status. The error raised should have a `response`
 * property with the original response object.
 *
 * Example usage:
 *
 * _fetchJSON('/api/v3/test/path', {'body': someData})
 *     .catch(_catchStatusError)
 *     .then(doSomethingOnSuccess)
 *     .catch(({response, parsedError}) => doSomethingOnError());
 */
const _catchStatusError = (res: Response): Promise<any> =>
    new Promise((resolve, reject) => {
        _tryParseJSON(res)
            // handled error, so reject with parsed error data along with response
            .then((responseData: JSONResponseData) =>
                reject({
                    response: res,
                    parsedError: _parseError(responseData),
                })
            )

            // Unhandled error
            .catch(() =>
                reject({
                    response: res,
                })
            );
    });

/**
 * Low-level method that makes fetch requests, returning the response formatted as JSON.
 * It parses errors from API v3 and throws exceptions with those errors
 */
export default (url: string, options?: RequestInit): Promise<{}> =>
    _fetchJSON(url, options).catch(_catchStatusError);
