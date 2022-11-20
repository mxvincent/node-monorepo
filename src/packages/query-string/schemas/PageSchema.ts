import { NullableSchema, TObject, Type } from '@pkg/json-schema'

export const PageSchema = <T extends TObject>(type: TObject) => {
	return Type.Object({
		data: Type.Array(type),
		hasNextPage: Type.Boolean(),
		hasPrevPage: Type.Boolean(),
		totalCount: Type.Integer(),
		startCursor: NullableSchema(Type.String()),
		endCursor: NullableSchema(Type.String())
	})
}

export type Page<T> = {
	data: T[]
	hasNextPage: boolean
	hasPrevPage: boolean
	totalCount: number
	startCursor: string | null
	endCursor: string | null
}

export type AsyncPage<T> = Promise<Page<T>>
