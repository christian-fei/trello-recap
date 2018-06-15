const debug = require('debug')
// debug.enable('trello-recap')
const log = debug('trello-recap')
const {get} = require('got')

const boardName = process.argv[2]
const since = process.argv[3]
const key = process.env.TRELLO_API_KEY || process.env.npm_config_TRELLO_API_KEY
const token = process.env.TRELLO_API_TOKEN || process.env.npm_config_TRELLO_API_TOKEN

if (!boardName) {
  process.stdout.write('Please provide a valid board name')
  process.exit(1)
}

main(boardName, key, token)

async function main (boardName, key, token) {
  process.stdout.write(`Loading cards for ${boardName}`)
  const boards = await getBoards()
  const board = boards.find(b => b.name === boardName)
  if (!board) {
    process.stdout.write('could not find board')
    process.stdout.write(`available boards are ${boards.map(b => b.name).join('\n')}`)
  }

  const lists = await getBoardLists(board.id).then(lists => lists.reduce((lists, list) => ({
    ...lists,
    [list.id]: list.name
  }), {}))

  console.log('lists', lists)

  const cards = await getBoardCards(board.id, since)
  log('cards')
  log(cards[0])

  cards.map(toString).forEach(c => process.stdout.write(c))

  function getBoards () {
    const url = `https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`
    log('-> getBoards')
    return get(url, {json: true}).then(r => r.body)
  }

  function getBoardLists (boardId) {
    let url = `https://api.trello.com/1/boards/${boardId}/lists?key=${key}&token=${token}`
    log('-> getBoardLists', boardId)
    return get(url, {json: true}).then(r => r.body)
  }

  function getBoardCards (boardId, since) {
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

  function toString (card) {
    return `
📋   ${card.name}
${card.labels ? `  labels: ${card.labels.map(l => l.name).join(', ')}` : ''}
  list: ${lists[card.idList]}
`
  }
}
