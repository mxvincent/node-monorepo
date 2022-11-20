type PropType<TObj, TProp extends keyof TObj> = TObj[TProp]

type PickNullable<T> = {
	[P in keyof T as null extends T[P] ? P : never]: T[P]
}

type PickNotNullable<T> = {
	[P in keyof T as null extends T[P] ? never : P]: T[P]
}

type NullableToOptionnal<T> = {
	[K in keyof PickNullable<T>]?: Exclude<T[K], null>
} & {
	[K in keyof PickNotNullable<T>]: T[K]
}
