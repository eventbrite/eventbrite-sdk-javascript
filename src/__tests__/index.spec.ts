import eventbrite from '../';
import {
    mockFetch,
    getMockFetch,
    restoreMockFetch,
    getMockResponse
} from './utils';
import {MOCK_USERS_ME_RESPONSE_DATA} from './__fixtures__';

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

    it('makes request to API base url default w/ no token when no configuration is specified', async () => {
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

    it('makes request to API base url override w/ specified token', async () => {
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

    it('properly specifies authorization header token when other header options are already specified', async () => {
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
});
