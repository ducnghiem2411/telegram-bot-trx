import { ObjectId } from 'mongodb'

interface Address {
    _id?: ObjectId,
    address: string,
    balance: number,
    isRemove?: boolean,
    // User's
    userId: number,
    taggedName?: string,
    chatId?: number,
    // Notifications
    less?: number | null,
    greater?: number | null,
    follow?: boolean
}

interface RawAddress {
    _id?: ObjectId,
    address: string,
    isRemove: boolean
}

enum NotifyType {
    follow = 'follow',
    greater = 'greater',
    less = 'less'
}

enum CommandType {
    check = 'check',
    my_addresses = 'my-addresses',
    add_address = 'add-address',
    remove_address = 'remove-address',
    follow = 'follow',
    greater = 'greater',
    less = 'less'
}

export { Address, RawAddress, NotifyType, CommandType }
