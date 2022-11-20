import { Counter, Histogram, MetricConfiguration, Registry } from 'prom-client'

export const register = new Registry()

const secondsBuckets = [0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 25]

const bytesBucket = [10, 10 ** 2, 10 ** 3, 10 ** 4, 10 ** 5, 10 ** 6, 10 ** 7, 10 ** 8, 10 ** 9]

const requestMetricsConfig: Partial<MetricConfiguration<string>> = {
	labelNames: ['method', 'path', 'statusCode'],
	registers: [register]
}

export const requestCount = new Counter({
	name: 'http_request_total_count',
	help: 'HTTP request total count',
	...requestMetricsConfig
})

export const requestContentLengthHistogram = new Histogram({
	name: 'http_request_content_length_bytes',
	help: 'HTTP request content-length header (bytes)',
	...requestMetricsConfig,
	buckets: bytesBucket
})

export const responseContentLengthHistogram = new Histogram({
	name: 'http_response_content_length_bytes',
	help: 'HTTP response content-length header (bytes)',
	...requestMetricsConfig,
	buckets: bytesBucket
})

export const responseTimeHistogram = new Histogram({
	name: 'http_response_time_seconds',
	help: 'HTTP response time (seconds)',
	...requestMetricsConfig,
	buckets: secondsBuckets
})
