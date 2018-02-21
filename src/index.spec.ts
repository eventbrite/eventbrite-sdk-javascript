import briteRest from './';

describe('configurations', () => {
    it('does not error when creating sdk object w/o token', () => {
        expect(() => briteRest()).not.toThrow();
    });
});
