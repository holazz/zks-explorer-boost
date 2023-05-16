import { createApp } from 'vue'
import FeeCell from './components/fee-cell.vue'
import GasLimitCell from './components/gas-limit-cell.vue'
import type { Data } from '../types'

function createTH(title: string) {
  const th = document.createElement('th')
  th.setAttribute('scope', 'col')
  th.setAttribute('class', 'table-head-col')
  th.innerHTML = title
  return th
}

function getColumnIndex(
  table: HTMLTableElement,
  heading: string,
  index: number
) {
  const rowsWithoutHeader = Array.from(table.rows).slice(1)
  const initiatorTd = Array.from(rowsWithoutHeader[index].cells).find(
    (cell) => cell.getAttribute('data-heading') === 'Initiator'
  )
  const additionalColumnCount = initiatorTd ? 1 : 0
  return (
    Array.from(table.rows[0].cells).findIndex(
      (cell) => cell.textContent?.trim() === heading
    ) + additionalColumnCount
  )
}

function toggleColumn(
  table: HTMLTableElement,
  heading: string,
  visible: boolean
) {
  const rowsWithoutHeader = Array.from(table.rows).slice(1)
  const action = visible ? 'remove' : 'add'

  const th = Array.from(table.rows[0].cells).find(
    (cell) => cell.textContent?.trim() === heading
  )
  th?.classList[action]('tablet-column-hidden')

  for (let i = 0; i < rowsWithoutHeader.length; i++) {
    const cells = rowsWithoutHeader[i].cells
    const td = Array.from(cells).find(
      (cell) => cell.getAttribute('data-heading') === heading
    )
    td?.classList[action]('tablet-column-hidden')
  }
}

export function render(data: Data) {
  const { list, offset } = data

  const contractAddressTxsTable = document.querySelector(
    '.contract-tabs table'
  ) as HTMLTableElement
  const accountAddressTxsTable = document.querySelector(
    '.account-tables-container + div table'
  ) as HTMLTableElement

  if (contractAddressTxsTable) {
    const headerRow = contractAddressTxsTable.rows[0]
    const rowsWithoutHeader = Array.from(contractAddressTxsTable.rows).slice(1)

    // hide BLOCK column
    toggleColumn(contractAddressTxsTable, 'Block', false)
    // show AMOUNT column
    toggleColumn(contractAddressTxsTable, 'Amount', true)

    // insert table header
    if (offset === 0) {
      const feeHeader = createTH('Fee')
      const gasLimitHeader = createTH('Gas Limit')

      headerRow.insertBefore(
        feeHeader,
        headerRow.cells[headerRow.cells.length - 2]
      )
      headerRow.insertBefore(
        gasLimitHeader,
        headerRow.cells[headerRow.cells.length - 1]
      )
    }

    // insert table body
    for (let i = 0; i < list.length; i++) {
      const row = rowsWithoutHeader[i + offset]

      const feeCell = row.insertCell(
        getColumnIndex(contractAddressTxsTable, 'Fee', i + offset)
      )
      feeCell.setAttribute('data-heading', 'Fee')
      feeCell.setAttribute('class', 'table-body-col')

      const gasLimitCell = row.insertCell(
        getColumnIndex(contractAddressTxsTable, 'Gas Limit', i + offset)
      )
      gasLimitCell.setAttribute('data-heading', 'Gas Limit')
      gasLimitCell.setAttribute('class', 'table-body-col')

      createApp(FeeCell, {
        feeETH: list[i].feeETH,
        feeUSD: list[i].feeUSD,
      }).mount(feeCell)

      createApp(GasLimitCell, {
        value: list[i].gasLimit,
      }).mount(gasLimitCell)
    }
  }

  if (accountAddressTxsTable) {
    const headerRow = accountAddressTxsTable.rows[0]
    const rowsWithoutHeader = Array.from(accountAddressTxsTable.rows).slice(1)

    // show AMOUNT column
    toggleColumn(accountAddressTxsTable, 'Amount', true)

    // insert table header
    if (offset === 0) {
      const gasLimitHeader = createTH('Gas Limit')

      headerRow.insertBefore(
        gasLimitHeader,
        headerRow.cells[headerRow.cells.length - 1]
      )
    }

    // insert table body
    for (let i = 0; i < list.length; i++) {
      const row = rowsWithoutHeader[i + offset]

      const gasLimitCell = row.insertCell(
        getColumnIndex(accountAddressTxsTable, 'Gas Limit', i + offset)
      )
      gasLimitCell.setAttribute('data-heading', 'Gas Limit')
      gasLimitCell.setAttribute('class', 'table-body-col')

      createApp(GasLimitCell, {
        value: list[i].gasLimit,
      }).mount(gasLimitCell)
    }
  }
}
