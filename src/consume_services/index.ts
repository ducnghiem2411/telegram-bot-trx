import { KafkaTopics } from '../kafka'
import { TeleBot } from '../telebot'
import { ContractType, TransactionMessage } from '../types'
import { CacheRawAddresses, CacheAddresses } from '../index'
import { updateBalance } from '../telebot/service'
import { sentMessage, receivedMessage } from '../telebot/message.content'

export async function resolveMessage(topic, value: TransactionMessage) {
    try {
        switch (topic) {
            case KafkaTopics.transaction:
                if (value.contractType === ContractType.TransferContract) {
    
                    if (CacheRawAddresses.includes(value.fromAddress)) {
                        const users = CacheAddresses.filter((a) => a.address === value.fromAddress)

                        if (users.length) {
                            users.forEach(async (userAddress) => {
                                // Update balance, from this address so balance will be reduce. Update to database => update to cache
                                await updateBalance(userAddress.address, userAddress.userId, -(value.assetAmount))
                                const addressIndex = CacheAddresses.findIndex((a) => (a.userId === userAddress.userId && a.address === userAddress.address))
                                if (addressIndex === -1) throw Error('Cache error')
                                CacheAddresses[addressIndex].balance -= value.assetAmount

                                // Sent notification
                                if (userAddress.chatId) {
                                    if(userAddress.follow) {
                                        TeleBot.telegram.sendMessage(userAddress.chatId, sentMessage(value.fromAddress, value.assetAmount, value.toAddress))
                                    }
                                    if(userAddress.less && userAddress.less > CacheAddresses[addressIndex].balance) {
                                        TeleBot.telegram.sendMessage(userAddress.chatId, `Balance of address ${value.fromAddress} went below ${(userAddress.less)/10**6} trx`)
                                    }
                                }
                            })
                        }
                    }
    
                    if (CacheRawAddresses.includes(value.toAddress)) {
                        const users = CacheAddresses.filter((a) => a.address === value.toAddress)
                        
                        if (users.length) {
                            users.forEach(async (userAddress) => {
                                // Update balance, from this address so balance will be reduce. Update to database => update to cache
                                await updateBalance(userAddress.address, userAddress.userId, value.assetAmount)
                                const addressIndex = CacheAddresses.findIndex((a) => (a.userId === userAddress.userId && a.address === userAddress.address))
                                if (addressIndex === -1) throw Error('Cache error')
                                CacheAddresses[addressIndex].balance += value.assetAmount

                                // Sent notification
                                if (userAddress.chatId) {
                                    if(userAddress.follow) {
                                        TeleBot.telegram.sendMessage(userAddress.chatId, receivedMessage(value.fromAddress, value.assetAmount, value.toAddress))
                                    }
                                    if(userAddress.greater && userAddress.greater < CacheAddresses[addressIndex].balance) {
                                        TeleBot.telegram.sendMessage(userAddress.chatId, `Balance of address ${value.fromAddress} went above ${(userAddress.greater)/10**6} trx`)
                                    }
                                }
                            })
                        }
                    }
    
                }
                break
            default:
                return 'No topic type'
        }
    } catch (error) {
        
    }
}

const exObj = {
    timeStamp: 1618230537000,
    triggerName: 'transactionTrigger',
    transactionId: 'b6148e29a2bce5066c731507d19fcae97d8b86486d068cfc4083f71ffc685431',
    blockHash: '0000000000e5ebfd2b541be9b55b41183f680429a4ad66ff3027f1fa1ac356f4',
    blockNumber: 15068157,
    energyUsage: 0,
    energyFee: 0,
    originEnergyUsage: 0,
    energyUsageTotal: 0,
    netUsage: 0,
    netFee: 100000,
    result: 'SUCCESS',
    contractAddress: null,
    contractType: 'TransferContract',
    feeLimit: 0,
    contractCallValue: 0,
    contractResult: null,
    fromAddress: 'TTG8u8fUKqJwMtB59ppaWqgFVGDb5ojWPU',
    toAddress: 'TJ96c3tJdN9bMg518SvSXEHudV1q3AA4hu',
    assetName: 'trx',
    assetAmount: 5000000000,
    latestSolidifiedBlockNumber: 15068139,
    internalTransactionList: [],
    data: ''
}
