export interface TransactionMessage {
    timeStamp: number
    triggerName: string
    transactionId: string
    blockHash: string
    blockNumber: number
    energyUsage: number
    energyFee: number
    originEnergyUsage: number
    energyUsageTotal: number
    netUsage: number
    netFee: number
    result: Result
    contractAddress: string
    contractType: ContractType
    feeLimit: number
    contractCallValue: number
    contractResult: any
    fromAddress: string
    toAddress: string
    assetName: string // trx
    assetAmount: number
    latestSolidifiedBlockNumber: number
    internalTransactionList: Array<any>
    data: any
}

export enum ContractType {
    TransferContract = 'TransferContract',
    TriggerSmartContract = 'TriggerSmartContract',
    VoteWitnessContract = 'VoteWitnessContract',
    CreateSmartContract = 'CreateSmartContract',
    TransferAssetContract = 'TransferAssetContract',
    WithdrawBalanceContract = 'WithdrawBalanceContract',
    FreezeBalanceContract = 'FreezeBalanceContract',
    AccountCreateContract = 'AccountCreateContract',
    UnfreezeBalanceContract = 'UnfreezeBalanceContract',
    ProposalCreateContract = 'ProposalCreateContract',
    ProposalDeleteContract = 'ProposalDeleteContract',
    ProposalApproveContract = 'ProposalApproveContract',
    AccountPermissionUpdateContract = 'AccountPermissionUpdateContract',
    AssetIssueContract = 'AssetIssueContract',
    UpdateAssetContract = 'UpdateAssetContract',
    AccountUpdateContract = 'AccountUpdateContract'
}

export enum Result {
    SUCCESS = 'SUCCESS',
    OUT_OF_ENERGY = 'OUT_OF_ENERGY',
    REVERT = 'REVERT',
    ILLEGAL_OPERATION = 'ILLEGAL_OPERATION',
    TRANSFER_FAILED = 'TRANSFER_FAILED',
    OUT_OF_TIME = 'OUT_OF_TIME'
}

export interface TronAccount {
    address: string
    balance: number
    create_time: number
    latest_operation_time: number
    latest_consume_free_time: number
    account_resource: any
    owner_permission: any
    active_permission: Array<any>
}