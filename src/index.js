function convertToCrunchJson(csvString) {
  const csvLines = csvString.split('\n')
  const tideKeys = parseCsvLine(csvLines[0])
  const dataRows = csvLines.slice(1).map(parseCsvLine)

  const tideJson = dataRows.map(row => row.reduce((acc, it, index) => {
    acc[tideKeys[index]] = it
    return acc
  }, {}))

  return tideJson.map(tideRow => ({
    Amount: parseFloat(parseFloat(tideRow.Amount).toFixed(2)),
    Date: toDDMMYYYY(new Date(tideRow.Date)),
    'Transaction description': tideRow['Transaction description']
  }))
}

function parseCsvLine (raw) {
  return raw.split(',').map(key => key.trim().replace(/"/g, ''))
}

const toDDMMYYYY = date => `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

module.exports = {
  convertToCrunchJson
}
