const toMD = require('./to-md')
module.exports = function cardToString (card) {
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
