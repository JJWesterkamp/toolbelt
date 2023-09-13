import { Nil, NonEmpty } from '../types'

export function isNil(x: any): x is null | undefined {
    return x === null
        || x === undefined
}

export function isString(x: unknown): x is string {
    return typeof x === 'string'
}

export function isFunction(x: unknown): x is (...args: any[]) => unknown {
    return typeof x === 'function'
}

export function isNumber(x: unknown): x is number {
    return typeof x === 'number'
}

export function isBoolean(x: unknown): x is boolean {
    return typeof x === 'boolean'
}

export function isObject(x: unknown): x is Partial<{ [key: PropertyKey]: unknown }> {
    return typeof x === 'object'
        && x !== null
}

export function isNonEmpty<T>(xs: readonly T[]): xs is NonEmpty<T> {
    return Array.isArray(xs) && xs.length > 0
}

export function expectNonNil<T>(x: T | Nil, message?: string): T | never {
    if (isNil(x)) {
        throw new Error(message ?? 'Encountered NIL value where NON-NIL is expected.')
    }

    return x
}
