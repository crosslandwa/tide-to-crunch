function convert(csvString) {
  const tideKeys = parseLine(csvString.split('\n')[0])
  const dataRows = csvString.split('\n').slice(1).map(parseLine)

  const tideJson = dataRows.map(row => row.reduce((acc, it, index) => {
    acc[tideKeys[index]] = it
    return acc
  }, {}))

  return tideJson.map(tideRow => ({
    Date: toDDMMYYYY(new Date(tideRow.Date)),
    'Transaction description': tideRow['Transaction description']
  }))
}

function parseLine (raw) {
  return raw.split(',').map(key => key.trim().replace(/"/g, ''))
}

const toDDMMYYYY = date => `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

module.exports = {
  convert
}
