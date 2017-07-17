// @flow
const JSONStream = require("JSONStream")
const got = require("got")
const log = require("debug")("openit:get")
/*:: import type { Processor } from "./processors.js"*/
const npmData = require("./data/npm.json")

const get = (pkgName /*:string*/, processor /*:Processor*/) =>
  new Promise((resolve, reject) => {
    log(pkgName)

    // Cache npm data in a file
    if (processor.name === "npm") {
      const data = npmData[pkgName]
      if (typeof data === "undefined") {
        resolve(404)
      } else if (!data) {
        resolve(null)
      } else {
        resolve(data)
      }
    }

    if (!processor.validateName(pkgName)) {
      resolve(null)
    }

    const url = processor.apiUrl(pkgName)
    const stream = got
      .stream(url, {
        headers: {
          "user-agent": "openit.io",
        },
      })
      .on("end", () => {
        log("end stream with got")
      })
      .on("error", (err, data, res) => {
        if (err.statusCode === 404) {
          resolve(404)
        } else {
          resolve(null)
        }
      })
      .pipe(JSONStream.parse(processor.dataPath))

    stream
      .on("data", url => {
        log("stream receive data")
        resolve(url)
      })
      .on("error", err => {
        resolve(null)
      })
      .on("end", () => {
        log("Cannot find the repository url")
        resolve(null)
      })
  })

module.exports = get
