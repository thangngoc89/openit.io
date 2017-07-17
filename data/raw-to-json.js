const readline = require("readline")
const { readFileSync, writeFileSync } = require("fs")

const rawData = readFileSync("./npm.raw").toString()

let data = rawData
  .split("\n")
  .map(line => line.split("~#~"))
  .reduce((obj, line) => {
    if (line.length) {
      obj[line[0]] = line[1] === "null" || line[1] === "false" ? 0 : line[1]
    }
    return obj
  }, {})

writeFileSync("./npm.json", JSON.stringify(data, null, 2))
