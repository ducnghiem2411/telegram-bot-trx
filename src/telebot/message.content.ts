export const sentMessage = (sender: string, amount: number, receiver: string) =>
    `💰 Address ${sender} 
    just sent ${(amount)/10**6} TRX
    ➡️ to ${receiver}`

export const receivedMessage = (sender: string, amount: number, receiver: string) =>
    `💰 Address ${receiver}
    received ${(amount)/10**6} trx
    from ${sender}
    `
