import briteRest from './';

describe('configurations', () => {
    it('does not error when creating sdk object w/o token', () => {
        expect(() => briteRest()).not.toThrow();
    });

    it('should compile while using async await', async () => {
        const result = await new Promise<number>((resolve) => resolve(1));

        expect(result).toEqual(1);
    });

    it('should work with spread operator', () => {
        const parent = {first: 1};
        const child = {...parent, second: 2};

        expect(child).toEqual({first: 1, second: 2});
    });
});
