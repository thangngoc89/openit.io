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

const testGenerator = ({
  requestUrl,
  repoUrl,
  repoResponse,
  repoResponseCode = 200,
  statusCode,
  location,
}) => async () => {
  try {
    nock("https://registry.npmjs.org")
      .get(repoUrl)
      .reply(repoResponseCode, repoResponse)
    const res = await got(url(requestUrl), { followRedirect: false })
    expect(res.statusCode).toBe(statusCode)
    if (location) {
      expect(res.headers.location).toBe(location)
    }
  } catch (err) {
    if (err.statusCode) {
      expect(err.statusCode).toBe(statusCode)
    }
  }
}
const baseConfig = {
  requestUrl: "js/openit.io",
  repoUrl: "/openit.io",
  repoResponse: {
    repository: { url: "git+https://github.com/thangngoc89/openit.io" },
  },
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
    testGenerator(
      Object.assign({}, baseConfig, {
        requestUrl: "js/@openit/openit.io",
        repoUrl: "/@openit%2fopenit.io",
      })
    )
  )
})
describe("no alias", () => {
  it(
    "normal packages",
    testGenerator(Object.assign({}, baseConfig, { requestUrl: "openit.io" }))
  )
  it(
    "scoped package",
    testGenerator(
      Object.assign({}, baseConfig, {
        requestUrl: "@openit/openit.io",
        repoUrl: "/@openit%2fopenit.io",
      })
    )
  )
})

describe("work with many kind of repository url", () => {
  it(
    "ssh",
    testGenerator(
      Object.assign({}, baseConfig, {
        repoResponse: {
          repository: { url: "git+https://github.com/thangngoc89/openit.io" },
        },
      })
    )
  )
  it(
    "git",
    testGenerator(
      Object.assign({}, baseConfig, {
        repoResponse: {
          repository: { url: "git@github.com:thangngoc89/openit.io" },
        },
      })
    )
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
    testGenerator(
      Object.assign({}, baseConfig, {
        requestUrl: "foo",
        repoUrl: "/foo",
        repoResponseCode: 404,
        statusCode: 404,
      })
    )
  )
})
it("work with homepage path")

afterAll(() => {
  server.close(() => console.log("Server closed"))
})
