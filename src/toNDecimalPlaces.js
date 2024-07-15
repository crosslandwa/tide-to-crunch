function toNDecimalPlaces (n) {
  return x => Number(Math.round(x + `e${n}`) + `e-${n}`)
}

module.exports = {
  to2DP: toNDecimalPlaces(2)
}
