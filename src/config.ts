import { config } from "dotenv";

config()

if(!process.env.PORT) throw new Error('PORT must be provided')
export const PORT = process.env.PORT

export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''

if(!process.env.KAFKA_BROKER) throw new Error('KAFKA_BROKER must be provided')
export const KAFKA_BROKER = process.env.KAFKA_BROKER

if(!process.env.KAFKA_GROUP_ID) throw new Error('KAFKA_GROUP_ID must be provided')
export const KAFKA_GROUP_ID = process.env.KAFKA_GROUP_ID

if(!process.env.TRON_HOST) throw new Error('TRON_HOST must be provided')
export const TRON_HOST = process.env.TRON_HOST

export const TRON_PRIVATE_KEY = process.env.TRON_PRIVATE_KEY || ''

if(!process.env.MONGO_URI) throw new Error('MONGO_URI must be provided')
export const MONGO_URI = process.env.MONGO_URI

if(!process.env.REDIS_URL) throw new Error('REDIS_URL must be provided')
export const REDIS_URL = process.env.REDIS_URL