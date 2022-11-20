import { Type } from '@pkg/json-schema'

export type PostgresConfig = {
	host: string
	port: number
	database: string
	username: string
	password: string
}

export const PostgresConfigSchema = (options?: { default?: Partial<PostgresConfig> }) => {
	return Type.Object(
		{
			host: Type.String({ description: 'Postgres server host.' }),
			port: Type.Number({ description: 'Postgres server port.' }),
			database: Type.String({ description: 'Postgres database.' }),
			username: Type.String({ description: 'Postgres username.' }),
			password: Type.String({ description: 'Postgres password.' })
		},
		{
			additionalProperties: false,
			description: 'Postgres client configuration.',
			default: options?.default
		}
	)
}
