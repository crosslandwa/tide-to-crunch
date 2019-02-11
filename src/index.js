const fs = require('fs')
const { fromFilePath } = require('csvjsified')
const toPence = pounds => Math.round(pounds * 100)
const toPounds = pence => pence / 100

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

const sortTransactionsMostRecentFirst = tideJson => [...tideJson].sort(
  (a, b) => (a.Timestamp > b.Timestamp) ? -1 : ((b.Timestamp > a.Timestamp) ? 1 : 0)
)

function addBalance (payments, finalBalance) {
  const balances = payments.reduce(
    (acc, payment) => acc.concat(acc.slice(-1) - toPence(payment.Amount)),
    [toPence(finalBalance)]
  )
  return payments.map((payment, index) => Object.assign({}, payment, { Balance: toPounds(balances[index]) }))
}

const toDDMMYYYY = date => `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

function jsonToCsv (transactions) {
  const columns = ['Date', 'Transaction description', 'Amount', 'Balance']
  return [printCsvLine(columns)].concat(
    transactions
      .reduce((acc, transaction) => acc.concat([columns.map(column => transaction[column])]), [])
      .map(printCsvLine)
  ).join('\n')
}

const printCsvLine = data => `"${data.join('","')}"`

const writeToFile = outputFilename => data => new Promise(
  (resolve, reject) => fs.writeFile(outputFilename, data, err => err ? reject(err) : resolve(data))
)

module.exports = {
  convertToCrunchJson,
  tideToCrunch: (csvPath, finalBalance) => fromFilePath(csvPath)
    .then(csv => convertToCrunchJson(csv, finalBalance))
    .then(jsonToCsv),
  writeToFile
}
