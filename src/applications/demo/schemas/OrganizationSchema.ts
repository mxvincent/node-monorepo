import { ResourceSchema, Type } from '@pkg/json-schema'
import { OrganizationMemberSchema } from './OrganizationMemberSchema'

export const OrganizationSchema = () => {
	return ResourceSchema({ name: Type.String() }, { $id: 'Organization' })
}

export const OrganizationMembersSchema = () => {
	return Type.Object({
		members: Type.Array(Type.Pick(OrganizationMemberSchema(), ['user', 'role']))
	})
}

export const OrganizationWithMembersSchema = () => Type.Intersect([OrganizationSchema(), OrganizationMembersSchema()])
