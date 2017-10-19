const { convert } = require('../src/index.js')

describe('tide-to-crunch', () => {
  describe('plucks "Date" values from the Tide CSV', () => {
    it('and converts them to dd/mm/yyyy format', () => {
      const csv = '"Date"\n"2017-10-19"\n"2017-10-18"'
      // loadCSV file
      // feed it in
      // get it out as JSON array
      result = convert(csv)

      expect(result[0].Date).toEqual('19/10/2017')
      expect(result[1].Date).toEqual('18/10/2017')
    })
  })
})
