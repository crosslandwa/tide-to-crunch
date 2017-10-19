function convertToCrunchJson(csvString, finalBalance = 0) {
  const csvLines = csvString.split('\n')
  const tideKeys = parseCsvLine(csvLines[0])
  const dataRows = csvLines.slice(1).map(parseCsvLine)

  const tideJson = dataRows.map(row => row.reduce((acc, it, index) => {
    acc[tideKeys[index]] = it
    return acc
  }, {}))

  return addBalance(tideJson.map(tideRow => ({
    Amount: parseFloat(parseFloat(tideRow.Amount).toFixed(2)),
    Date: toDDMMYYYY(new Date(tideRow.Date)),
    'Transaction description': tideRow['Transaction description']
  })), finalBalance)
}

function addBalance (payments, finalBalance) {
  const balances = payments.reduce((acc, payment) => acc.concat(parseFloat(acc.slice(-1)) - payment.Amount), [finalBalance])
  return payments.map((payment, index) => Object.assign({}, payment, { Balance: balances[index] }))
}

function parseCsvLine (raw) {
  return raw.split(',').map(key => key.trim().replace(/"/g, ''))
}

const toDDMMYYYY = date => `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

module.exports = {
  convertToCrunchJson
}
