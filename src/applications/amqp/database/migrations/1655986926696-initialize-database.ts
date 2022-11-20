import { resource } from '@pkg/typeorm'
import { MigrationInterface, QueryRunner, Table } from 'typeorm'

const AmqpUnprocessableMessageTable = new Table({
	name: 'AmqpUnprocessableMessage',
	columns: resource([
		{ name: 'reason', type: 'text', isNullable: true },
		{ name: 'error', type: 'jsonb', isNullable: true },
		{ name: 'content', type: 'jsonb' },
		{ name: 'fields', type: 'jsonb' },
		{ name: 'properties', type: 'jsonb' }
	])
})

export class InitializeDatabaseMigration implements MigrationInterface {
	name = 'initialize-applications.amqp.database-1655986926696'

	public async up(query: QueryRunner): Promise<void> {
		await query.createTable(AmqpUnprocessableMessageTable)
	}

	public async down(query: QueryRunner): Promise<void> {
		await query.dropTable(AmqpUnprocessableMessageTable)
	}
}
