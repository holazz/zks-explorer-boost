import { JsonRpcProvider, formatEther } from 'ethers'
import type { Data, Tx } from '../types'

const provider = new JsonRpcProvider('https://mainnet.era.zksync.io')

chrome.webRequest.onCompleted.addListener(
  async (details) => {
    const { frameId, url } = details

    if (frameId === 0) {
      const res = await fetch(url)
      const txs = (await res.json()).list || []

      const data = await Promise.all(
        txs.map(async (tx: Record<string, any>) => {
          const { transactionHash, balanceChanges, fee } = tx
          const ethPrice = balanceChanges.find(
            (item: Record<string, any>) => item.type === 'fee'
          ).tokenInfo.usdPrice

          const feeETH = Number(formatEther(fee))
          const feeUSD = (feeETH * ethPrice).toFixed(2)

          const res = await provider.getTransaction(transactionHash)
          const gasLimit = Number(res?.gasLimit)

          return {
            transactionHash,
            feeETH,
            feeUSD,
            gasLimit,
          } as unknown as Tx
        })
      )

      const urlParams = new URLSearchParams(new URL(url).search)
      const offset = Number(urlParams.get('offset')) || 0
      const address =
        urlParams.get('accountAddress') || urlParams.get('contractAddress')

      const [tab] = await chrome.tabs.query({
        url: `https://explorer.zksync.io/address/${address}*`,
      })

      await chrome.tabs.sendMessage(tab.id!, {
        address,
        list: data,
        offset,
      } as Data)
    }
  },
  { urls: ['https://zksync2-mainnet-explorer.zksync.io/transactions*'] }
)
