const oldData = require("./temp/npm-old.json")
const delta = require("./temp/delta.json")

const { writeFileSync } = require("fs")
const { resolve } = require("path")

let pkgName
for (pkgName in delta) {
  oldData[pkgName] = delta[pkgName]
}

writeFileSync(
  resolve(__dirname, "temp", "npm.json"),
  JSON.stringify(oldData, null, 2)
)
