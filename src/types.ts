export interface Tx {
  transactionHash: string
  status: 'included' | 'verified' | 'failed'
  feeETH: number
  feeUSD: string
  gasLimit: number
}

export interface Data {
  address: string
  list: Tx[]
  offset: number
}
