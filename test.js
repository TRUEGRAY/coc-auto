let obj = {
  p: 1,
  q: 2
}
function test (a) {
  const arr = new Object({ x: obj.p, y: obj.q })
  obj = null
  return arr
}

console.log(test(1))
