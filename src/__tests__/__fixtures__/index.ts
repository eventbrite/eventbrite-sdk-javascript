export const MOCK_USERS_ME_RESPONSE_DATA = {
    emails: [
        {
            email: 'engineer@eventbrite.com',
            verified: true,
            primary: true,
        },
    ],
    id: '142429416488',
    name: 'Eventbrite Engineer',
    first_name: 'Eventbrite',
    last_name: 'Engineer',
    is_public: false,
    image_id: null as string,
};

export const MOCK_TRANSFORMED_USERS_ME_RESPONSE_DATA = {
    emails: [
        {
            email: 'engineer@eventbrite.com',
            verified: true,
            primary: true,
        },
    ],
    id: '142429416488',
    name: 'Eventbrite Engineer',
    firstName: 'Eventbrite',
    lastName: 'Engineer',
    isPublic: false,
    imageId: null as string,
};

export const MOCK_INTERNAL_ERROR_RESPONSE_DATA = {
    status_code: 500,
    error: 'INTERNAL_ERROR',
    error_description: 'An unhandled error occured in Eventbrite.',
};

export const MOCK_ARGUMENTS_ERROR_RESPOSNE_DATA = {
    status_code: 400,
    error_detail: {ARGUMENTS_ERROR: {status: ['INVALID']}},
    error_description: 'There are errors with your arguments: status - INVALID',
    error: 'ARGUMENTS_ERROR',
};

export const MOCK_ORGS_BY_USER_SUCCESS_RESPONSE = {
    organizations: [
        {
            id: '1',
            name: 'Organization 1',
        },
        {
            id: '2',
            name: 'Organization 2',
        },
        {
            id: '3',
            name: 'Organization 3',
        },
    ],
};
