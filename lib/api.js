const request = require('./request')

module.exports = {
  getBoards,
  getBoardLists,
  getBoardMembers,
  getBoardCards
}

function getBoards ({key, token}) {
  const url = `https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`
  return request(url, {json: true})
}

function getBoardLists ({key, token}, boardId) {
  let url = `https://api.trello.com/1/boards/${boardId}/lists?key=${key}&token=${token}`
  return request(url, {json: true})
}

function getBoardMembers ({key, token}, boardId) {
  let url = `https://api.trello.com/1/boards/${boardId}/members?key=${key}&token=${token}`
  return request(url, {json: true})
}

function getBoardCards ({key, token}, {boardId, since}) {
  let url = `https://api.trello.com/1/boards/${boardId}/cards?key=${key}&token=${token}`
  return request(url, {json: true})
    .then(cards => {
      if (!since) return cards
      return cards.filter(c => {
        const dateLastActivity = new Date(c.dateLastActivity)
        const filterSince = new Date(since)
        return dateLastActivity > filterSince
      })
    })
}
