// noinspection JSUnusedGlobalSymbols

import { Observable, of, OperatorFunction } from 'rxjs'
import { fromMaybe, isJust, isNothing, Just, Maybe, Nothing } from '../maybe/maybe'
import { map as rxMap, distinctUntilChanged as rxDistinctUntilChanged, switchMap as rxSwitchMap } from 'rxjs/operators'
import { Fn, Fn2 } from '../types'


export namespace RxMaybe {

    export type ObservableMaybe<T> = Observable<Maybe<T>>
    export type MaybeOperator<T, U> = OperatorFunction<Maybe<T>, Maybe<U>>

    /**
     * Takes a default value and returns an RxJS mapping operator that emits extracted values from Maybes when they
     * are {@link Just} or the default value when they are {@link Nothing}.
     */
    export function defaultTo<T>(defaultValue: T): OperatorFunction<Maybe<T>, T> {
        return rxMap(fromMaybe(defaultValue))
    }

    /**
     * Returns an RxJS mapping operator that emits extracted values from Maybes when they are {@link Just} or
     * `null` when they are {@link Nothing}.
     */
    export function extract<T>(): OperatorFunction<Maybe<T>, T | null> {
        return rxMap((m) => isJust(m) ? m.value : null)
    }

    /**
     * Takes a Maybe value of an observable and returns an observable of maybe values.
     */
    export function sequence<T>(m: Maybe<Observable<T>>): ObservableMaybe<T> {
        return isJust(m) ? m.value.pipe(rxMap(Just)) : of(Nothing)
    }

    /**
     * A {@link rxDistinctUntilChanged distinctUntilChanged} implementation that combines the native RxJS
     * operator with checks for Maybe values. Optionally takes a comparator function that decides whether
     * the values of two consecutive {@link Just} emissions are equivalent. Compares by identity by default.
     */
    export function distinctUntilChanged<T>(comp: Fn2<T, T, boolean> = (x, y) => x === y): MaybeOperator<T, T> {
        return rxDistinctUntilChanged((ma, mb) => {
            return (isNothing(ma) && isNothing(mb))
                || (isJust(ma) && isJust(mb) && comp(ma.value, mb.value))
        })
    }

    /**
     * RxJS map operators that combine with Maybe methods
     */
    export namespace map {

        /**
         * Takes a function and returns an RxJS mapping operator that fmaps the given
         * function over emitted Maybe values of the source observable.
         *
         * ─ signature ─
         *
         * ```
         * (T -> U) -> Observable (Maybe T) -> Observable (Maybe U)
         * ```
         */
        export function fmap<T, U>(f: Fn<T, U>): MaybeOperator<T, U> {
            return rxMap((mx) => mx.fmap(f))
        }

        /**
         * Takes a Maybe value for a function and returns an RxJS mapping operator that applies it to
         * the maybe values of the source observable.
         *
         * ─ signature ─
         *
         * ```
         * Maybe (T -> U) -> Observable (Maybe T) -> Observable (Maybe U)
         * ```
         */
        export function apply<T, U>(mf: Maybe<Fn<T, U>>): MaybeOperator<T, U> {
            return rxMap((mx) => mx.apply(mf))
        }

        /**
         * Takes a function and returns an RxJS mapping operator that binds it to
         * the maybe values of the source observable.
         *
         * ─ signature ─
         *
         * ```
         * (T -> Maybe U) -> Observable (Maybe T) -> Observable (Maybe U)
         * ```
         */
        export function bind<T, U>(f: Fn<T, Maybe<U>>): MaybeOperator<T, U> {
            return rxMap((mx) => mx.bind(f))
        }
    }

    /**
     * RxJS switchMap operators that combine with Maybe methods
     */
    export namespace switchMap {

        /**
         * Takes a function and returns an RxJS switchMapping operator that fmaps it over the values
         * of the source observable. The given function should itself return an observable.
         *
         * ─ signature ─
         *
         * ```
         * (T -> Observable U) -> Observable (Maybe T) -> Observable (Maybe U)
         * ```
         */
        export function fmap<T, U>(f: Fn<T, Observable<U>>): MaybeOperator<T, U> {
            return rxSwitchMap((mx) => sequence(mx.fmap(f)))
        }

        /**
         * Takes a function and returns an RxJS switchMapping operator that applies it to the maybe
         * values of the source observable. The given function should itself return an observable.
         *
         * ─ signature ─
         *
         * ```
         * Maybe (T -> Observable U) -> Observable (Maybe T) -> Observable (Maybe U)
         * ```
         */
        export function apply<T, U>(mf: Maybe<Fn<T, Observable<U>>>): MaybeOperator<T, U> {
            return rxSwitchMap((mx) => sequence(mx.apply(mf)))
        }

        /**
         * Takes a function and returns an RxJS switchMapping operator that binds it to the maybe
         * values of the source observable. The given function should itself return a maybe value
         * of an observable.
         *
         * ─ signature ─
         *
         * ```
         * (T -> Maybe (Observable U)) -> Observable (Maybe T) -> Observable (Maybe U)
         * ```
         */
        export function bind<T, U>(f: Fn<T, Maybe<Observable<U>>>): MaybeOperator<T, U> {
            return rxSwitchMap((mx) => sequence(mx.bind(f)))
        }

        /**
         * Takes a function and returns an RxJS switchMapping operator that applies it to the
         * maybe values of the source observable if they are {@link Just}. The operator emits
         * Nothing when the input value is Nothing. The given function should itself return
         * an observable of maybe values.
         *
         * ─ signature ─
         *
         * ```
         * (T -> Observable (Maybe U)) -> Observable (Maybe T) -> Observable (Maybe U)
         * ```
         */
        export function id<T, U>(f: Fn<T, Observable<Maybe<U>>>): MaybeOperator<T, U> {
            return rxSwitchMap((mx) => isJust(mx) ? f(mx.value) : of(Nothing))
        }
    }
}

