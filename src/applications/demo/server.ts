import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { fastifyPagination } from '@pkg/fastify-pagination'
import { HttpError } from '@pkg/http'
import { ajv } from '@pkg/json-schema'
import { getLogger } from '@pkg/logger'
import { getPackageInfo } from '@pkg/package-info'
import { QueryStringValidationError } from '@pkg/query-string'
import fastify from 'fastify'
import { apiPlugin } from './api'
import { getOpenApiDocument } from './api/openApi'
import { AppConfig, getAppConfig } from './config/app'
import { getSwaggerConfig } from './config/swagger'
import { database, initializeDataSource } from './database'

const logger = getLogger()

export const createApplicationServer = async (appConfig: AppConfig) => {
	const app = fastify({
		ignoreTrailingSlash: true,
		logger
	})

	/**
	 * Customize error handler
	 */
	app.setErrorHandler(function (error, request, reply) {
		if (error instanceof HttpError) {
			return reply.status(error.statusCode)
		}
		if (error instanceof QueryStringValidationError) {
			reply.status(400)
		}
		reply.send(error)
	})

	/**
	 * Use custom ajv instance for validation
	 */
	app.setValidatorCompiler((req) => {
		return ajv.compile(req.schema)
	})

	/**
	 * Register application metadata plugin
	 */
	const packageInfo = await getPackageInfo({
		packageJsonFilePath: process.env.APP_PACKAGE_JSON_PATH ?? './package.json'
	})
	app.get('/', async () => packageInfo)

	/**
	 * Register swagger plugin
	 */
	const swagger = getSwaggerConfig()
	app.register(fastifySwagger, {
		mode: 'dynamic',
		hideUntagged: true,
		openapi: await getOpenApiDocument({ packageInfo })
	})
	app.register(fastifySwaggerUI, { routePrefix: swagger.path })
	app.log.info(`[app-server] register swagger http://${appConfig.server.host}:${appConfig.server.port}${swagger.path}`)

	/**
	 * Register pagination plugin
	 */
	app.register(fastifyPagination)

	/**
	 * Register API plugin
	 */
	app.register(apiPlugin)

	/**
	 * Start application server
	 */
	await app.listen(appConfig.server)
}

async function server() {
	await initializeDataSource(database)
	await createApplicationServer(getAppConfig())
}

server().catch((error) => {
	logger.fatal(error)
	process.exit(1)
})
