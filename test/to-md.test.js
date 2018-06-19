/* globals test */
const { equal, ok } = require('assert')
const { toMD } = require('..')

test('to-md: h1', () => {
  const md = toMD({type: 'h1', text: 'text'})
  equal(md, '# text')
})

test('to-md: h2', () => {
  const md = toMD({type: 'h2', text: 'text'})
  equal(md, '## text')
})

test('to-md: regular text', () => {
  const md = toMD({text: 'text'})
  equal(md, 'text')
})
