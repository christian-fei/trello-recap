/* globals test */
const assert = require('assert')
const toMD = require('../lib/to-md')

test('to-md: h1', () => {
  const md = toMD({ type: 'h1', text: 'text' })
  assert.strictEqual(md, '# text')
})

test('to-md: h2', () => {
  const md = toMD({ type: 'h2', text: 'text' })
  assert.strictEqual(md, '## text')
})

test('to-md: regular text', () => {
  const md = toMD({ text: 'text' })
  assert.strictEqual(md, 'text')
})
