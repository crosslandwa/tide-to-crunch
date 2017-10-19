const { convert } = require('../src/index.js')

describe('tide-to-crunch', () => {
  it('plucks "Date" values from the Tide CSV and converts them to dd/mm/yyyy format', () => {
    const csv = '"Date"\n"2017-10-19"\n"2017-10-18"'
    result = convert(csv)
    expect(result[0].Date).toEqual('19/10/2017')
    expect(result[1].Date).toEqual('18/10/2017')
  })

  it('plucks "Transaction description" values from the Tide CSV', () => {
    const csv = '"Transaction description"\n"ref 1"\n"ref 2"'
    result = convert(csv)
    expect(result[0]['Transaction description']).toEqual('ref 1')
    expect(result[1]['Transaction description']).toEqual('ref 2')
  })

  it('plucks "Amount" values from the Tide CSV', () => {
    const csv = '"Amount"\n"123.00"\n"321.50"'
    result = convert(csv)
    expect(result[0].Amount).toEqual(123.00)
    expect(result[1].Amount).toEqual(321.50)
  })

})
