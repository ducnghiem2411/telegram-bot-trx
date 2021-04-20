import { Telegraf } from 'telegraf'
import { TELEGRAM_BOT_TOKEN } from '../config'
import { CommandType, NotifyType } from '../models'
import { getTrxBalance } from '../tronweb'
import { getAddress, addAddress, removeAddress, addNotification } from './service'


export const TeleBot = new Telegraf(TELEGRAM_BOT_TOKEN, {})

export async function initTelegraf(bot: Telegraf) {

    try {
        bot.command('/start', (ctx) => {
            console.log(ctx.chat);
            
            ctx.replyWithHTML(`
                🎉 🥳 Welcome <a href="tg://user?id=${ctx.message.from.id}">${ctx.message.from.first_name} ${ctx.message.from.last_name}</a>
                <b>You can control me by sending these commands </b>

                    /help

                    <b>Address information</b> 
                    check (address)
            
                    <b>Manage address</b>
                    my-addresses
                    add-address (address)
                    remove-address (address)

                    <b>Get balance notification</b>
                    follow (address)
                    greater (amount) (address)
                    less (amount) (address)
            `)
        })

        bot.command('/help', (ctx) => {
            console.log(ctx.chat);
            
            ctx.replyWithHTML(`
                    /help

                    <b>Address information</b> 
                    check (address)
            
                    <b>Manage address</b>
                    my-addresses
                    add-address (address)
                    remove-address (address)

                    <b>Get balance notification</b>
                    follow (address)
                    greater (amount) (address)
                    less (amount) (address)
            `)
        })

        bot.on('message', async (ctx) => {
            const message = await ctx.update.message['text']
            const userId = await ctx.update.message.from.id
            const chatId = await ctx.chat.id

            const [command, sub1, sub2] = message.split(' ')

            console.log('command: ', command)
            console.log('sub1: ', sub1)
            console.log('sub2: ', sub2)

            if (command === CommandType.check) {
                const balance = await getTrxBalance(sub1)
                ctx.reply(`Balance: ${balance}`)
            }

            else if (command === CommandType.my_addresses) {
                const addresses = await getAddress(userId)
                if (!addresses.length) ctx.reply('No address')
                let listAddress = addresses.join('\n')
                // addresses.forEach((a) => {
                //     listAddress += a
                // })
                ctx.replyWithHTML(listAddress)
            }

            else if (command === CommandType.add_address) {
                const result = await addAddress(sub1, userId)
                ctx.reply(result)
            }

            else if (command === CommandType.remove_address) {
                const result = await removeAddress(sub2, userId)
                ctx.reply(result)
            }

            else if (command === CommandType.follow) {
                const result = await addNotification(sub1, userId, chatId, NotifyType.follow)
                ctx.reply(result)
            }

            else if (command === CommandType.greater) {
                const result = await addNotification(sub2, userId, chatId, NotifyType.greater, Number(sub1))
                ctx.reply(result)
            }

            else if (command === CommandType.less) {
                const result = await addNotification(sub2, userId, chatId, NotifyType.less, Number(sub1))
                ctx.reply(result)
            }

            else {
                ctx.reply('Command not found')
            }
        })

        // bot.telegram.sendMessage(1736462446, 'this is a notification')
    } catch (error) {}

    try {
        bot.launch()
        console.log('🌥  - Telegraf connected ')
    } catch (error) {
        console.log('🌧  - Telegraf disconnected')
        throw error
    }
}
