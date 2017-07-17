const server = require("../server")
const getPort = require("get-port")
const nock = require("nock")
const got = require("got")
const child_process = require("child_process")

let url
beforeAll(async () => {
  const port = await getPort()
  process.env.PORT = JSON.stringify(port)
  url = suffix => `http://localhost:${port}/${suffix}`
  server.listen(port)
  console.log("Server is listening on", url(""))
})

const testGenerator = ({ requestUrl, statusCode, location }) => async () => {
  try {
    const res = await got(url(requestUrl), { followRedirect: false })
    expect(res.statusCode).toEqual(statusCode)
    expect(res.headers.location).toEqual(location)
  } catch (err) {
    if (err.statusCode) {
      expect(err.statusCode).toBe(statusCode)
    }
  }
}
const baseConfig = {
  requestUrl: "js/openit.io",
  statusCode: 302,
  location: "https://github.com/thangngoc89/openit.io.git",
}
describe("alias", () => {
  it("js", testGenerator(baseConfig))
  it(
    "npm",
    testGenerator(
      Object.assign({}, baseConfig, { requestUrl: "npm/openit.io" })
    )
  )
  it(
    "npm",
    testGenerator(
      Object.assign({}, baseConfig, { requestUrl: "javascript/openit.io" })
    )
  )
  it(
    "scoped package",
    testGenerator({
      statusCode: 302,
      requestUrl: "js/@arr/map",
      location: "https://github.com/lukeed/arr.git",
    })
  )
})
describe("no alias", () => {
  it(
    "normal packages",
    testGenerator(Object.assign({}, baseConfig, { requestUrl: "openit.io" }))
  )
  it(
    "scoped package",
    testGenerator({
      requestUrl: "@arr/map",
      statusCode: 302,
      location: "https://github.com/lukeed/arr.git",
    })
  )
})

describe("404 cases", () => {
  it(
    "no alias, incorrect scope package",
    testGenerator(
      Object.assign({}, baseConfig, {
        requestUrl: "@phenomic",
        statusCode: 404,
      })
    )
  )
  it(
    "404 from npm",
    testGenerator({
      requestUrl: "foo",
      statusCode: 404,
    })
  )
})
it("work with homepage path")

it(
  "redirect to npm if no repo url",
  testGenerator({
    requestUrl: "0",
    statusCode: 302,
    location: "https://www.npmjs.com/package/0",
  })
)

afterAll(() => {
  server.close(() => console.log("Server closed"))
})
