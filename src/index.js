const fs = require('fs')
const { fromFilePath } = require('csvjsified')
const { to2DP } = require('./toNDecimalPlaces.js')

function convertToCrunchJson (tideJson, finalBalance = 0) {
  const sortedTransactions = sortTransactionsMostRecentFirst(tideJson)

  const parsedTransactions = sortedTransactions.map(tideRow => ({
    Amount: tideRow['Paid in']
      ? parseAmount(tideRow['Paid in'])
      : -1 * parseAmount(tideRow['Paid out']),
    Date: toDDMMYYYY(new Date(tideRow.Date)),
    'Transaction description': tideRow['Transaction description']
  }))

  return addBalance(parsedTransactions, parseFloat(finalBalance))
}

function parseAmount (amount) {
  if (amount === undefined || amount === null) {
    return 0
  }
  const amountWithoutCommas = amount.replaceAll(',', '')
  return parseFloat(parseFloat(amountWithoutCommas).toFixed(2))
}

function sortTransactionsMostRecentFirst (tideJson) {
  return [...tideJson].sort(
    (a, b) => (a.Timestamp > b.Timestamp) ? -1 : ((b.Timestamp > a.Timestamp) ? 1 : 0)
  )
}

function addBalance (payments, finalBalance) {
  const balances = payments.reduce(
    (acc, payment) => [...acc, to2DP(lastItemInArray(acc) - payment.Amount)],
    [to2DP(finalBalance)]
  )
  return payments.map((payment, index) => Object.assign({}, payment, { Balance: balances[index] }))
}

function lastItemInArray (array) {
  return array.slice(-1)[0]
}

function toDDMMYYYY (date) {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

function jsonToCsv (transactions) {
  const columns = ['Date', 'Transaction description', 'Amount', 'Balance']
  return [printCsvLine(columns)].concat(
    transactions
      .reduce((acc, transaction) => acc.concat([columns.map(column => transaction[column])]), [])
      .map(printCsvLine)
  ).join('\n')
}

function printCsvLine (data) {
  return `"${data.join('","')}"`
}

function writeToFile (outputFilename) {
  return data => new Promise(
    (resolve, reject) => fs.writeFile(outputFilename, data, err => err ? reject(err) : resolve(data))
  )
}

module.exports = {
  tideToCrunch: (csvPath, finalBalance) => fromFilePath(csvPath)
    .then(csv => convertToCrunchJson(csv, finalBalance))
    .then(jsonToCsv),
  writeToFile
}
