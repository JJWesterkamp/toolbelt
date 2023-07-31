import { expectNonNil, isBoolean, isNonEmpty, isNumber, isString } from './assertions'

describe('assertions', () => {
    it.each([
        { value: '', passes: true },
        { value: 'non empty', passes: true },
        { value: new String('non empty'), passes: false },
        { value: 1, passes: false },
        { value: new Number(1), passes: false },
        { value: [], passes: false },
        { value: {}, passes: false },
        { value: Symbol('string'), passes: false },
        { value: true, passes: false },
        { value: false, passes: false },
    ])('function isString() determines if an argument is a string', ({ value, passes }) => {
        expect(isString(value)).toBe(passes)
    })

    it.each([
        { value: '', passes: false },
        { value: 'non empty', passes: false },
        { value: String('non empty'), passes: false },
        { value: new String('non empty'), passes: false },
        { value: 1, passes: true },
        { value: new Number(1), passes: false },
        { value: [], passes: false },
        { value: {}, passes: false },
        { value: Symbol('number'), passes: false },
        { value: true, passes: false },
        { value: false, passes: false },
    ])('function isNumber() determines if an argument is a number', ({ value, passes }) => {
        expect(isNumber(value)).toBe(passes)
    })

    it.each([
        { value: '', passes: false },
        { value: 'non empty', passes: false },
        { value: String('non empty'), passes: false },
        { value: new String('non empty'), passes: false },
        { value: 1, passes: false },
        { value: new Number(1), passes: false },
        { value: [], passes: false },
        { value: {}, passes: false },
        { value: Symbol('boolean'), passes: false },
        { value: true, passes: true },
        { value: false, passes: true },
    ])('function isBoolean() determines if an argument is a boolean', ({ value, passes }) => {
        expect(isBoolean(value)).toBe(passes)
    })

    it.each([
        { value: '', passes: false },
        { value: 'non empty', passes: false },
        { value: String('non empty'), passes: false },
        { value: new String('non empty'), passes: false },
        { value: 1, passes: false },
        { value: new Number(1), passes: false },
        { value: [], passes: false },
        { value: ['with'], passes: true },
        { value: ['with', 'items'], passes: true },
        { value: {}, passes: false },
        { value: Symbol('boolean'), passes: false },
        { value: true, passes: false },
        { value: false, passes: false },
    ])('function isNonEmpty() determines if an argument is a nonempty array', ({ value, passes }) => {
        expect(isNonEmpty(value as any)).toBe(passes)
    })

    describe('function expectNonNil()', () => {
        it('throws if its argument is Nil', () => {
            expect(() => expectNonNil(null)).toThrow(Error)
            expect(() => expectNonNil(undefined)).toThrow(Error)
        })

        it('throws with a custom message when given', () => {
            expect(() => expectNonNil(null, 'A custom message')).toThrow(Error)
            expect(() => expectNonNil(null, 'A custom message')).toThrow('A custom message')
            expect(() => expectNonNil(undefined, 'A custom message')).toThrow(Error)
            expect(() => expectNonNil(undefined, 'A custom message')).toThrow('A custom message')
        })

        it.each([
            -Infinity, -1, 0, 1, Infinity,
            '', 'non empty', String('constructed'),
            [], [1, 2, 3],
            {}, { withSome: 'props' },
            true, false,
            Symbol('Any symbol'),
        ])('acts as the identity function for non-nil arguments', (value) => {
            expect(expectNonNil(value)).toBe(value)
        })
    })
})
