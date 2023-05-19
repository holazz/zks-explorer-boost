export interface Tx {
  transactionHash: string
  status: 'included' | 'verified' | 'failed'
  feeETH: number
  feeUSD: number
  gasLimit: number
}

export interface Data {
  address: string
  list: Tx[]
  offset: number
}
