export interface Tx {
  transactionHash: string
  feeETH: number
  feeUSD: string
  gasLimit: number
}

export interface Data {
  address: string
  list: Tx[]
  offset: number
}
