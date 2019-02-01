/* globals test */
const { equal, ok } = require('assert')
const main = require('..')

const boardName = 'trello-recap-integration-tests'

test('loads cards, lists and members from board', async (done) => {
  const key = process.env.TRELLO_API_KEY || process.env.npm_config_TRELLO_API_KEY
  const token = process.env.TRELLO_API_TOKEN || process.env.npm_config_TRELLO_API_TOKEN
  const {cards, lists, members} = await main({key, token}, {boardName})
  ok(cards)
  equal(cards.length, 3)
  ok(lists)
  equal(lists.length, 3)
  ok(members)
  equal(members.length, 1)
  done()
})

test('filters cards by member', async (done) => {
  const key = process.env.TRELLO_API_KEY || process.env.npm_config_TRELLO_API_KEY
  const token = process.env.TRELLO_API_TOKEN || process.env.npm_config_TRELLO_API_TOKEN
  const member = 'christianfei1'
  const {cards} = await main({key, token}, {boardName, member})
  ok(cards)
  equal(cards.length, 1)
  done()
})

test('filters lists by name', async (done) => {
  const key = process.env.TRELLO_API_KEY || process.env.npm_config_TRELLO_API_KEY
  const token = process.env.TRELLO_API_TOKEN || process.env.npm_config_TRELLO_API_TOKEN
  const listName = 'done'
  const {lists} = await main({key, token}, {boardName, listName})
  ok(lists)
  equal(lists.length, 1)
  done()
})
