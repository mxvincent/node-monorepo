import { DataSource } from 'typeorm'

export const databaseShouldBeConnected = (dataSource: DataSource): void => {
  if (!dataSource.isInitialized) {
    throw new Error('[database] data source should be connected')
  }
}
