const { convertToCrunchJson } = require('../src/index.js')

const asJsObject = csv => {
  const withoutDoubleQuotes = csv.replace(/"/g, '')
  const [ headers, ...data ] = withoutDoubleQuotes.split('\n')
  const splitByComma = x => x.split(',').map(x => x.trim())

  return data.map(splitByComma).reduce((acc, line) => acc.concat(
    splitByComma(headers).reduce((acc, key, i) => ({ ...acc, [key]: line[i] }), {})
  ), [])
}

describe('tide-to-crunch', () => {
  it('plucks "Date" values from the Tide CSV and converts them to dd/mm/yyyy format', () => {
    const csv = '"Date"\n"2017-10-19"\n"2017-10-18"'
    const result = convertToCrunchJson(asJsObject(csv))
    expect(result[0].Date).toEqual('19/10/2017')
    expect(result[1].Date).toEqual('18/10/2017')
  })

  it('plucks "Transaction description" values from the Tide CSV', () => {
    const csv = '"Transaction description"\n"ref 1"\n"ref 2"'
    const result = convertToCrunchJson(asJsObject(csv))
    expect(result[0]['Transaction description']).toEqual('ref 1')
    expect(result[1]['Transaction description']).toEqual('ref 2')
  })

  it('plucks "Amount" values from the Tide CSV and converts them to 2d.p. floats', () => {
    const csv = '"Amount"\n"123.00"\n"321.50"'
    const result = convertToCrunchJson(asJsObject(csv))
    expect(result[0].Amount).toEqual(123.00)
    expect(result[1].Amount).toEqual(321.50)
  })

  it('sorts transactions by date order, most recent first', () => {
    const csv = '"Amount","Timestamp"\n"3.00","2019-02-01 08:00:40"\n"1.00","2019-02-11 21:47:37"\n"2.00","2019-02-05 10:59:55"'
    const result = convertToCrunchJson(asJsObject(csv))
    expect(result[0].Amount).toEqual(1.00)
    expect(result[1].Amount).toEqual(2.00)
    expect(result[2].Amount).toEqual(3.00)
  })

  it('takes a final balance and calculates the balance after each transaction', () => {
    const csv = '"Amount"\n"500.00"\n"-200.00"\n"1000.00'
    const result = convertToCrunchJson(asJsObject(csv), 10000)
    expect(result[0].Amount).toEqual(500.00)
    expect(result[0].Balance).toEqual(10000.00)

    expect(result[1].Amount).toEqual(-200.00)
    expect(result[1].Balance).toEqual(9500.00)

    expect(result[2].Amount).toEqual(1000.00)
    expect(result[2].Balance).toEqual(9700.00)
  })
})
