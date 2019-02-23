/* globals test */
const assert = require('assert')
const main = require('..')
const boardName = 'trello-recap-integration-tests'
const member = 'christianfei1'

const key = process.env.TRELLO_API_KEY || process.env.npm_config_TRELLO_API_KEY
const token = process.env.TRELLO_API_TOKEN || process.env.npm_config_TRELLO_API_TOKEN

// here is the public board used in the tests: https://trello.com/b/www9vXPI/trello-recap-integration-tests

test('loads cards, lists and members from board', async (done) => {
  const { cards, lists, members } = await main({ key, token }, { boardName })
  assert.ok(cards)
  assert.strictEqual(cards.length, 4)
  assert.ok(lists)
  assert.strictEqual(lists.length, 3)
  assert.ok(members)
  assert.strictEqual(members.length, 1)
  done()
})

test('filters cards by member', async (done) => {
  const { cards } = await main({ key, token }, { boardName, member })
  assert.ok(cards)
  assert.strictEqual(cards.length, 2)
  done()
})

test('filters lists by name', async (done) => {
  const listName = 'done'
  const { lists } = await main({ key, token }, { boardName, listName })
  assert.ok(lists)
  assert.strictEqual(lists.length, 1)
  done()
})

test('filters cards by label', async (done) => {
  const labelName = 'bug'
  const { cards } = await main({ key, token }, { boardName, labelName })
  assert.ok(cards)
  assert.strictEqual(cards.length, 1)
  done()
})

test('calculate effort per list', async (done) => {
  const { lists, effortPerList } = await main({ key, token }, { boardName, showEffort: true })
  assert.ok(lists)
  assert.strictEqual(lists.length, 3)
  assert.strictEqual(effortPerList.length, 3)
  assert.strictEqual(`[{},{"feature":1,"bug":5},{"feature":1}]`, JSON.stringify(effortPerList))
  done()
})
