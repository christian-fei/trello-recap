#!/usr/bin/env node

const debug = require('debug')
// debug.enable('trello-recap')
const log = debug('trello-recap')
const https = require('https')

parse(process.argv)

if (require.main === module) {
  const key = process.env.TRELLO_API_KEY || process.env.npm_config_TRELLO_API_KEY
  const token = process.env.TRELLO_API_TOKEN || process.env.npm_config_TRELLO_API_TOKEN

  if (!key || !token) {
    process.stderr.write(`Please set TRELLO_API_KEY and TRELLO_API_TOKEN in your env.\n`)
    process.exit(1)
  }
  const {board: boardName, since} = parse(process.argv)

  main({key, token}, {boardName, since})
} else {
  module.exports = {main, toMD}
}

async function main ({key, token}, {boardName, since}) {
  if (!boardName) {
    process.stdout.write(`Please provide a valid board name`)
    process.exit(1)
  }

  process.stdout.write(`Loading cards for ${boardName}\n`)
  const boards = await getBoards({key, token})
  const board = boards.find(b => b.name === boardName)

  if (!board) {
    process.stdout.write('could not find board')
    process.stdout.write(`available boards are:\n ${boards.map(b => b.name).join('\n ')}`)
    process.exit(1)
  }

  const boardId = board.id

  const members = await getBoardMembers({key, token}, boardId)
  const lists = await getBoardLists({key, token}, boardId)
  const listsSorted = lists.sort((l1, l2) => l1.pos - l2.pos)

  let cards = await getBoardCards({key, token}, {boardId, since})
  cards = cards.map(c => Object.assign(c, {
    list: lists.find(l => l.id === c.idList),
    members: members.filter(m => c.idMembers.includes(m.id))
  }))

  const cardsPerList = cards.reduce((acc, curr) => Object.assign(acc, {
    [curr.idList]: (acc[curr.idList] || []).concat([curr])
  }), {})

  for (const list of listsSorted) {
    if (!cardsPerList[list.id]) continue
    process.stdout.write('\n')
    process.stdout.write(toMD({type: 'h1', text: listToString(list)}))
    process.stdout.write('\n')
    for (const card of cardsPerList[list.id]) {
      process.stdout.write(cardToString(card))
    }
  }
}

function getBoards ({key, token}) {
  const url = `https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`
  log('-> getBoards')
  return get(url, {json: true})
}

function getBoardLists ({key, token}, boardId) {
  let url = `https://api.trello.com/1/boards/${boardId}/lists?key=${key}&token=${token}`
  log('-> getBoardLists', boardId)
  return get(url, {json: true})
}

function getBoardMembers ({key, token}, boardId) {
  let url = `https://api.trello.com/1/boards/${boardId}/members?key=${key}&token=${token}`
  log('-> getBoardMembers', boardId)
  return get(url, {json: true})
}

function getBoardCards ({key, token}, {boardId, since}) {
  let url = `https://api.trello.com/1/boards/${boardId}/cards?key=${key}&token=${token}`
  log('-> getBoardCards', boardId)
  return get(url, {json: true})

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
    toMD({text: `${card.name}`, type: 'h2'}),
    toMD({text: `\nLink: ${card.url}`}),
    card.labels.length === 0 ? false
      : toMD({text: `\nLabels: ${card.labels.map(l => l.name).join(', ')}`}),
    card.members.length === 0 ? false
      : toMD({text: `\nMembers: ${card.members.map(m => m.fullName).join(', ')}`}),
    toMD({text: `\nDate last activity: ${card.dateLastActivity}`}),
    `\n`,
    `\n`
  ]
  .filter(Boolean)
  .join('')
}

function listToString (list) {
  return `${list.name}\n`
}

function parse (args) {
  log('args', args)
  const sinceIndex = args.indexOf('--since')
  const boardIndex = args.indexOf('--board')
  let board = boardIndex >= 0 ? args[boardIndex + 1] : undefined
  let since = sinceIndex >= 0 ? args[sinceIndex + 1] : undefined
  if (!board) board = args[2]

  return {
    board,
    since
  }
}

async function get (url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode !== 200) return reject(res.statusMessage)
      toString(res, (err, string) => {
        if (err) return reject(new Error(err))
        if (!string) return reject(new Error(string))
        try {
          const json = JSON.parse(string)
          resolve(json)
        } catch (err) {
          reject(err)
        }
      })
    })
  })

  function toBuffer (stream, fn, chunks = []) {
    stream.on('error', err => fn(err))
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('end', data => fn(null, Buffer.concat(chunks)))
  }

  function toString (stream, fn) {
    return toBuffer(stream, (err, buffer) => {
      if (err) return fn(new Error(err))
      fn(null, buffer.toString())
    })
  }
}

function toMD ({type, text} = {}) {
  if (type === 'h1') return `# ${text}`
  if (type === 'h2') return `## ${text}`
  return text
}

process.on('unhandledRejection', console.error)
