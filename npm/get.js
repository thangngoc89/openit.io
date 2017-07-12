// @flow
const JSONStream = require("JSONStream")
const got = require("got")
const log = require("debug")("openit:get")
/*:: import type { Processor } from "./processors.js"*/

const get = (pkgName /*:string*/, processor /*:Processor*/) =>
  new Promise((resolve, reject) => {
    log(pkgName)
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
        resolve(processor.postprocessUrl(url))
      })
      .on("error", err => {
        resolve(null)
      })
  })

module.exports = get
