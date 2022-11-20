import { getLogger } from '@pkg/logger'
import { randomUUID } from 'crypto'
import { Logger } from 'pino'
import { DataSource, EntityManager, QueryRunner } from 'typeorm'

export interface ServiceContextOptions {
	dataSource: DataSource
	requestId?: string
	userId?: string
}

export class ServiceContext {
	/**
	 * Context unique identifier
	 */
	readonly id = randomUUID()

	/**
	 * Logging interface
	 */
	readonly logger!: Logger

	/**
	 * Authenticated user id
	 */
	readonly userId?: string

	/**
	 * HTTP request unique identifier
	 */
	readonly requestId?: string

	/**
	 * Typeorm datasource
	 */
	private readonly dataSource: DataSource

	/**
	 * Typeorm query runner
	 */
	private queryRunner?: QueryRunner

	constructor(options: ServiceContextOptions) {
		Object.assign(this, options)
		this.dataSource = options.dataSource
		this.logger = getLogger().child(this.toJSON())
	}

	/**
	 * Get typeorm entity manager
	 */
	get entityManager(): EntityManager {
		if (this.queryRunner) {
			return this.queryRunner.manager
		}
		return this.dataSource.manager
	}

	/**
	 * Is database transaction in progress
	 */
	get isTransactionActive(): boolean {
		return this.queryRunner?.isTransactionActive ?? false
	}

	/**
	 * Is typeorm query runner released
	 */
	get isQueryRunnerReleased(): boolean {
		return this.queryRunner?.isReleased ?? false
	}

	/**
	 * Start a database transaction
	 */
	async startTransaction(): Promise<void> {
		if (!this.queryRunner) {
			this.queryRunner = this.dataSource.createQueryRunner()
			this.logger.debug(`[context] database query runner initialized`)
		}
		if (!this.queryRunner.isTransactionActive) {
			await this.queryRunner.startTransaction()
			this.logger.debug(`[context] database transaction started`)
		}
	}

	/**
	 * Commit current database transaction
	 */
	async commitTransaction(): Promise<void> {
		if (this.queryRunner?.isTransactionActive) {
			this.logger.debug(`[context] database transaction committed`)
			await this.queryRunner.commitTransaction()
		} else {
			this.logger.debug(`[context] database query runner is not active (commit)`)
		}
		await this.releaseQueryRunner()
	}

	/**
	 * Rollback current database transaction
	 */
	async rollbackTransaction(): Promise<void> {
		if (this.queryRunner?.isTransactionActive) {
			await this.queryRunner.rollbackTransaction()
			this.logger.debug('[context] database transaction rollback')
		} else {
			this.logger.debug(`[context] database query runner is not active (rollback
      )`)
		}
		await this.releaseQueryRunner()
	}

	/**
	 * Format context for JSON serialisation
	 */
	toJSON(): Record<string, unknown> {
		return {
			reqId: this.requestId,
			contextId: this.id,
			userId: this.userId
		}
	}

	/**
	 * Release typeorm query runner connection
	 */
	private async releaseQueryRunner(): Promise<void> {
		if (this.queryRunner) {
			await this.queryRunner.release()
			this.logger.debug(`[context] database query runner released`)
			this.queryRunner = undefined
		}
	}
}
