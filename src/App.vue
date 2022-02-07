<script setup>
  import { computed, ref } from 'vue'
  import * as Logic from './plugins/logic'

  const functionFactory = (expression) => ({
    _id: (Math.random() + '').substr(2),
    expression
  })

  const cellSize = ref(1)
  const tableSize = ref(1)
  const variables = computed(() => {
    if (tableSize.value <= 0) return []
    return new Array(tableSize.value)
      .fill('A'.charCodeAt(0))
      .map((charCode, idx) => String.fromCharCode(charCode + idx).toLowerCase())
  })

  const functions = ref([ functionFactory('') ])
  const addFunction = () => functions.value.push(functionFactory(''))
  const removeFunction = (idx) => functions.value.splice(idx, 1)

  const operators = [
    [ 'and(a, b, c)', 'a & b & c' ],
    [ 'nand(a, b, c)', '!(a & b & c)' ],
    [ 'or(a, b, c)', 'a | b | c' ],
    [ 'nor(a, b, c)', '!(a | b | c)' ],
    [ 'xor(a, b, c)', 'a ^ b ^ c' ],
    [ 'xnor(a, b, c)', '!(a ^ b ^ c)' ],
    [ 'not(a)', '!a' ]
  ]

  const error = ref('')
  const cols = ref([])
  const rows = ref([])

  const generateTable = () => {
    error.value = ''
    try {
      const result = Logic.evaluateLogicExpressions(tableSize.value, variables.value, functions.value)
      cols.value = result.cols
      rows.value = result.rows
    } catch (err) {
      error.value = 'Oopsie, looks like you have issue somewhere.'
      console.error('Woah, you made this this far. Congrats, here is whole error message')
      console.error(err)
    }
  }

  const isTableGenerated = computed(() => {
    return cols.value.length > 0 && rows.value.length > 0
  })

  const clearTable = () => {
    cols.value = []
    rows.value = []
  }
</script>


<template>
  <div class="container-fluid min-vh-100 bg-dark py-3">
    <div class="row">
      <div class="col-3">
        <div class="card p-3">
          <h4>Define table size</h4>
          <h5 class="text-center display-6">{{ tableSize }}</h5>
          <div class="d-flex w-100">
            <span class="me-2">1</span>
            <input 
              class="flex-grow-1" 
              type="range" 
              v-model.number="tableSize" 
              min="1" 
              max="8">
            <span class="ms-2">8</span>
          </div>
          <hr>
          <span>Variables</span>
          <span class="font-monospace fs-5 text-primary">{{ variables.length > 0 ? variables.join(', ') : '-' }}</span>
          <span class="text-dark fs-6 mt-3">*You can use variable names and functions both in UPPERCASE and lowercase</span>
        </div>

        <div class="card mt-3 p-3">
          <h4>Functions</h4>
          <div v-if="functions?.length > 0">
            <div v-for="(fn, idx) in functions" :key="fn._id" class="input-group mt-1">
              <span class="input-group-text">{{ idx + 1 }}</span>
              <input 
                v-model.trim="fn.expression" 
                type="text" 
                class="form-control font-monospace"
                placeholder="and(!A, B)">
              <span @click="removeFunction(idx)" class="input-group-text btn btn-outline-danger">X</span>
            </div>
          </div>
          <h5 class="fs-5 text-center mt-3" v-else>No functions defined</h5>
          <button @click="addFunction" class="btn btn-primary mt-3">Add function</button>
        </div>

        <div class="card mt-3 p-3">
          <div class="alert alert-danger" v-if="error">{{ error }}</div>
          <button @click="generateTable" class="btn btn-lg btn-success">Generate table</button>
          <button @click="clearTable" class="btn btn-outline-danger mt-3">Clear table</button>
        </div>

        <div class="card mt-3 p-3">
          <h4>Available operations</h4>
          <table>
            <tr v-for="(operator, oIdx) in operators" :key="oIdx">
              <td class="p-1 font-monospace">{{ operator[0] }}</td>
              <td class="p-1 font-monospace">{{ operator[1] }}</td>
            </tr>
          </table>
        </div>
      </div>

      <div class="col-9">
        <div class="card p-3">
          <template v-if="isTableGenerated">
            <h4>Cell size</h4>
            <div class="d-flex col-4 mb-2">
              <span class="me-2">1</span>
              <input 
                class="flex-grow-1" 
                type="range" 
                v-model.number="cellSize" 
                min="1" 
                max="6">
              <span class="ms-2">6</span>
            </div>
          </template>
          <table v-if="isTableGenerated" class="font-monospace fs-3">
            <tr>
              <th 
                v-for="col in cols" 
                :key="col" 
                class="px-2"
                :class="'fs-' + (7 - cellSize)">{{ col }}</th>
            </tr>
            <tr v-for="(row, rIdx) in rows" :key="rIdx">
              <td 
                v-for="(cell, cIdx) in row" 
                :key="cIdx" 
                class="px-2 fs-6"
                :class="{
                  'text-danger': cell == 0,
                  'text-primary': cell == 1
                }">
                <span 
                  :class="'fs-' + (7 - cellSize)"
                  >{{ cell }}</span>
              </td>
            </tr>
          </table>
          <div v-else>
            <h5 class="display-5 mx-3 my-2">No data</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  table, tr, td, th {
    border: 1px solid lightgray;
    border-collapse: collapse;
  }

  tr:nth-child(even) {
    background-color: #EEEEEE;
  }
</style>