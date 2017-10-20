const { tideToCrunch } = require('./src/index.js')

const file = process.env.FILE
const finalBalance = process.env.BALANCE

tideToCrunch(file, finalBalance).then(console.log, console.error)
