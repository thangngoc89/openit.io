const JSONStream = require("JSONStream")
const got = require("got")
const hostedGitInfo = require("hosted-git-info")
const validateName = require("validate-npm-package-name")

const nullPromise = new Promise(resolve => {
  resolve(null)
})

const get = name => {
  if (!name || name === "") {
    return nullPromise
  }
  const validate = validateName(name)
  if (!validate.validForNewPackages && !validate.validForNewPackages) {
    return nullPromise
  }
  return new Promise((resolve, reject) => {
    const stream = got
      .stream("https://registry.npmjs.com/" + name.replace("/", "%2f"), {
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
      .pipe(JSONStream.parse("repository.url"))

    stream.on("data", url => {
      const cleanUrl = hostedGitInfo.fromUrl(url, { noGitPlus: true })
      if (cleanUrl) {
        resolve(cleanUrl)
      } else {
        resolve(null)
      }
    })
  })
}

module.exports = get
