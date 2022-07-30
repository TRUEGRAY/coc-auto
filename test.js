function test ( a ) {
  if(a === 10) return a
  return test(++a)
}

console.log(test(1))
