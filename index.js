const { tideToCrunch, writeToFile } = require('./src/index.js')

const file = process.env.FILE
const output = file.replace('.csv', '-crunched.csv')
const finalBalance = process.env.BALANCE

tideToCrunch(file, finalBalance)
  .then(writeToFile(output))
  .then(console.log, console.error)
