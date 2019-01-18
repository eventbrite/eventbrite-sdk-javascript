# Eventbrite v3 API JavaScript SDK Documentation

This SDK interface closely mirors the [Eventbrite v3 REST API](https://www.eventbrite.com/developer/v3/) endpoints that it wraps. The SDK provides many conveniences for making requests and processing responses to make it easier to use in the JavaScript environment.

## Table of Contents

-   [Including the package](#including-the-package)
-   [Configuring a SDK object](#configuring-a-sdk-object)
-   [`request()`](./request.md)
-   [Users](./users.md)
-   [Organizations](./organizations.md)

## Including the package

First include the `eventbrite` package (depending on your module environment):

### Webpack / Rollup / etc ([ECMAScript modules](https://unpkg.com/eventbrite/lib/esm/)):

```js
import eventbrite from 'eventbrite';
```

### Node / legacy dependency systems ([CommonJS](https://unpkg.com/eventbrite/lib/cjs/) / [Universal Module Definition](https://unpkg.com/eventbrite/lib/umd/)):

```js
const eventbrite = require('eventbrite');
```

### `<script>` [distribution bundle](https://unpkg.com/eventbrite/dist/) include:

```
<script src="https://unpkg.com/eventbrite/dist/eventbrite.min.js"></script>
```

NOTE: `window.Eventbrite` will be a reference to the package.

## Configuring a SDK object

In order to make requests, you need to configure the SDK object.

```js
import eventbrite from 'eventbrite';

// Create configured Eventbrite SDK
const sdk = eventbrite({token: 'OATH_TOKEN_HERE'});
```

You can configure the SDK object with the following properties:

-   `token` - The Eventbrite [OAuth token](https://www.eventbrite.com/developer/v3/api_overview/authentication/#ebapi-getting-a-token)
-   `baseUrl` - The base URL The base URL prepended to endpoints when making API requests (defaults to `'https://www.eventbriteapi.com/v3'`). When using the `'/users/me/'` endpoint, a request would be made to `https://www.eventbriteapi.com/v3/users/me/`. When using [webooks](https://www.eventbrite.com/developer/v3/api_overview/webhooks/), you will receive full API urls, so set the `baseUrl` to empty string (`''`).

```js
import eventbrite from 'eventbrite';

// Create configured Eventbrite SDK
// When all request endpoints will be full URLs
const sdk = eventbrite({
    token: 'OATH_TOKEN_HERE',
    baseUrl: '',
});
```

From then on, you can use `sdk` to make API requests.
