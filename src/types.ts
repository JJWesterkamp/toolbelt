export type Nil = null | undefined

// ------------------------------------------------------------------------------
//      Function types
// ------------------------------------------------------------------------------
export type Fn<T1, R> = (x: T1) => R
export type Fn2<T1, T2, R> = (x: T1, y: T2) => R
export type Fn3<T1, T2, T3, R> = (x1: T1, x2: T2, x3: T3) => R

export type Comparator<T> = Fn2<T, T, boolean>

// ------------------------------------------------------------------------------
//      Array types
// ------------------------------------------------------------------------------

export type NonEmpty<T> = readonly [x: T, ...xs: T[]]
