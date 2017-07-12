const http = require("http")
const get = require("./get")

const PORT = process.env.PORT || 3000
const npmLink = name => "https://www.npmjs.com/package/" + name

const server = http.createServer(async (req, res) => {
  const name = req.url.substr(1)
  let location = null
  try {
    location = await get(name)
  } catch (err) {
    console.error(err)
  }
  if (location === 404) {
    res.writeHead(404)
    res.end()
  }
  res.writeHead(302, { Location: location ? location : npmLink(name) })
  res.end()
})

server.listen(PORT, err => {
  if (err) {
    throw new Error(err)
  }
  console.log("Server is listening at http://localhost:" + PORT)
})
