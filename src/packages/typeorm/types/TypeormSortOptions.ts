import { SortDirection } from '@pkg/query'

export interface TypeormSortOptions {
	paths: Array<string>
	direction: SortDirection
}
