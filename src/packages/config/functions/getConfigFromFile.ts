import { readJsonFileSync } from '@pkg/fs'

export const getConfigFromFile = (filePath: string, jsonPath?: string): object => {
	const configJson = readJsonFileSync(filePath)
	if (!jsonPath) {
		return configJson
	}
	return jsonPath?.split('.').reduce((container, key) => {
		if (typeof container === 'object') return container[key]
	}, configJson)
}
