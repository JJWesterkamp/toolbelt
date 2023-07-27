import { Fn } from '../types'
import { isFunction } from '../assertions/assertions.lib'

const LEFT_TAG = Symbol('TAG: Either.Left')
const RIGHT_TAG = Symbol('TAG: Either.Right')

export type Either<L, R> = ({
    readonly TAG: typeof LEFT_TAG
    readonly value: L
} | {
    readonly TAG: typeof RIGHT_TAG
    readonly value: R
}) & {
    fmap<U>(f: Fn<R, U>): Either<L, U>
    apply<U>(f: Either<L, Fn<R, U>>): Either<L, U>
    bind<U>(f: Fn<R, Either<L, U>>): Either<L, U>
}

export const Left = <L, R = any>(x: L): Either<L, R> => ({ // Todo: see if the any defaults don't destroy type safety
    TAG: LEFT_TAG,
    value: x,
    fmap: () => Left(x),
    apply: () => Left(x),
    bind: () => Left(x),
})

export const Right = <R, L = any>(x: R): Either<L, R> => ({ // Todo: see if the any defaults don't destroy type safety
    TAG: RIGHT_TAG,
    value: x,
    fmap: (f) => Right(f(x)),
    apply: (ef) => expectEither(ef).fmap((f) => f(x)),
    bind: (f) => expectEither(f(x)),
})

/**
 * Tells if the given value is a {@link Just} instance of Maybe.
 */
export function isLeft<L>(m: Either<L, any>): m is Either<L, any> & { TAG: typeof LEFT_TAG; value: L } {
    try {
        return m.TAG === LEFT_TAG
            && m.hasOwnProperty('value')
            && isFunction(m.fmap)
            && isFunction(m.apply)
            && isFunction(m.bind)
    } catch (error: unknown) {
        return false
    }
}

/**
 * Tells if the given value is a {@link Nothing} instance of Maybe.
 */
export function isRight<R>(m: Either<any, R>): m is Either<any, R> & { TAG: typeof RIGHT_TAG } {
    try {
        return m.TAG === RIGHT_TAG
            && isFunction(m.fmap)
            && isFunction(m.apply)
            && isFunction(m.bind)
    } catch (error: unknown) {
        return false
    }
}

function expectEither<T extends Either<any, any>>(x: T): T {
    if (! isLeft(x) && ! isRight(x)) {
        throw new Error('Expected Either instance but got ' + String(x))
    }

    return x
}
