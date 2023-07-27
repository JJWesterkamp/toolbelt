import type { Config } from '@jest/types'

export default <Config.InitialOptions>{
    preset: 'ts-jest',
    roots: ['<rootDir>/src'],
    verbose: true,
    cache: true,
    cacheDirectory: './.jest-cache',
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts'],
    coverageReporters: ['text', 'html'],
    coverageDirectory: 'coverage',
}
