module.exports = function parse (args) {
  const sinceIndex = args.indexOf('--since')
  const boardIndex = args.indexOf('--board')
  const memberIndex = args.indexOf('--member')
  let board = boardIndex >= 0 ? args[boardIndex + 1] : undefined
  let since = sinceIndex >= 0 ? args[sinceIndex + 1] : undefined
  let member = memberIndex >= 0 ? args[memberIndex + 1] : undefined

  if (!board) board = args[2]

  return { board, since, member }
}
