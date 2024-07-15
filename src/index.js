const fs = require('fs')
const { fromFilePath } = require('csvjsified')

function toNDecimalPlaces (n) {
  return x => Number(Math.round(x + `e${n}`) + `e-${n}`)
}

const to2DP = toNDecimalPlaces(2)

function convertToCrunchJson (tideJson, finalBalance = 0) {
  return addBalance(
    sortTransactionsMostRecentFirst(tideJson).map(tideRow => ({
      Amount: parseFloat(parseFloat(tideRow.Amount).toFixed(2)),
      Date: toDDMMYYYY(new Date(tideRow.Date)),
      'Transaction description': tideRow['Transaction description']
    })),
    parseFloat(finalBalance)
  )
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
