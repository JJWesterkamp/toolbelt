import { fromMaybe, isJust, isNothing, Just, maybe, Nothing } from './maybe.lib'

describe('maybe.lib', () => {
    describe('Nothing', () => {

        const fn = jest.fn()
        beforeEach(() => jest.clearAllMocks())

        it('Nothing.TAG is a symbol', () => expect(typeof Nothing.TAG).toBe('symbol'))

        it('Nothing.fmap() ignores its callback and returns Nothing', () => {
            expect(Nothing.fmap(fn)).toBe(Nothing)
            expect(fn).not.toBeCalled()
        })

        it('Nothing.apply() takes a Nothing as callback and returns Nothing', () => {
            expect(Nothing.apply(Nothing)).toBe(Nothing)
        })

        it('Nothing.apply() ignores its callback and returns Nothing', () => {
            expect(Nothing.apply(Just(fn))).toBe(Nothing)
            expect(fn).not.toBeCalled()
        })

        it('Nothing.bind() ignores its callback and returns Nothing', () => {
            expect(Nothing.bind(fn)).toBe(Nothing)
            expect(fn).not.toBeCalled()
        })
    })

    describe('Just', () => {
        it('Just.TAG is a symbol', () => expect(typeof Just('anything').TAG).toBe('symbol'))

        it('Just.fmap() applies its callback to its inner value and returns a Just of the result', () => {
            const fn = jest.fn().mockReturnValue('the result')
            const source = Just('the source')
            const result = source.fmap(fn)

            expect(result.TAG).toBe(source.TAG)
            expect((result as any).value).toBe('the result')
            expect(fn).toHaveBeenCalledTimes(1)
            expect(fn).toHaveBeenCalledWith('the source')
        })

        it('Just.apply() applies callbacks in Justs to its inner value and returns a Just of the result', () => {
            const fn = jest.fn().mockReturnValue('the result')
            const source = Just('the source')
            const result = source.apply(Just(fn))

            expect(result.TAG).toBe(source.TAG)
            expect((result as any).value).toBe('the result')
            expect(fn).toHaveBeenCalledTimes(1)
            expect(fn).toHaveBeenCalledWith('the source')
        })

        it('Just.apply() returns Nothing if given callback is Nothing', () => {
            const fn = jest.fn().mockReturnValue('the result')
            const source = Just('the source')
            const result = source.apply(Nothing)

            expect(result).toBe(Nothing)
            expect(fn).not.toBeCalled()
        })

        it('Just.bind() applies its callback to its inner value and returns the result', () => {
            const fn = jest.fn().mockReturnValue(Just('the result'))
            const source = Just('the source')
            const result = source.bind(fn)

            expect(result.TAG).toBe(source.TAG)
            expect((result as any).value).toBe('the result')
            expect(fn).toHaveBeenCalledTimes(1)
            expect(fn).toHaveBeenCalledWith('the source')
        })

        it('Just.bind() throws an error if its callback does not produce a Maybe instance', () => {
            const fn = jest.fn().mockReturnValue('Not a maybe instance')
            const source = Just('the source')

            expect(() => source.bind(fn)).toThrow(Error)
        })
    })

    describe('function maybe()', () => {
        it('transforms a Just value using the given callback and returns the result', () => {
            const fn = jest.fn().mockReturnValue('the result')
            const result = maybe('default value')(fn)(Just('the source'))

            expect(result).toBe('the result')
            expect(fn).toHaveBeenCalledTimes(1)
            expect(fn).toHaveBeenCalledWith('the source')
        })

        it('ignores its callback and returns the default value when given a Nothing', () => {
            const fn = jest.fn().mockReturnValue('the result')
            const result = maybe('default value')(fn)(Nothing)

            expect(result).toBe('default value')
            expect(fn).not.toBeCalled()
        })
    })

    describe('function fromMaybe()', () => {
        it('Returns the inner value of a Just instance', () => {
            const result = fromMaybe('default value')(Just('inner value'))

            expect(result).toBe('inner value')
        })

        it('Returns the default value when given a Nothing', () => {
            const result = fromMaybe('default value')(Nothing)
            expect(result).toBe('default value')
        })
    })

    describe('function isJust()', () => {
        it.each([
            Just(null),
            Just(undefined),
            Just(Nothing),
            Just('anything else?'),
        ])('returns true for Just values', (value: any) => expect(isJust(value)).toBe(true))

        it.each([
            Nothing,
            null,
            undefined,
            [1, 2, 3],
            { any: 'object' },
            Symbol('Symbols then?'),
            () => {},
        ])('returns false for Nothing values and non-Maybe values', (value: any) => expect(isJust(value)).toBe(false))
    })

    describe('function isNothing()', () => {
        it('returns true for Nothing values', () => expect(isNothing(Nothing)).toBe(true))

        it.each([
            Just(Nothing),
            Just('anything else'),
            null,
            undefined,
            [1, 2, 3],
            { any: 'object' },
            Symbol('Symbols then?'),
            () => {},
        ])('returns false for Just values and non-Maybe values', (value: any) => expect(isNothing(value)).toBe(false))
    })
})
