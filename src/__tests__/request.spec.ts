import request from '../request';
import {
    mockFetch,
    getMockFetch,
    restoreMockFetch,
    getMockResponse
} from './utils';
import {
    MOCK_USERS_ME_RESPONSE_DATA,
    MOCK_INTERNAL_ERROR_RESPONSE_DATA,
    MOCK_ARGUMENTS_ERROR_RESPOSNE_DATA
} from './__fixtures__';

const TEST_URL = 'https://www.eventbriteapi.com/v3/users/me/';

const getSuccessfulCodeRes = () => getMockResponse(MOCK_USERS_ME_RESPONSE_DATA);
const getInternalErrorRes = () =>
    getMockResponse(MOCK_INTERNAL_ERROR_RESPONSE_DATA, {status: 500});
const getArgumentsErrorRes = () =>
    getMockResponse(MOCK_ARGUMENTS_ERROR_RESPOSNE_DATA, {status: 400});

describe('request', () => {
    afterEach(() => {
        restoreMockFetch();
    });

    describe('success cases', () => {
        beforeEach(() => {
            mockFetch(getSuccessfulCodeRes());
        });

        it('calls fetch and calls fetch with appropriate defaults', async () => {
            await request(TEST_URL);

            expect(getMockFetch()).toHaveBeenCalledTimes(1);
            expect(getMockFetch()).toHaveBeenCalledWith(
                TEST_URL,
                expect.objectContaining({
                    credentials: 'same-origin',
                })
            );
        });

        it('calls fetch and adds "application/json" content type when method is not GET', async () => {
            await request(TEST_URL, {method: 'POST', body: '{}'});

            expect(getMockFetch()).toHaveBeenCalledTimes(1);
            expect(getMockFetch()).toHaveBeenCalledWith(
                TEST_URL,
                expect.objectContaining({
                    credentials: 'same-origin',
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json',
                    }),
                    method: 'POST',
                    body: '{}',
                })
            );
        });

        it('calls fetch and respects overrides in options', async () => {
            await request(TEST_URL, {credentials: 'omit'});

            expect(getMockFetch()).toHaveBeenCalledTimes(1);
            expect(getMockFetch()).toHaveBeenCalledWith(
                TEST_URL,
                expect.objectContaining({
                    credentials: 'omit',
                })
            );
        });

        it('calls fetch and respects overrides in option headers', async () => {
            await request(TEST_URL, {
                headers: {
                    'X-TEST': 'testHeader',
                    'X-CSRFToken': 'testCSRF',
                    'Content-Type': 'application/xml',
                },
            });

            expect(getMockFetch()).toHaveBeenCalledTimes(1);
            expect(getMockFetch()).toHaveBeenCalledWith(
                TEST_URL,
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'X-CSRFToken': 'testCSRF',
                        'X-TEST': 'testHeader',
                        'Content-Type': 'application/xml',
                    }),
                })
            );
        });

        it('calls fetch and merges overrides with defaults in option headers', async () => {
            await request(TEST_URL, {
                headers: {
                    'X-TEST': 'testHeader',
                    'X-CSRFToken': 'testCSRF',
                },
                method: 'POST',
                body: '{}',
            });

            expect(getMockFetch()).toHaveBeenCalledTimes(1);
            expect(getMockFetch()).toHaveBeenCalledWith(
                TEST_URL,
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'X-CSRFToken': 'testCSRF',
                        'X-TEST': 'testHeader',
                        'Content-Type': 'application/json',
                    }),
                    method: 'POST',
                    body: '{}',
                })
            );
        });
        it('calls fetch and return parsed response JSON data', async () => {
            await expect(request(TEST_URL)).resolves.toEqual(
                MOCK_USERS_ME_RESPONSE_DATA
            );

            expect(getMockFetch()).toHaveBeenCalledTimes(1);
        });
    });

    describe('error handling', () => {
        it('should reject only with response when response is invalid JSON', async () => {
            const response = new Response('{sa;dfsdfi');

            mockFetch(response);

            await expect(request(TEST_URL)).rejects.toEqual({
                response,
            });
        });

        it('calls fetch and rejects with parsed error when there is a status error', async () => {
            const response = getInternalErrorRes();

            mockFetch(response);

            await expect(request(TEST_URL)).rejects.toEqual({
                response,
                parsedError: {
                    error: MOCK_INTERNAL_ERROR_RESPONSE_DATA.error,
                    description:
                        MOCK_INTERNAL_ERROR_RESPONSE_DATA['error_description'],
                },
            });

            expect(getMockFetch()).toHaveBeenCalledTimes(1);
        });

        it('calls fetch and rejects with parsed argument errors when there is an ARGUMENT_ERROR', async () => {
            const response = getArgumentsErrorRes();

            mockFetch(response);

            await expect(request(TEST_URL)).rejects.toEqual({
                response,
                parsedError: {
                    error: MOCK_ARGUMENTS_ERROR_RESPOSNE_DATA.error,
                    description:
                        MOCK_ARGUMENTS_ERROR_RESPOSNE_DATA['error_description'],
                    argumentErrors:
                        MOCK_ARGUMENTS_ERROR_RESPOSNE_DATA['error_detail'][
                            'ARGUMENTS_ERROR'
                        ],
                },
            });

            expect(getMockFetch()).toHaveBeenCalledTimes(1);
        });
    });
});
