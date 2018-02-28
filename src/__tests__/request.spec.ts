import request, {checkStatus, fetchJSON, catchStatusError} from '../request';
import {
    mockFetch,
    getMockFetch,
    restoreMockFetch,
    getMockResponse
} from './utils';
import {
    MOCK_USERS_ME_RESPONSE_DATA,
    MOCK_ERROR_RESPONSE_DATA
} from './__fixtures__';

const TEST_URL = 'https://www.eventbriteapi.com/v3/users/me/';

const getSuccessfulCodeRes = () => getMockResponse(MOCK_USERS_ME_RESPONSE_DATA);
const getUnsuccessfulCodeRes = () =>
    getMockResponse(MOCK_ERROR_RESPONSE_DATA, {status: 400});

describe('checkStatus', () => {
    describe('on receiving an invalid status', () => {
        const response = getUnsuccessfulCodeRes();

        it('returns a rejected promise', async () => {
            await expect(checkStatus(response)).rejects.toBe(response);
        });
    });

    describe('on receiving a valid status', () => {
        it('returns a fulfilled promise', async () => {
            const response = getSuccessfulCodeRes();

            await expect(checkStatus(response)).resolves.toBe(response);
        });
    });
});

describe('fetchJSON', () => {
    afterEach(() => {
        restoreMockFetch();
    });

    describe('on receiving successful status code', () => {
        beforeEach(() => {
            mockFetch(getSuccessfulCodeRes());
        });

        it('calls fetch with appropriate defaults', async () => {
            await fetchJSON(TEST_URL);

            expect(getMockFetch()).toHaveBeenCalledTimes(1);
            expect(getMockFetch()).toHaveBeenCalledWith(
                TEST_URL,
                expect.objectContaining({
                    credentials: 'same-origin',
                })
            );
        });

        it('adds "application/json" content type when method is not GET', async () => {
            await fetchJSON(TEST_URL, {method: 'POST', body: '{}'});

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

        it('respects overrides in options', async () => {
            await fetchJSON(TEST_URL, {credentials: 'omit'});

            expect(getMockFetch()).toHaveBeenCalledTimes(1);
            expect(getMockFetch()).toHaveBeenCalledWith(
                TEST_URL,
                expect.objectContaining({
                    credentials: 'omit',
                })
            );
        });

        it('respects overrides in option headers', async () => {
            await fetchJSON(TEST_URL, {
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

        it('merges overrides with defaults in option headers', async () => {
            await fetchJSON(TEST_URL, {
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

        it('should parse the response JSON', async () => {
            await expect(fetchJSON(TEST_URL)).resolves.toEqual(
                MOCK_USERS_ME_RESPONSE_DATA
            );
        });
    });

    describe('on receiving an unsuccessful status code', () => {
        beforeEach(() => {
            mockFetch(getUnsuccessfulCodeRes());
        });

        it('should throw an error', async () => {
            await expect(fetchJSON(TEST_URL)).rejects.toEqual(
                expect.objectContaining({status: 400})
            );
        });
    });
});

describe('catchStatusError', () => {
    describe('when response is invalid JSON', () => {
        it('should reject without parsed errors, only response', async () => {
            const response = new Response('{sa;dfsdfi');

            await expect(catchStatusError(response)).rejects.toEqual({
                response,
            });
        });
    });

    describe('when response is valid JSON', () => {
        it('should reject with parsed errors', async () => {
            const response = getUnsuccessfulCodeRes();

            await expect(catchStatusError(response)).rejects.toEqual({
                response,
                parsedError: {
                    error: 'INVALID_TEST',
                    description: 'This is an invalid test',
                },
            });
        });
    });
});

describe('request', () => {
    afterEach(() => {
        restoreMockFetch();
    });

    describe('when no status error', () => {
        beforeEach(() => {
            mockFetch(getSuccessfulCodeRes());
        });

        it('calls fetch and return JSON data', async () => {
            await expect(request(TEST_URL)).resolves.toEqual(
                MOCK_USERS_ME_RESPONSE_DATA
            );

            expect(getMockFetch()).toHaveBeenCalledTimes(1);
        });
    });

    describe('when there is a status error', () => {
        it('calls fetch and rejects with parsed error', async () => {
            const response = getUnsuccessfulCodeRes();

            mockFetch(response);

            await expect(request(TEST_URL)).rejects.toEqual({
                response,
                parsedError: {
                    error: 'INVALID_TEST',
                    description: 'This is an invalid test',
                },
            });

            expect(getMockFetch()).toHaveBeenCalledTimes(1);
        });
    });
});
