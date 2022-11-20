import { Type } from '@pkg/json-schema'

export const QueryStringValueSchema = Type.Optional(Type.Union([Type.String(), Type.Array(Type.String())]))

export const QueryStringSchema = Type.Object({
	size: Type.Optional(Type.String()),
	after: Type.Optional(Type.String()),
	before: Type.Optional(Type.String()),
	filter: QueryStringValueSchema,
	include: QueryStringValueSchema,
	sort: QueryStringValueSchema
})

export type QueryString = {
	[key: string]: string | string[] | undefined
	after?: string
	before?: string
	size?: string
	include?: string | string[]
	filter?: string | string[]
	sort?: string | string[]
}
