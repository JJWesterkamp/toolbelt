import { Either, Left, Right } from './either'

function props({ TAG, value }: Either<any, any>): {
    TAG: symbol
    value: any
} {
    return { TAG, value }
}
describe('either.lib', () => {
    describe('Left', () => {

        const fn = jest.fn()
        beforeEach(() => jest.clearAllMocks())

        it('Left.TAG is a symbol', () => {
            expect(typeof Left('the message').TAG).toBe('symbol')
        })

        it('Left(x).fmap() ignores its callback and returns Left(x)', () => {
            let source = Left('the message')
            let result = source.fmap(fn)

            expect(result).toMatchObject(props(source))
            expect(fn).not.toBeCalled()
        })

        it('Left(x).apply() takes a Left as callback and returns Left(x)', () => {
            let source = Left('the message')
            let result = source.apply(Left('no callback available!'))

            expect(result).toMatchObject(props(source))
            expect(fn).not.toBeCalled()
        })

        it('Left(x).apply() ignores its callback and returns Left(x)', () => {
            let source = Left('the message')
            let result = source.apply(Right(fn))

            expect(result).toMatchObject(props(source))
            expect(fn).not.toBeCalled()
        })

        it('Left(x).bind() ignores its callback and returns Left(x)', () => {
            let source = Left('the message')
            let result = source.bind(fn)

            expect(result).toMatchObject(props(source))
            expect(fn).not.toBeCalled()
        })
    })

    describe('Right', () => {
        it('Right.TAG is a symbol', () => {
            expect(typeof Right('the data').TAG).toBe('symbol')
        })
    })

    describe('function isLeft()', () => {

    })

    describe('function isRight()', () => {

    })
})
