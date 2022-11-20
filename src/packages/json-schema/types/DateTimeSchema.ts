import { TString, Type } from '@sinclair/typebox'

/**
 * ISO 8601 date
 */
export const DateTimeSchema = (description = 'ISO 8601 date.'): TString => {
	return Type.String({ format: 'iso-date-time', description })
}
