import { TSchema, validateOrFail } from '@pkg/json-schema'
import { mergeDeepRight } from 'ramda'
import { ConfigurationError } from '../errors/ConfigurationError'
import { EnvironmentVariableMapping, getConfigFromEnvironment } from './getConfigFromEnvironment'
import { getConfigFromFile } from './getConfigFromFile'

export type GetConfigOptions<T> = {
	schema: TSchema
	file?: { path: string; jsonPath: string }
	env?: EnvironmentVariableMapping
	defaultValues?: Partial<T>
}

export const getConfigOrFail = <T>({ env, file, schema, defaultValues }: GetConfigOptions<T>): T => {
	if (!file && !env) {
		throw new ConfigurationError('options should contain one or more target (env,file)')
	}
	const sources: object[] = [defaultValues ?? {}]
	const validate = validateOrFail<T>(schema)
	if (file) {
		sources.push(getConfigFromFile(file.path, file.jsonPath))
	}
	if (env) {
		sources.push(getConfigFromEnvironment(env))
	}
	return validate(sources.reduce(mergeDeepRight))
}
