import { ValidationError } from '@pkg/json-schema'

export class QueryStringValidationError extends ValidationError {
	code = 'QUERY_STRING_VALIDATION_ERROR'
}
