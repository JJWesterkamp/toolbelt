import type { Fn } from '../types'
import { isFunction } from '../assertions/assertions'
import { show } from '../utils/utils'

const JUST_TAG = Symbol('TAG: Maybe.Just')
const NOTHING_TAG = Symbol('TAG: Maybe.Nothing')

export type Maybe<T> = ({
    readonly TAG: typeof JUST_TAG
    readonly value: T
} | {
    readonly TAG: typeof NOTHING_TAG
}) & {
    fmap<U>(f: Fn<T, U>): Maybe<U>
    apply<U>(f: Maybe<Fn<T, U>>): Maybe<U>
    bind<U>(f: Fn<T, Maybe<U>>): Maybe<U>
}

/**
 * Data instance for the Nothing {@link Maybe} member.
 */
export const Nothing: Maybe<never> = Object.freeze({
    TAG: NOTHING_TAG,
    fmap: () => Nothing,
    apply: () => Nothing,
    bind: () => Nothing,
    toString: () => `Nothing`,
})

/**
 * Data constructor for the Just {@link Maybe} member.
 */
export const Just = <T>(x: T): Maybe<T> => Object.freeze({
    TAG: JUST_TAG,
    value: x,
    fmap: (f) => Just(f(x)),
    apply: (mf) => expectMaybe(mf).fmap((f) => f(x)),
    bind: (f) => expectMaybe(f(x)),
    toString: () => `Just (${show(x)})`,
})

/**
 * Takes a default value, a function, and a Maybe value. If the Maybe value is Nothing, the function returns the
 * default value. Otherwise, it applies the function to the value inside the Just and returns the result.
 */
export const maybe = <U>(x: U) => <T>(f: Fn<T, U>) => (m: Maybe<T>): U => isJust(m) ? f(m.value) : x

/**
 * Takes a default value and returns a new function that takes a Maybe. If the Maybe is {@link Nothing}
 * it returns the default value. If the Maybe is {@link Just} it returns the contained value.
 */
export const fromMaybe = <T>(x: T) => (m: Maybe<T>): T => isJust(m) ? m.value : x

/**
 * Tells if the given value is a {@link Just} instance of Maybe.
 */
export function isJust<T>(m: Maybe<T>): m is Maybe<T> & { TAG: typeof JUST_TAG; value: T } {
    try {
        return m.TAG === JUST_TAG
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
export function isNothing<T>(m: Maybe<T>): m is Maybe<T> & { TAG: typeof NOTHING_TAG } {
    try {
        return m.TAG === NOTHING_TAG
            && isFunction(m.fmap)
            && isFunction(m.apply)
            && isFunction(m.bind)
    } catch (error: unknown) {
        return false
    }
}

function expectMaybe<T extends Maybe<any>>(x: T): T {
    if (! isJust(x) && ! isNothing(x)) {
        throw new Error('Expected maybe value but got ' + String(x))
    }

    return x
}
