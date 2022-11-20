import pino from 'pino'
import { LogLevelEnum } from './types/LogLevel'

export { LogLevel, LogLevelEnum } from './types/LogLevel'
export { Logger } from 'pino'

export const getLoggerConfig = (): pino.LoggerOptions => {
	const env = process.env.NODE_ENV
	switch (env) {
		case 'production':
			return {
				level: LogLevelEnum.info
			}
		default:
			return {
				level: LogLevelEnum.debug,
				transport: {
					target: 'pino-pretty',
					options: {
						translateTime: 'HH:MM:ss Z',
						ignore: 'pid,hostname'
					}
				}
			}
	}
}

const logger = pino(getLoggerConfig())

export const getLogger = (): pino.Logger => logger
