import { Resource } from '@pkg/typeorm'
import { ConsumeMessage } from 'amqplib'
import { Column, Entity } from 'typeorm'

@Entity({ name: 'AmqpUnprocessableMessage' })
export class AmqpUnprocessableMessage extends Resource<AmqpUnprocessableMessage> {
	@Column({ type: 'text', nullable: true })
	reason?: string

	@Column({ type: 'jsonb', nullable: true })
	error?: Record<string, unknown>

	@Column({ type: 'jsonb' })
	content!: Record<string, unknown>

	@Column({ type: 'jsonb' })
	fields!: ConsumeMessage['fields']

	@Column({ type: 'jsonb' })
	properties!: ConsumeMessage['properties']
}
