/* globals test */
const { equal, ok } = require('assert')
const { main } = require('..')

test('loads cards from board', async (done) => {
  const key = process.env.TRELLO_API_KEY || process.env.npm_config_TRELLO_API_KEY
  const token = process.env.TRELLO_API_TOKEN || process.env.npm_config_TRELLO_API_TOKEN
  const boardName = 'trello-recap-integration-tests'
  const {cards, lists, members} = await main({key, token}, {boardName})
  ok(cards)
  equal(cards.length, 3)
  ok(lists)
  equal(lists.length, 3)
  ok(members)
  equal(members.length, 1)
  done()
})
