// NOTE: Typescript is pretty unhappy with us mocking and reading from `global.fetch` since
// `isomorphic-fetch` doesn't properly describe that `global.fetch` is now a thing. It also
// does understand what `jest.spyOn` is doing to `global.fetch`. Therefore we have some
// Typescript definitions along with helpers to consolidate everything into a single place.

declare type Fetch = (url: string, options: RequestInit) => Promise<Response>;

// A fetch function that also has a `mockRestore` function property as well on it
interface MockedFetch extends Fetch {
    mockRestore: () => void;
}
declare global {
    namespace NodeJS {
        interface Global {
            // eslint-disable-next-line no-unused-vars
            fetch: MockedFetch;
        }
    }
}

export const getMockResponse = (
    mockResponseData: any = {},
    responseConfig: ResponseInit = {status: 200}
) => new Response(JSON.stringify(mockResponseData), responseConfig);

export const mockFetch = (response: Response = getMockResponse()) => {
    jest
        .spyOn(global, 'fetch')
        .mockImplementation(() => Promise.resolve(response));
};

export const getMockFetch = () => global.fetch;

export const restoreMockFetch = () => {
    global.fetch.mockRestore();
};
