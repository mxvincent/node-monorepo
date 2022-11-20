/* eslint-disable no-undef */

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
	verbose: true,
	moduleNameMapper: {
		'@app/(.*)': '<rootDir>/src/applications/$1',
		'@pkg/(.*)': '<rootDir>/src/packages/$1',
		'@interface/(.*)': '<rootDir>/src/interfaces/$1',
		'@test/(.*)': '<rootDir>/src/tests/$1'
	},
	// setupFiles: ['<rootDir>/src/tests/setup.ts'],
	testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
	transform: {
		'^.+\\.tsx?$': ['@swc/jest', { configFile: '.swcrc' }]
	}
}
