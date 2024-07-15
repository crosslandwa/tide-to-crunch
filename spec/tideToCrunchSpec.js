const { tideToCrunch } = require('../src/index.js')
const fs = require('fs')

const STUB_FILEPATH = `${__dirname}/support/stub.csv`

function writeStubFile (data) {
  fs.writeFileSync(STUB_FILEPATH, data)
}

describe('tide-to-crunch', () => {
  afterAll(() => {
    fs.unlinkSync(STUB_FILEPATH)
  })

  it('plucks "Date" values from the Tide CSV and converts them to dd/mm/yyyy format', async () => {
    const inputCSV = '"Date"\n"2017-10-19"\n"2017-10-18"'
    writeStubFile(inputCSV)

    const outputCSV = await tideToCrunch(STUB_FILEPATH, 1000)
    const outputCSVRows = outputCSV.split('\n')

    expect(outputCSVRows[1]).toContain('"19/10/2017"')
    expect(outputCSVRows[2]).toContain('"18/10/2017"')
  })

  it('plucks "Transaction description" values from the Tide CSV', async () => {
    const inputCSV = '"Transaction description"\n"ref 1"\n"ref 2"'
    writeStubFile(inputCSV)

    const outputCSV = await tideToCrunch(STUB_FILEPATH, 1000)
    const outputCSVRows = outputCSV.split('\n')

    expect(outputCSVRows[1]).toContain('"ref 1"')
    expect(outputCSVRows[2]).toContain('"ref 2"')
  })

  it('plucks "Amount" values from the Tide CSV and converts them to 2d.p. floats', async () => {
    const inputCSV = '"Amount"\n"123.00"\n"321.50"'
    writeStubFile(inputCSV)

    const outputCSV = await tideToCrunch(STUB_FILEPATH, 1000)
    const outputCSVRows = outputCSV.split('\n')

    expect(outputCSVRows[1]).toContain('"123"')
    expect(outputCSVRows[2]).toContain('"321.5"')
  })

  it('sorts transactions by date order, most recent first', async () => {
    const inputCSV = '"Amount","Timestamp"\n"3.00","2019-02-01 08:00:40"\n"1.00","2019-02-11 21:47:37"\n"2.00","2019-02-05 10:59:55"'
    writeStubFile(inputCSV)

    const outputCSV = await tideToCrunch(STUB_FILEPATH, 1000)
    const outputCSVRows = outputCSV.split('\n')

    expect(outputCSVRows[1]).toContain('"1"')
    expect(outputCSVRows[2]).toContain('"2"')
    expect(outputCSVRows[3]).toContain('"3"')
  })

  it('takes a final balance and calculates the balance after each transaction', async () => {
    const inputCSV = '"Amount"\n"500.00"\n"-200.00"\n"1000.00'
    writeStubFile(inputCSV)

    const outputCSV = await tideToCrunch(STUB_FILEPATH, 10000)
    const outputCSVRows = outputCSV.split('\n')

    expect(outputCSVRows[1]).toContain('"10000"')
    expect(outputCSVRows[2]).toContain('"9500"')
    expect(outputCSVRows[3]).toContain('"9700"')
  })
})
