import { connect, MongoClient, Collection } from 'mongodb'
import { MONGO_URI } from './config'
import { Address, RawAddress } from './models'

let mongo: MongoClient

const collections = {
    addresses: 'addresses',
    raw_addresses: 'raw_addresses',
}

let Addresses: Collection<Address>
let RawAddresses: Collection<RawAddress>

const connectMongo = async () => {
    try {
        mongo = await connect(MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            ignoreUndefined: true
        })

        mongo.on('error', async (e) => {
            try {
                await mongo.close()
                await connectMongo()
            } catch (e) {
                setTimeout(connectMongo, 1000)
                throw e
            }
        })

        mongo.on('timeout', async () => {
            try {
                await mongo.close()
                await connectMongo()
            } catch (e) {
                setTimeout(connectMongo, 1000)
                throw e
            }
        })

        mongo.on('close', async () => {
            try {
                await connectMongo()
            } catch (e) {
                throw e
            }
        })

        Addresses = mongo.db().collection(collections.addresses)
        RawAddresses = mongo.db().collection(collections.raw_addresses)
        
        await Promise.all([
            Addresses.createIndexes([{ key: { address: 1, username: 1 } }]),
            RawAddresses.createIndexes([{ key: { address: 1 } }]),
        ])

        console.log(`🌿 - Mongodb connected`)
    } catch (e) {
        console.error(`🍂 - Mongodb disconnected`)
        await mongo?.close(true)
        setTimeout(connectMongo, 1000)
        throw e
    }
}

export { connectMongo, Addresses, RawAddresses }
