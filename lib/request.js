const https = require('https')

module.exports = trelloRequest

async function trelloRequest (url) {
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
