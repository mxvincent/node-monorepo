import { getConfigOrFail } from '@pkg/config'
import { Static, Type } from '@pkg/json-schema'
import { getConfigFilePath } from '../functions/getConfigFilePath'

const SwaggerConfigSchema = Type.Object(
	{
		path: Type.String({ default: '/docs' })
	},
	{
		$id: 'OpenAPIConfig',
		additionalProperties: false,
		description: 'OpenAPI configuration.'
	}
)

export type SwaggerConfig = Static<typeof SwaggerConfigSchema>

let config: SwaggerConfig

export const getSwaggerConfig = (reloadConfigFile = false): SwaggerConfig => {
	if (reloadConfigFile || !config) {
		config = getConfigOrFail({
			file: { path: getConfigFilePath(), jsonPath: 'swagger' },
			schema: SwaggerConfigSchema
		})
	}
	return config
}
