module.exports = function parse (args) {
  const sinceIndex = args.indexOf('--since')
  const boardIndex = args.indexOf('--board')
  const memberIndex = args.indexOf('--member')
  const listIndex = args.indexOf('--list')
  const labelIndex = args.indexOf('--label')
  const effortIndex = args.indexOf('--effort')
  let board = boardIndex >= 0 ? args[boardIndex + 1] : undefined
  const since = sinceIndex >= 0 ? args[sinceIndex + 1] : undefined
  const member = memberIndex >= 0 ? args[memberIndex + 1] : undefined
  const list = listIndex >= 0 ? args[listIndex + 1] : undefined
  const label = labelIndex >= 0 ? args[labelIndex + 1] : undefined
  const effort = effortIndex >= 0 ? true : undefined

  if (!board) board = args[2]

  return { board, since, member, list, label, effort }
}
