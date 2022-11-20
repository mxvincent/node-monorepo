import { Resource } from '@pkg/typeorm'
import { Column, Entity, OneToMany } from 'typeorm'
import { Issue } from './Issue'
import { OrganizationMember } from './OrganizationMember'

@Entity({ name: 'User' })
export class User extends Resource<User> {
	@Column({ type: 'text', unique: true })
	email!: string

	@Column({ type: 'text', unique: true })
	username!: string

	@Column({ type: 'text' })
	fullName!: string

	@OneToMany(() => Issue, (issue) => issue.user)
	issues!: Issue[]

	@OneToMany(() => OrganizationMember, (organizationMember) => organizationMember.user)
	organizations!: OrganizationMember[]
}
