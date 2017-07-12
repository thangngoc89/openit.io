// @flow
const JSONStream = require("JSONStream")
const got = require("got")
/*:: import type { Processor } from "./processors.js"*/

const get = (pkgName /*:string*/, processor /*:Processor*/) => {
  return new Promise((resolve, reject) => {
    if (!(processor.validatepkgName && processor.validatepkgName(pkgName))) {
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
        const finalUrl = processor.postprocessUrl(url)
        resolve(finalUrl)
      })
      .on("error", err => {
        resolve(null)
      })
  })
}

module.exports = get
