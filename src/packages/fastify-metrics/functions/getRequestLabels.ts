import { FastifyReply, FastifyRequest, HTTPMethods } from 'fastify'

export const getRequestLabels = (request: FastifyRequest, reply: FastifyReply) => {
	return {
		path: request.routerPath,
		method: request.routerMethod as HTTPMethods,
		statusCode: reply.statusCode
	}
}
