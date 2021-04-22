import TronWeb from 'tronweb'
import { CacheAddresses } from '.'

const tronWeb = new TronWeb({
    fullHost: 'https://api.nileex.io',
    // eventServer: 'https://api.someotherevent.io',
    privateKey: 'AD71C52E0FC0AB0DFB13B3B911624D4C1AB7BDEFAD93F36B6EF97DC955577509'
})

tronWeb.setPrivateKey('AD71C52E0FC0AB0DFB13B3B911624D4C1AB7BDEFAD93F36B6EF97DC955577509')

export const getTrxBalance = async (address:string): Promise<number> => {
    const addressFound = CacheAddresses.find(a => a.address === address)
    if(addressFound) {
        return (addressFound.balance)/10**6
    }
    else {
        return await (tronWeb.trx.getBalance(address))/10**6
    }
}

export const isTrxAddress = async (address: string): Promise<boolean> => {
    return await tronWeb.isAddress()
}
