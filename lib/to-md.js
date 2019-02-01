module.exports = function toMD ({type, text} = {}) {
  if (type === 'h1') return `# ${text}`
  if (type === 'h2') return `## ${text}`
  return text
}
