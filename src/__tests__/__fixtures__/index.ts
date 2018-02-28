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

export const MOCK_ERROR_RESPONSE_DATA = {
    status_code: 400,
    error: 'INVALID_TEST',
    error_description: 'This is an invalid test',
};
