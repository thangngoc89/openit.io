const http = require("http")
const pathToRegexp = require("path-to-regexp")
const log = require("debug")("openit:server")
const get = require("./get")
const processors = require("./processors")

const regex = pathToRegexp("/:alias/:package(.*)?")

const server = http.createServer(async (req, res) => {
  let processor = processors.base
  let location = null
  let pkgName
  try {
    // Remove trailing slash
    const requestUrl =
      req.url.substr(-1) === "/" ? req.url.slice(0, -1) : req.url
    const params = regex.exec(requestUrl)

    // log("params", params)

    // Special treatment for npm echo
    // No alias needed
    // prettier-ignore
    if (typeof params[2] === "undefined" && params[1].substr(0, 1) !== "@") {
      pkgName = params[1]
      processor = processors.find(a => a.name === "npm")
      log("npm package with no alias")
    } 
    else if (
      params[1].substr(0, 1) === "@" &&
      typeof params[2] === "string" &&
      params[2].indexOf("/") === -1
    ) {
      // Another npm treatment for scoped packages
      pkgName = params[0].substr(1)
      processor = processors.find(a => a.name === "npm")
      log("npm scoped package with no alias")
    } 
    else if (!params[1] && !params[2]) {
      // Handle 404
      location = 404
      log("404")
    } 
    else {
      pkgName = params[2]
      processor = processors.find(a => a.prefixes.indexOf(params[1]) !== -1)
      log("Normal case with alias and packageName")
    }

    if (processor) {
      log("Send request to processor")
      location = await get(pkgName, processor)
    } else {
      log("no processor found")
      location = 404
    }

    if (location === 404) {
      res.writeHead(404)
      res.end()
    }
    log("Sending location")
  } catch (err) {
    console.error(err)
  }
  res.writeHead(302, {
    Location: location ? location : processor.packageUrl(pkgName),
  })
  res.end()
})

module.exports = server
