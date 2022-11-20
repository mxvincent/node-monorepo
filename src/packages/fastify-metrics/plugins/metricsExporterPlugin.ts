import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { register } from '../metrics'

export type MetricsExporterPluginOptions = {
	path?: string
}

const registerMetricsExporter: FastifyPluginAsync = async (
	app: FastifyInstance,
	options: MetricsExporterPluginOptions
) => {
	const metricsPath = options?.path ?? '/metrics'
	app.get(metricsPath, async (request: FastifyRequest, reply: FastifyReply) => {
		reply.header('Content-Type', register.contentType)
		reply.send(await register.metrics())
	})
}

export const metricsExporterPlugin = fastifyPlugin<MetricsExporterPluginOptions>(registerMetricsExporter, {
	name: 'demo-exporter',
	fastify: '3.x || 4.x'
})
