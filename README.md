# Eventbrite JavaScript SDK

> NOTE: This library is still in alpha and under initial development.

## Installation

Coming soon...

## Usage

```js
const eventbrite = require('eventbrite');

// Create configured Eventbrite SDK
const sdk = eventbrite({token: 'OATH_TOKEN_HERE'});

// See: https://www.eventbrite.com/developer/v3/endpoints/users/#ebapi-get-users-id
sdk.request('/users/me').then(res => {
    // handle response data
});
```

Read more on [getting a token](https://www.eventbrite.com/developer/v3/api_overview/authentication/#ebapi-getting-a-token).

## Contributing

Coming soon...

## Project philosophy

We take the stability of this SDK **very** seriously. `eventbrite` follows the [SemVer](http://semver.org/) standard for versioning.

## License

The library is available as open source under the terms of the [MIT License](LICENSE).
