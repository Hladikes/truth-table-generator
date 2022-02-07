// Available logic functions
const gates = {
  and: (...params) => params.reduce((acc, cur) => acc &= cur),
  nand: (...params) => Number(!gates.and(...params)),
  or: (...params) => params.reduce((acc, cur) => acc |= cur),
  nor: (...params) => Number(!gates.or(...params)),
  xor: (...params) => params.reduce((acc, cur) => acc ^= cur),
  xnor: (...params) => Number(!gates.xor(...params)),
  nxor: (...params) => Number(!gates.xor(...params)),
  not: (a) => Number(!a)
}

// Generate 2D table of bits combinations, from 0 to 2^size
const table = (size) => {
  const t = []
  for (let i = 0; i < 2**size; i++) {
    const bin = i.toString(2).padStart(size, '0')
    t.push([ ...([...bin].map(d => +d)) ])
  }
  return t
}


const toRunnableFunction = (variables, expression) => {
  return new Function(
    ...[
      ...variables, 
      ...Object.keys(gates)
    ], 
    expression ? `return +(${expression.toLowerCase()})` : 'return "-"'
  )
}

export const evaluateLogicExpressions = (tableSize, variables, logicFns) => {
  const cols = [
    ...variables.map(c => c.toUpperCase()),
    ...logicFns.map(fn => fn.expression.toUpperCase())
  ]

  const rows = table(tableSize).map((row, idx) => {
    const fnResults = logicFns.reduce((results, fn) => {
      const runnableFunction = toRunnableFunction(variables, fn.expression)

      results.push(runnableFunction.apply(null, [
        ...row,
        ...Object.values(gates)
      ]))
      return results
    }, [])

    return [
      ...row,
      ...fnResults
    ]
  })

  return {
    cols,
    rows
  }
}