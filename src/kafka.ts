import { Kafka } from 'kafkajs'
import { KAFKA_BROKER, KAFKA_GROUP_ID } from './config'
import { resolveMessage } from './consume_services'

const brickKafka = new Kafka({
    brokers: [KAFKA_BROKER],
    ssl: false,
    sasl: undefined,
    connectionTimeout: 5000,
    requestTimeout: 60000
})

export enum KafkaTopics {
    transaction = 'transaction'
}

export const brickConsumer = brickKafka.consumer({ groupId: KAFKA_GROUP_ID })

export const connectBrickConsumer = async () => {
    try {
        await brickConsumer.connect()
        console.log(`️🎉 Brick consumer connected`)

        await brickConsumer.subscribe({ topic: KafkaTopics.transaction, fromBeginning: true })
        console.log(`️🎉 Brick consumer subscribed topic: ${KafkaTopics.transaction}`)

        await brickConsumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const value = message?.value?.toString()

                    if (!value) throw new Error('EL-200: Cannot get value')

                    await resolveMessage(topic, JSON.parse(value))
                } catch (e) {
                    throw e
                }
            }
        })
    } catch (e) {
        console.error(`brick consumer disconnected`)
        throw e
    }
}

export const disconnectBrickConsumer = async () => {
    try {
        await brickConsumer.disconnect()
        console.log(`🎉 Brick consumer disconnected`)
    } catch (e) {
        console.log(e)
        throw e
    }
}
