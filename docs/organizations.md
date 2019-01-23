# Organizations

This is a collection of methods that are intended to be helpful wrappers around the [organizations API endpoints](organization-api-docs).

View the [Organizations response object](organization-object-reference) for details on the properties you'll get back with each response.

## Table on Contents

- [`sdk.organizations.getByUser(id)`](#getByUser)

<a id="getByUser"></a>

## `sdk.organizations.getByUser(id)`
Gets the details for a specific user by their user id. 

**Read [`/users/:userId/organizations/` documentation](organization-by-user) for more details.**

### API
```js
sdk.organizations.getByUser(userId: string): Promise<Paginated<Organization[]>>
```

### Example

```js
const eventbrite = require('eventbrite');

// Create configured Eventbrite SDK
const sdk = eventbrite({token: 'OATH_TOKEN_HERE'});

sdk.organizations.getByUser('1234567890').then((paginatedResponse) => {
    console.log(`Here are your organizations: ${paginatedResponse.organizations.join(' ')}.`);
});
```

<!-- link reference section -->
[organization-api-docs]: https://www.eventbrite.com/platform/api#/reference/organization
[organization-object-reference]: https://www.eventbrite.com/platform/api#/reference/organization
[organization-by-user]: https://www.eventbrite.com/platform/api#/reference/organization/list-organizations-by-user