import { getLogger } from '@pkg/logger'
import { DataSource, DataSourceOptions } from 'typeorm'
import { getPostgresConfig } from '../config/postgres'

export * from './functions'

const getDataSourceOptions = (): DataSourceOptions => {
	const options: DataSourceOptions = {
		name: 'demo',
		type: 'postgres',
		schema: 'public',
		synchronize: false,
		dropSchema: false,
		migrationsRun: true,
		logging: ['error', 'warn'],
		entities: ['dist/applications/demo/database/entities/*.js'],
		migrations: ['dist/applications/demo/database/migrations/*.js'],
		subscribers: ['dist/applications/demo/database/subscribers/*.js'],
		migrationsTableName: '@migration',
		metadataTableName: '@metadata',
		...getPostgresConfig()
	}
	if (__dirname.includes('/src/applications')) {
		Object.assign(options, {
			...options,
			entities: ['src/applications/demo/database/entities/*.ts'],
			migrations: ['src/applications/demo/database/migrations/*.ts'],
			subscribers: ['src/applications/demo/database/subscribers/*.ts']
		})
	}
	return options
}

export const database = new DataSource(getDataSourceOptions())
getLogger().info(`[database] demo database configured`)
