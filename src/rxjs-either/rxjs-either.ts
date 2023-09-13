// noinspection JSUnusedGlobalSymbols

import { Observable, of, OperatorFunction } from 'rxjs'
import { map as rxMap, distinctUntilChanged as rxDistinctUntilChanged, switchMap as rxSwitchMap } from 'rxjs/operators'
import { Comparator, Fn } from '../types'
import { Either, isLeft, isRight, Left, Right } from '../either/either'


export namespace RxEither {

    export type ObservableEither<L, R> = Observable<Either<L, R>>
    export type EitherOperator<L, R1, R2> = OperatorFunction<Either<L, R1>, Either<L, R2>>

    /**
     * Takes a default value and returns an RxJS mapping operator that emits extracted values from Either when they
     * are {@link Right} or the default value when they are {@link Left}.
     */
    export function defaultTo<R>(defaultValue: R): OperatorFunction<Either<unknown, R>, R> {
        return rxMap((ex) => isRight(ex) ? ex.value : defaultValue)
    }

    /**
     * Returns an RxJS mapping operator that emits extracted values from Either values when they are {@link Right} or
     * `null` when they are {@link Left}.
     */
    export function extract<T>(): OperatorFunction<Either<unknown, T>, T | null> {
        return rxMap((ex) => isRight(ex) ? ex.value : null)
    }

    /**
     * Takes an Either value of an observable and returns an observable of Either values.
     */
    export function sequence<L, R>(m: Either<L, Observable<R>>): ObservableEither<L, R> {
        return isRight(m)
            ? m.value.pipe(rxMap(Right))
            : of(Left(m.value))
    }

    /**
     * A {@link rxDistinctUntilChanged distinctUntilChanged} implementation that combines the native RxJS
     * operator with checks for Either values. Optionally takes comparator functions for Left and Right values
     * that decide whether two values two consecutive {@link Either} emissions are equivalent.
     * Compares by identity by default.
     */
    export function distinctUntilChanged<L, R>(
        lComparator: Comparator<L> = (x, y) => x === y,
        rComparator: Comparator<R> = (x, y) => x === y,
    ): EitherOperator<L, R, R> {
        return rxDistinctUntilChanged((ma, mb) => {
            return (isLeft(ma) && isLeft(mb) && lComparator(ma.value, mb.value))
                || (isRight(ma) && isRight(mb) && rComparator(ma.value, mb.value))
        })
    }

    /**
     * RxJS map operators that combine with Either methods
     */
    export namespace map {

        /**
         * Takes a function and returns an RxJS mapping operator that fmaps the given
         * function over emitted Either values of the source observable.
         *
         * ─ signature ─
         *
         * ```
         * (R1 -> R2) -> Observable (Either L R1) -> Observable (Either L R2)
         * ```
         */
        export function fmap<L, R1, R2>(f: Fn<R1, R2>): EitherOperator<L, R1, R2> {
            return rxMap((mx) => mx.fmap(f))
        }

        /**
         * Takes an Either value for a function and returns an RxJS mapping operator that applies it to
         * the Either values of the source observable.
         *
         * ─ signature ─
         *
         * ```
         * Either L (R1 -> R2) -> Observable (Either L R1) -> Observable (Either L R2)
         * ```
         */
        export function apply<L, R1, R2>(mf: Either<L, Fn<R1, R2>>): EitherOperator<L, R1, R2> {
            return rxMap((mx) => mx.apply(mf))
        }

        /**
         * Takes a function and returns an RxJS mapping operator that binds it to
         * the Either values of the source observable.
         *
         * ─ signature ─
         *
         * ```
         * (R1 -> Either L R2) -> Observable (Either L R1) -> Observable (Either L R2)
         * ```
         */
        export function bind<L, R1, R2>(f: Fn<R1, Either<L, R2>>): EitherOperator<L, R1, R2> {
            return rxMap((mx) => mx.bind(f))
        }
    }

    /**
     * RxJS switchMap operators that combine with Either methods
     */
    export namespace switchMap {

        /**
         * Takes a function and returns an RxJS switchMapping operator that fmaps it over the values
         * of the source observable. The given function should itself return an observable.
         *
         * ─ signature ─
         *
         * ```
         * (R1 -> Observable R2) -> Observable (Either L R1) -> Observable (Either L R2)
         * ```
         */
        export function fmap<L, R1, R2>(f: Fn<R1, Observable<R2>>): EitherOperator<L, R1, R2> {
            return rxSwitchMap((mx) => sequence(mx.fmap(f)))
        }

        /**
         * Takes a function and returns an RxJS switchMapping operator that applies it to the Either
         * values of the source observable. The given function should itself return an observable.
         *
         * ─ signature ─
         *
         * ```
         * Either L (R1 -> Observable R2) -> Observable (Either L R1) -> Observable (Either L R2)
         * ```
         */
        export function apply<L, R1, R2>(mf: Either<L, Fn<R1, Observable<R2>>>): EitherOperator<L, R1, R2> {
            return rxSwitchMap((mx) => sequence(mx.apply(mf)))
        }

        /**
         * Takes a function and returns an RxJS switchMapping operator that binds it to the Either
         * values of the source observable. The given function should itself return an Either value
         * of an observable.
         *
         * ─ signature ─
         *
         * ```
         * (R1 -> Either L (Observable R2)) -> Observable (Either L R1) -> Observable (Either L R2)
         * ```
         */
        export function bind<L, R1, R2>(f: Fn<R1, Either<L, Observable<R2>>>): EitherOperator<L, R1, R2> {
            return rxSwitchMap((mx) => sequence(mx.bind(f)))
        }

        /**
         * Takes a function and returns an RxJS switchMapping operator that applies it to the
         * either values of the source observable if they are {@link Right}. The operator emits
         * the input value if it is Left. The given function should itself return
         * an observable of Either values.
         *
         * ─ signature ─
         *
         * ```
         * (R1 -> Observable (Either L R2)) -> Observable (Either L R1) -> Observable (Either L R2)
         * ```
         */
        export function id<L, R1, R2>(f: Fn<R1, Observable<Either<L, R2>>>): EitherOperator<L, R1, R2> {
            return rxSwitchMap((mx) => isRight(mx) ? f(mx.value) : of(Left(mx.value)))
        }
    }
}

