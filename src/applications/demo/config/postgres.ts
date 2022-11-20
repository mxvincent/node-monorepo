import { getConfigOrFail } from '@pkg/config'
import { PostgresConfig, PostgresConfigSchema } from '@pkg/typeorm'
import { getConfigFilePath } from '../functions/getConfigFilePath'

let config: PostgresConfig

export const getPostgresConfig = (reloadConfigFile = false): PostgresConfig => {
	if (reloadConfigFile || !config) {
		config = getConfigOrFail({
			env: {
				host: 'POSTGRES_HOST',
				port: 'POSTGRES_PORT',
				database: 'POSTGRES_DATABASE',
				username: 'POSTGRES_USERNAME',
				password: 'POSTGRES_PASSWORD'
			},
			file: { path: getConfigFilePath(), jsonPath: 'postgres' },
			schema: PostgresConfigSchema()
		})
	}
	return config
}
