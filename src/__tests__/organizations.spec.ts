import {
    mockFetch,
    getMockFetch,
    getMockResponse,
    restoreMockFetch,
} from './utils';
import {
    MOCK_ORGS_BY_USER_SUCCESS_RESPONSE,
    MOCK_TRANSFORMED_ORGS_BY_USER,
} from './__fixtures__';

import request from '../request';
import {OrganizationsApi} from '../organizations';

describe('OrganizationsApi', () => {
    describe('getByUser()', () => {
        it('calls fetch and calls fetch with appropriate defaults', async() => {
            const organizations = new OrganizationsApi(request);

            mockFetch(getMockResponse(MOCK_ORGS_BY_USER_SUCCESS_RESPONSE));

            await expect(organizations.getByUser('fake_id')).resolves.toEqual(
                MOCK_TRANSFORMED_ORGS_BY_USER
            );

            expect(getMockFetch()).toHaveBeenCalledTimes(1);
            expect(getMockFetch()).toHaveBeenCalledWith(
                '/users/fake_id/organizations/',
                expect.objectContaining({})
            );

            restoreMockFetch();
        });

        it('handle token missing requests', async() => {
            const organizations = new OrganizationsApi(request);

            mockFetch(
                getMockResponse(
                    {
                        status_code: 401,
                        error_description:
                            'An OAuth token is required for all requests',
                        error: 'NO_AUTH',
                    },
                    {status: 401}
                )
            );

            await expect(
                organizations.getByUser('fake_id')
            ).rejects.toMatchObject({
                response: expect.objectContaining({
                    status: 401,
                    statusText: 'Unauthorized',
                    ok: false,
                }),
                parsedError: {
                    description: 'An OAuth token is required for all requests',
                    error: 'NO_AUTH',
                },
            });

            restoreMockFetch();
        });
    });
});
