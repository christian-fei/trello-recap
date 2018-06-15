#!/usr/bin/env node

const debug = require('debug')
// debug.enable('trello-recap')
const log = debug('trello-recap')
const {get} = require('got')

const boardName = process.argv[2]
const since = process.argv[3]
const key = process.env.TRELLO_API_KEY || process.env.npm_config_TRELLO_API_KEY
const token = process.env.TRELLO_API_TOKEN || process.env.npm_config_TRELLO_API_TOKEN

if (!boardName) {
  process.stdout.write(`Please provide a valid board name`)
  process.exit(1)
}

main(boardName, key, token)

async function main (boardName, key, token) {
  process.stdout.write(`Loading cards for ${boardName}`)
  const boards = await getBoards({key, token})
  const board = boards.find(b => b.name === boardName)

  if (!board) {
    process.stdout.write('could not find board')
    process.stdout.write(`available boards are:\n ${boards.map(b => b.name).join('\n ')}`)
  }

  const members = await getBoardMembers({key, token}, board.id)
  const lists = await getBoardLists({key, token}, board.id)
  const listsSorted = lists.sort((l1, l2) => l1.pos - l2.pos)

  let cards = await getBoardCards({key, token}, board.id, since)
  cards = cards.map(c => Object.assign(c, {
    list: lists.find(l => l.id === c.idList),
    members: members.filter(m => c.idMembers.includes(m.id))
  }))

  const cardsPerList = cards.reduce((acc, curr) => Object.assign(acc, {
    [curr.idList]: (acc[curr.idList] || []).concat([curr])
  }), {})

  for (const list of listsSorted) {
    if (!cardsPerList[list.id]) continue
    process.stdout.write(listToString(list))
    for (const card of cardsPerList[list.id]) {
      process.stdout.write(cardToString(card))
    }
  }
}

function getBoards ({key, token}) {
  const url = `https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`
  log('-> getBoards')
  return get(url, {json: true}).then(r => r.body)
}

function getBoardLists ({key, token}, boardId) {
  let url = `https://api.trello.com/1/boards/${boardId}/lists?key=${key}&token=${token}`
  log('-> getBoardLists', boardId)
  return get(url, {json: true}).then(r => r.body)
}

function getBoardMembers ({key, token}, boardId) {
  let url = `https://api.trello.com/1/boards/${boardId}/members?key=${key}&token=${token}`
  log('-> getBoardMembers', boardId)
  return get(url, {json: true}).then(r => r.body)
}

function getBoardCards ({key, token}, boardId, since) {
  let url = `https://api.trello.com/1/boards/${boardId}/cards?key=${key}&token=${token}`
  log('-> getBoardCards', boardId)
  return get(url, {json: true})
    .then(r => r.body)
    .then(cards => {
      if (!since) return cards
      return cards.filter(c => {
        const dateLastActivity = new Date(c.dateLastActivity)
        const filterSince = new Date(since)
        return dateLastActivity > filterSince
      })
    })
}

function cardToString (card) {
  return [
    `⚡️        ${card.name}`,
    `\n    🔗    ${card.url}`,
    card.labels.length > 0 ? `\n    ${labelsToString(card.labels)}` : false,
    card.members.length > 0 ? `\n    ${membersToString(card.members)}` : false,
    `\n`,
    `\n`
  ]
  .filter(Boolean)
  .join('')
}

function labelsToString (labels) {
  return `🏷    ${labels.map(l => l.name).join(', ')}`
}

function membersToString (members) {
  return `👤    ${members.map(m => m.fullName).join(', ')}`
}

function listToString (list) {
  return `\n📋   "${list.name}"\n`
}

process.on('unhandledRejection', console.error)
