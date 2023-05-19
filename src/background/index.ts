import { createPublicClient, formatEther, http } from 'viem'
import { zkSync, zkSyncTestnet } from 'viem/chains'
import {
  MAINNET_API_URL,
  MAINNET_EXPLORER_URL,
  TESTNET_API_URL,
  TESTNET_EXPLORER_URL,
} from '../constant'
import type { Data, Tx } from '../types'

chrome.webRequest.onCompleted.addListener(
  async (details) => {
    const { frameId, url } = details

    if (frameId === 0) {
      const res = await fetch(url)
      const txs = (await res.json()).list || []

      const client = createPublicClient({
        chain: url.startsWith(MAINNET_API_URL) ? zkSync : zkSyncTestnet,
        transport: http(),
      })

      const data = await Promise.all(
        txs.map(async (tx: Record<string, any>) => {
          const { transactionHash, status, balanceChanges, fee } = tx
          const ethPrice = Number(
            balanceChanges.find(
              (item: Record<string, any>) => item.type === 'fee'
            )?.tokenInfo.usdPrice || 0
          )

          const feeETH = Number(formatEther(BigInt(fee)))
          const feeUSD = Number((feeETH * ethPrice).toFixed(2))

          const res = await client.getTransaction({ hash: transactionHash })
          const gasLimit = Number(res?.gas)

          return {
            transactionHash,
            status,
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

      let [tab] = await chrome.tabs.query({
        url: url.startsWith(MAINNET_API_URL)
          ? `${MAINNET_EXPLORER_URL}/address/${address}*`
          : `${TESTNET_EXPLORER_URL}/address/${address}*`,
      })

      if (!tab) {
        ;[tab] = await chrome.tabs.query({
          url: url.startsWith(MAINNET_API_URL)
            ? `${MAINNET_EXPLORER_URL}/address/${address?.toLowerCase()}*`
            : `${TESTNET_EXPLORER_URL}/address/${address?.toLowerCase()}*`,
        })
      }

      await chrome.tabs.sendMessage(tab.id!, {
        address,
        list: data,
        offset,
      } as Data)
    }
  },
  {
    urls: [
      `${MAINNET_API_URL}/transactions*`,
      `${TESTNET_API_URL}/transactions*`,
    ],
  }
)
