import { StringUnionSchema, Type } from '@pkg/json-schema'
import { organizationRoles } from '../database/entities/OrganizationMember'
import { OrganizationSchema } from './OrganizationSchema'
import { UserSchema } from './UserSchema'

export const OrganizationMemberRoleSchema = () => {
	return StringUnionSchema([...organizationRoles], { $id: 'OrganizationMemberRole' })
}

export const OrganizationMemberSchema = () => {
	return Type.Object(
		{
			role: OrganizationMemberRoleSchema(),
			organization: OrganizationSchema(),
			user: UserSchema()
		},
		{
			id: 'OrganizationMember'
		}
	)
}
