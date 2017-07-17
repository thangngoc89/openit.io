const oldData = require("./temp/npm-old.json")
const delta = require("./temp/delta.json")

const objLength = obj => String(Object.keys(obj).length)

console.log("Comparing delta of", objLength(delta), "entries")
const diff = {
  ADD: {},
  DELETE: {},
  CHANGE: {},
}

let pkgName
for (pkgName in delta) {
  const wasAdded = !oldData.hasOwnProperty(pkgName)
  if (wasAdded) {
    diff.ADD[pkgName] = delta[pkgName]
  } else if (oldData[pkgName] !== delta[pkgName]) {
    diff.CHANGE[pkgName] = delta[pkgName]
  }
}

console.log(objLength(diff.ADD), "packages was added")
console.log(objLength(diff.DELETE), "packages was deleted")
console.log(objLength(diff.CHANGE), "packages' URL was changed")
