import { FastifyInstance, FastifyPluginAsync, HTTPMethods } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { collectDefaultMetrics } from 'prom-client'
import { getRequestLabels } from '../functions/getRequestLabels'
import {
	register,
	requestContentLengthHistogram,
	requestCount,
	responseContentLengthHistogram,
	responseTimeHistogram
} from '../metrics'

export type MetricsCollectorPluginOptions = {
	methodWhitelist?: HTTPMethods[]
	disableDefaultMetrics?: boolean
}

const registerMetricsCollector: FastifyPluginAsync = async (
	app: FastifyInstance,
	options: MetricsCollectorPluginOptions
) => {
	const methodWhiteList = options.methodWhitelist ?? ['DELETE', 'GET', 'PATCH', 'POST', 'PUT']

	// if (options?.disableDefaultMetrics !== true) {
	collectDefaultMetrics({ gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5], register: register })
	// }

	app.addHook('onResponse', (request, reply, done) => {
		const labels = getRequestLabels(request, reply)

		if (!labels.path || !methodWhiteList.includes(labels.method)) {
			return done()
		}

		requestCount.inc(labels)

		const requestContentLength = request.headers['content-length']
		if (requestContentLength) {
			requestContentLengthHistogram.observe(labels, Number(requestContentLength))
		}

		responseTimeHistogram.observe(labels, reply.getResponseTime())

		const responseContentLength = reply.getHeader('content-length')
		if (responseContentLength) {
			responseContentLengthHistogram.observe(labels, Number(responseContentLength))
		}

		return done()
	})
}

export const metricsCollectorPlugin = fastifyPlugin<MetricsCollectorPluginOptions>(registerMetricsCollector, {
	name: 'demo-collector',
	fastify: '3.x || 4.x'
})
