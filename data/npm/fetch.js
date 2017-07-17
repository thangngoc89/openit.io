const ora = require("ora")
const validUrl = require("valid-url")
const hostedGitInfo = require("hosted-git-info")
const { writeFileSync, readFileSync, appendFileSync } = require("fs")
const { resolve } = require("path")
const Registry = require("./package-stream")

// Find last sequence
const seqLog = readFileSync(resolve(__dirname, "last-sequence")).toString()
const splitted = seqLog.split("\n")
const lastSequence = splitted[splitted.length - 2]
console.log("Fetching with last sequence", String(lastSequence))

// Init fetching
const registry = Registry({ since: lastSequence })
const spinner = ora("Loading").start()

let totalPackages = 0
let globalSeq

const delta = {}

const check = str => str && typeof str === "string" && str !== ""
registry
  .on("package", function({ pkg, seq }) {
    globalSeq = seq
    spinner.text = String(++totalPackages)
    let url = false

    if (!pkg || !pkg.name) return

    // prettier-ignore
    if (pkg.repository && check(pkg.repository.url)) {
      
      url = pkg.repository.url
    } 
    else if (pkg.repository && check(pkg.repository.git)) {
      url = pkg.repository.git
    } 
    else if (check(pkg.repository)) {
      url = pkg.repository
    } 
    else if (check(pkg.homepage)) {
      url = pkg.homepage
    }
    else {
      delta[pkg.name] = 0
      return
    }

    try {
      const gitHost = hostedGitInfo.fromUrl(url)
      const cleanUrl = (gitHost && gitHost.https({ noGitPlus: true })) || url
      const finalUrl =
        validUrl.isHttpsUri(cleanUrl) || validUrl.isHttpUri(cleanUrl) || 0
      delta[pkg.name] = finalUrl
    } catch (err) {
      console.error(err)
      console.log(pkg.name)
    }
  })
  .on("up-to-date", function({ seq }) {
    spinner.stop()
    console.log("up-to-date")
    globalSeq = seq
    process.exit(0)
  })

function handleExit() {
  if (globalSeq) {
    appendFileSync(
      resolve(__dirname, "last-sequence"),
      String(globalSeq) + "\n"
    )
  }
  console.log("Last seq:", globalSeq)
  writeFileSync(
    resolve(__dirname, "temp", "delta.json"),
    JSON.stringify(delta, null, 2)
  )
  process.exit(0)
}
process.on("SIGINT", handleExit)
process.on("SIGTERM", handleExit)
process.on("exit", handleExit)
