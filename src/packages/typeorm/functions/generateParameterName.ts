import { base62UrlAlphabet, randomString } from '@pkg/crypto'

export const generateParameterName = randomString(base62UrlAlphabet, 8)
