import { readJsonFileSync } from '@pkg/fs'
import * as process from 'process'
import { getPackageInfo } from './getPackageInfo'

jest.mock('@pkg/fs', () => ({
	readJsonFileSync: jest.fn().mockResolvedValue({})
}))

beforeEach(async () => {
	delete process.env.APP_NAME
	delete process.env.APP_DESCRIPTION
	delete process.env.APP_VERSION
})

describe('getPackageInfo', () => {
	test('should call readJsonFileSync()', async () => {
		await getPackageInfo({ packageJsonFilePath: 'path/to/package.json' })
		expect(readJsonFileSync).toBeCalledTimes(1)
		expect(readJsonFileSync).toBeCalledWith('path/to/package.json')
	})

	test('should return package defaults', async () => {
		const packageInfo = await getPackageInfo({ packageJsonFilePath: 'path/to/package.json' })
		expect(packageInfo).toMatchObject({
			name: 'unknown',
			version: 'unknown'
		})
	})

	test('should return package defaults from options', async () => {
		const packageInfo = await getPackageInfo({
			packageJsonFilePath: 'path/to/package.json',
			defaultValues: {
				name: 'default-name',
				description: 'default-description'
			}
		})
		expect(packageInfo).toMatchObject({
			name: 'default-name',
			description: 'default-description',
			version: 'unknown'
		})
	})

	test('should override defaults with environment variable', async () => {
		process.env.APP_NAME = 'name-from-environment'
		const packageInfo = await getPackageInfo({ packageJsonFilePath: 'path/to/package.json' })
		expect(packageInfo).toMatchObject({
			name: 'name-from-environment',
			version: 'unknown'
		})
	})

	test('should override defaults with package.json content', async () => {
		;(readJsonFileSync as jest.Mock).mockResolvedValueOnce({
			name: 'name-from-file',
			description: 'description-from-file',
			additionalField: 'will-be-ignored'
		})
		const packageInfo = await getPackageInfo({ packageJsonFilePath: 'path/to/package.json' })
		expect(packageInfo).toMatchObject({
			name: 'name-from-file',
			version: 'unknown',
			description: 'description-from-file'
		})
	})

	test('should override default values mixing package.json content and environment variable', async () => {
		process.env.APP_VERSION = 'version-from-env'
		;(readJsonFileSync as jest.Mock).mockResolvedValueOnce({
			name: 'name-from-file',
			version: 'version-from-file'
		})
		const packageInfo = await getPackageInfo({ packageJsonFilePath: 'path/to/package.json' })
		expect(packageInfo).toMatchObject({
			name: 'name-from-file',
			version: 'version-from-env'
		})
	})
})
