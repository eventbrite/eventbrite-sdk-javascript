# `request()`

`request()` is the Promise-based, low-level function for making [`fetch`](https://github.com/matthew-andrews/isomorphic-fetch) requests to the Eventbrite v3 REST API, returning responses as JSON. The higher-level convenience endpoint functions use `request()` under the hood for making their requests. We suggest that you use the convenience endpoint functions over `request()`. But there may be cases where new or updated endpoints exist withing the REST API, and the SDK has not yet been updated to provide convenience functions.

`request()` provides additional request and response handling over `fetch`.

For requests it:

*   Prepends a configurable base URL to the endpoint you specify (see [Configuring a SDK object](./#configuring-a-sdk-object))
*   Adds your [OAuth token](https://www.eventbrite.com/developer/v3/api_overview/authentication/#ebapi-getting-a-token) in the request `Authorization` header
*   Sets the appropriate `Content-type` header depending on the `fetch` `method` (`GET`, `POST`, etc.) configuration you use
*   Sets the appropriate `credentials` setting depending on the `fetch` `mode` (`cors`, etc.) configuration you use

For responses it:

*   Returns a resolved `Promise` with the response data parsed as JSON
*   If the HTTP status is in the 400 or 500 range, returns a rejected `Promise` with parsed API errors, [if applicable](#error-handling)

## API

The TypeScript function definition of `request()` is:

```
(endpoint: string, options?: RequestInit): Promise<{}>
```

### Parameters

`request()` accepts the following parameters:

*   `endpoint`: The Eventbrite v3 API endpoint path, such as `/users/me/`. This will be appended to the `baseUrl` defined when [configuring the SDK object](./#configuring-a-sdk-object).
*   `options`: The request initialization options that [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) accepts. Your [OAuth token](https://www.eventbrite.com/developer/v3/api_overview/authentication/#ebapi-getting-a-token) will be added to the request `Authorization` header for you. Some additional options you may need to pass in are:
    *   `options.method`: The [HTTP method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) (e.g. `GET`, `POST`, etc.) for the fetch. Non-`GET` requests add `application/json` as `Content-Type` by default.
    *   `options.mode`: The request mode (e.g. `cors`, `same-origin`, etc.) for the fetch. Defaults the `credentials` option to `include` when `mode` is `cors`. Otherwise the `credentials` default to `same-origin`.

### Response

The return value from `request()` is a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) that contains the response from the API call. If the response is successful, the response data will be parsed as JSON.

See the [Error Handling](#error-handling) section for more information on the default error handling that `request()` provides.

## Examples

The simplest approach is to use ES2015 Promises:

```js
const eventbrite = require('eventbrite');

// Create configured Eventbrite SDK
const sdk = eventbrite({token: 'OATH_TOKEN_HERE'});

// See: https://www.eventbrite.com/developer/v3/endpoints/users/#ebapi-get-users-id
sdk.request('/users/me').then(user => {
    console.log(`Hi ${user.name}!`);
});
```

## Error Handling

To make interacting with the Eventbrite API easier, the SDK handles and parses some additional errors by default.

When an error occurs during an API request, the Eventbrite v3 API will send a response with an error HTTP status (in the 400 or 500 range), as well as a JSON response containing more information about the error:

```json
{
    "status_code": 404,
    "error_description": "The user you requested does not exist.",
    "error": "NOT_FOUND"
}
```

The SDK recognizes that an error has occurred (by inspecting the HTTP status code) and returns a **rejected** promise with an object that contains the errored response as the `response` property and error information in the `parsedError` property. This way you can easily distinguish whether or not your API request succeeded or failed:

```js
const eventbrite = require('eventbrite');

// Create configured Eventbrite SDK
const sdk = eventbrite({token: 'OATH_TOKEN_HERE'});

// BAD User ID
const userId = '123456789';

// See: https://www.eventbrite.com/developer/v3/endpoints/users/#ebapi-get-users-id
sdk
    .request(`/users/${userId}`)
    .then(user => {
        // Successful response
        console.log(`Hi ${user.name}!`);
    })
    .catch(errInfo => {
        // An error occurred
        // Original error response is passed in `response` property
        console.error(errInfo.response['error_description']);

        // `ARGUMENT_ERROR` errors are parsed into `parsedError` property
        const parsedError = errorInfo.parsedError;

        // equivalent to errorInfo.response.error
        console.log(parsedError.error);

        // equivalent to errorInfo.response['error_description']
        console.log(parsedError.description);
    });
```

Read more about [Errors](https://www.eventbrite.com/developer/v3/api_overview/errors/) within the Eventbrite v3 API.

One of the [Common Errors](https://www.eventbrite.com/developer/v3/api_overview/errors/#ebapi-common-errors) in the Eventbrite v3 API, is the `ARGUMENTS_ERROR` error (returned with `400` HTTP code). This happens when one of the parameters passed to the API call is invalid. You would get a response like:

```json
{
    "status_code": 400,
    "error_detail": {
        "ARGUMENTS_ERROR": {
            "status": ["INVALID"]
        }
    },
    "error_description":
        "There are errors with your arguments: status - INVALID",
    "error": "ARGUMENTS_ERROR"
}
```

It includes an `error_detail` property that contains additional data about the offending parameters. The SDK parses the `ARGUMENT_ERROR` data within `error_detail` adding it to the `parsedError` property in the rejected promise as the `argumentErrors` property:

```js
const eventbrite = require('eventbrite');

// Create configured Eventbrite SDK
const sdk = eventbrite({token: 'OATH_TOKEN_HERE'});

// See: https://www.eventbrite.com/developer/v3/endpoints/users/#ebapi-get-users-id-events
sdk
    .request('/users/me/events?status=blah')
    .then(user => {
        // Successful response
        console.log(`Hi ${user.name}!`);
    })
    .catch(errInfo => {
        // An error occurred
        // Original error response is passed in `response` property
        console.error(errInfo.response['error_description']);

        // `ARGUMENT_ERROR` errors are parsed into `parsedError` property
        const parsedError = errorInfo.parsedError;

        // equivalent to errorInfo.response['error_detail']['ARGUMENT_ERROR']
        console.log(parsedError.argumentErrors);

        // equivalent to errorInfo.response.error (would be "ARGUMENT_ERROR")
        console.log(parsedError.error);

        // equivalent to errorInfo.response['error_description']
        console.log(parsedError.description);
    });
```
