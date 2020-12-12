import eventbrite from '..';
import {
    mockFetch,
    getMockFetch,
    restoreMockFetch,
    getMockResponse,
} from './utils';
import {
    MOCK_USERS_ME_RESPONSE_DATA,
    MOCK_TRANSFORMED_USERS_ME_RESPONSE_DATA,
    MOCK_TRANSFORMED_ORGS_BY_USER,
    MOCK_ORGS_BY_USER_SUCCESS_RESPONSE,
} from './__fixtures__';

describe('configurations', () => {
    it('does not error when creating sdk object w/o configuration', () => {
        expect(() => eventbrite()).not.toThrow();
    });
});

describe('request', () => {
    const MOCK_TOKEN = 'MOCK_TOKEN';
    const MOCK_BASE_URL = '/api/v3';

    beforeEach(() => {
        mockFetch(getMockResponse(MOCK_USERS_ME_RESPONSE_DATA));
    });

    afterEach(() => {
        restoreMockFetch();
    });

    it('makes request to API base url default w/ no token when no configuration is specified', async() => {
        const {request} = eventbrite();

        await expect(request('/users/me/')).resolves.toEqual(
            MOCK_USERS_ME_RESPONSE_DATA
        );

        expect(getMockFetch()).toHaveBeenCalledTimes(1);
        expect(getMockFetch()).toHaveBeenCalledWith(
            'https://www.eventbriteapi.com/v3/users/me/',
            expect.objectContaining({})
        );
    });

    it('makes request to API base url override w/ specified token', async() => {
        const {request} = eventbrite({
            token: MOCK_TOKEN,
            baseUrl: MOCK_BASE_URL,
        });

        await expect(request('/users/me/')).resolves.toEqual(
            MOCK_USERS_ME_RESPONSE_DATA
        );

        expect(getMockFetch()).toHaveBeenCalledTimes(1);
        expect(getMockFetch()).toHaveBeenCalledWith(
            `${MOCK_BASE_URL}/users/me/`,
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${MOCK_TOKEN}`,
                }),
            })
        );
    });

    it('properly specifies authorization header token when other header options are already specified', async() => {
        const {request} = eventbrite({
            token: MOCK_TOKEN,
        });
        const body = JSON.stringify({plan: 'package2'});
        const requestOptions = {
            body,
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': 'CSRF_TOKEN',
            },
        };

        await request('/users/:id/assortment/', requestOptions);

        expect(getMockFetch()).toHaveBeenCalledTimes(1);
        expect(getMockFetch()).toHaveBeenCalledWith(
            'https://www.eventbriteapi.com/v3/users/:id/assortment/',
            expect.objectContaining({
                body,
                method: 'POST',
                headers: expect.objectContaining({
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': 'CSRF_TOKEN',
                    Authorization: `Bearer ${MOCK_TOKEN}`,
                }),
            })
        );
    });

    it('allows passing default request options', async() => {
        const {request} = eventbrite({
            defaultOptions: {credentials: 'same-origin'},
        });

        await expect(request('/users/me/')).resolves.toEqual(
            MOCK_USERS_ME_RESPONSE_DATA
        );

        expect(getMockFetch()).toHaveBeenCalledTimes(1);
        expect(getMockFetch()).toHaveBeenCalledWith(
            'https://www.eventbriteapi.com/v3/users/me/',
            expect.objectContaining({
                credentials: 'same-origin',
            })
        );
    });

    describe('users collection', () => {
        it('should return an object of functions', () => {
            const {users} = eventbrite({
                token: MOCK_TOKEN,
                baseUrl: MOCK_BASE_URL,
            });

            expect(users).toBeDefined();
            Object.keys(users).forEach((key) => {
                const value = (users as any)[key];

                expect(value).toBeInstanceOf(Function);
            });
        });

        it('makes request to API base url override w/ specified token', async() => {
            const {users} = eventbrite({
                token: MOCK_TOKEN,
                baseUrl: MOCK_BASE_URL,
            });

            await expect(users.me()).resolves.toEqual(
                MOCK_TRANSFORMED_USERS_ME_RESPONSE_DATA
            );

            expect(getMockFetch()).toHaveBeenCalledTimes(1);
            expect(getMockFetch()).toHaveBeenCalledWith(
                `${MOCK_BASE_URL}/users/me/`,
                expect.objectContaining({
                    headers: expect.objectContaining({
                        Authorization: `Bearer ${MOCK_TOKEN}`,
                    }),
                })
            );
        });
    });

    describe('organizations collection', () => {
        it('should return an object of functions', () => {
            mockFetch(getMockResponse(MOCK_ORGS_BY_USER_SUCCESS_RESPONSE));

            const {organizations} = eventbrite({
                token: MOCK_TOKEN,
                baseUrl: MOCK_BASE_URL,
            });

            expect(organizations).toBeDefined();
            Object.keys(organizations).forEach((key) => {
                const value = (organizations as any)[key];

                expect(value).toBeInstanceOf(Function);
            });
        });

        it('makes request to API base url override w/ specified token', async() => {
            mockFetch(getMockResponse(MOCK_ORGS_BY_USER_SUCCESS_RESPONSE));

            const {organizations} = eventbrite({
                token: MOCK_TOKEN,
                baseUrl: MOCK_BASE_URL,
            });

            await expect(organizations.getByUser('fake_id')).resolves.toEqual(
                MOCK_TRANSFORMED_ORGS_BY_USER
            );

            expect(getMockFetch()).toHaveBeenCalledTimes(1);
            expect(getMockFetch()).toHaveBeenCalledWith(
                `${MOCK_BASE_URL}/users/fake_id/organizations/`,
                expect.objectContaining({
                    headers: expect.objectContaining({
                        Authorization: `Bearer ${MOCK_TOKEN}`,
                    }),
                })
            );
        });
    });
});
