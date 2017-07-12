const http = require("http")
const pathToRegexp = require("path-to-regexp")

const get = require("./get")
const processors = require("./processors")

const PORT = process.env.PORT || 3000
const regex = pathToRegexp("/:alias/:package(.*)")

const server = http.createServer(async (req, res) => {
  try {
    let location = null
    let processor = processors.base
    const parsedParams = regex.exec(req.url)
    const pkgName = parsedParams[2]
    if (!parsedParams) {
      location = 404
    } else {
      processor = processors.find(
        a => a.prefixes.indexOf(parsedParams[1]) !== -1
      )
      if (processor) {
        location = await get(pkgName, processor)
      } else {
        location = 404
      }
    }

    if (location === 404) {
      res.writeHead(404)
      res.end()
    }
    res.writeHead(302, {
      Location: location ? location : processor.packageUrl(pkgName),
    })
    res.end()
  } catch (err) {
    console.error(err)
  }
})

server.listen(PORT, err => {
  if (err) {
    throw new Error(err)
  }
  console.log("Server is listening at http://localhost:" + PORT)
})
