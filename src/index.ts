import './tronweb'
import {} from 'telegraf'
import express from 'express'
import { initTelegraf, TeleBot } from './telebot'
import { connectMongo, Addresses, RawAddresses } from './mongodb'
import { connectBrickConsumer } from './kafka'
import { Address } from './models'

const app = express()
const PORT = 8000

export let CacheAddresses: Array<Address> = []
export let CacheRawAddresses: Array<string> = []

export async function updateAddress() {
    CacheAddresses = await Addresses.find().toArray()
}
export async function updateRawAddress() {
    CacheRawAddresses = await (await RawAddresses.find().toArray()).map((a) => a.address)
}

async function start() {
    try {
        await connectBrickConsumer()
        await connectMongo()

        // replace redis later //
        updateAddress()
        updateRawAddress()
        /////////////////////////

        await initTelegraf(TeleBot)

        app.listen(PORT, () => {
            console.log(`🚀 - App listening on PORT: ${PORT}`)
        })
    } catch (e) {
        throw e
    }
}

start()
