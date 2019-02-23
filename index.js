#!/usr/bin/env node

const { getBoardCards, getBoardMembers, getBoardLists, getBoards } = require('./lib/api')

module.exports = main

async function main ({key, token}, {boardName, since, member, listName, labelName, showEffort}) {
  if (!boardName) {
    return { errors: ['missing board name'] }
  }

  const boards = await getBoards({key, token})
  const board = boards.find(b => b.name === boardName)

  if (!board) {
    return { errors: [`board not found: available boards are:\n ${boards.map(b => b.name).join('\n ')}`] }
  }

  const boardId = board.id

  const members = await getBoardMembers({key, token}, boardId)
  let lists = await getBoardLists({key, token}, boardId)
  lists = listName ? lists.filter(l => listName && l.name.toLowerCase().includes(listName)) : lists
  const listsSorted = lists.sort((l1, l2) => l1.pos - l2.pos)

  let cards = await getBoardCards({key, token}, {boardId, since})
  cards = cards.map(c => Object.assign(c, {
    list: lists.find(l => l.id === c.idList),
    members: members.filter(m => c.idMembers.includes(m.id)),
  }))
  .filter(c => {
    if (!member) return true
    return c.members.some(m => m.username === member)
  })
  .filter(c => {
    if (!labelName) return true
    const result = c.labels.some(label => label.name.toLowerCase().includes(labelName))
    return result
  })

  const cardsPerList = cards.reduce((acc, curr) => Object.assign(acc, {
    [curr.idList]: (acc[curr.idList] || []).concat([curr])
  }), {})

  const effortPerList = !showEffort ? [] : listsSorted.map((list) => {
    return cardsPerList[list.id] ? cardsPerList[list.id].reduce((effort, card) => {
      const parsedName = /\(\d+/g.exec(card.name)
      const count = parsedName ? parseInt(parsedName[0].substr(1)) : 1
      if (card.labels) {
        card.labels.map(label => !effort[label.name] ? effort[label.name] = count : effort[label.name] += count)
      }
      return effort
    }, {}) : {}
  })

  return {
    boards,
    board,
    members,
    lists,
    listsSorted,
    cards,
    cardsPerList,
    effortPerList
  }
}
