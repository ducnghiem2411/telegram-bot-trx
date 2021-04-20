import { CacheAddresses, CacheRawAddresses, updateAddress } from '../index'
import { Addresses, RawAddresses } from '../mongodb'
import { Address, NotifyType } from '../models'
import { getTrxBalance } from '../tronweb'

export async function addAddress(address: string, userId: number): Promise<string> {
    let balance

    try {
        balance = await getTrxBalance(address)
    } catch (e) {
        return e
    }

    try {
        const newAddress: Address = { address, userId, balance, isRemove: false }
        const userAddressIndex = CacheAddresses.findIndex(a => a.address === address && a.userId === userId)

        if (!CacheRawAddresses.includes(address)) {
            await Addresses.insertOne(newAddress)
            await RawAddresses.insertOne({ address, isRemove: false })
            CacheRawAddresses.push(address)
            await updateAddress()
            return 'Add address success'
        }
        else if (userAddressIndex === -1) {
            await Addresses.insertOne(newAddress)
            await updateAddress()
            return 'Add address success'
        }
        else {
            return 'Address is existed'
        }
    } catch (e) {
        console.log(e)
        return 'Internal server error'
    }
}

export async function getAddress(userId: number): Promise<Array<string>> {
    try {
        const addresses = await Addresses.find({ userId, isRemove: false }).toArray()
        return addresses.map(a => a.address)
    } catch (e) {
        return []
    }
}

export async function removeAddress(address: string, userId: number): Promise<string> {
    try {
        const { modifiedCount } = await Addresses.updateOne({ address, userId, }, { $set: { isRemove: true } })
        if(modifiedCount) {
            await updateAddress()
            return 'Remove address success'
        }
        return 'Address is not existed'
    } catch (e) {
        console.log(e)
        return 'Internal server error'
    }
}

export async function addNotification(address: string, userId: number, chatId: number, notification: string, amount?: number): Promise<string> {
    try {
        let noti = {}

        if (notification === NotifyType.follow) {
            noti = { follow: true }
        }
        if (notification === NotifyType.greater && amount) {
            noti = { greater: amount*1000000 }
        }
        if (notification === NotifyType.less && amount) {
            noti = { less: amount*1000000 }
        }

        // Change chatId, less, greater, follow

        const newNoti = { // A part to update user address
            chatId,
            ...noti
        }

        const { result } = await Addresses.updateOne({ address, userId }, { $set: { ...newNoti } })
        if (result.ok) {
            await updateAddress()
            return 'Add notification success'
        }
        return 'Add notification failed'
    } catch (e) {
        console.log(e)
        return 'Internal server error'
    }
}

export async function updateBalance(address: string, userId: number, amountChange: number): Promise<boolean> {
    try {
        const { result } = await Addresses.updateOne({ address, userId }, { $inc: { balance: amountChange }})
        if(result.ok) {
            return true
        }
        return false
    } catch (e) {
        console.log(e)
        return false
    }
}

