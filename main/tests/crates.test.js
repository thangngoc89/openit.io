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
  statusCode,
  location,
  nockUrl,
  nockResponseCode,
  nockResponseRepo,
  nock = true,
}) => async () => {
  try {
    if (nock) {
      nock("https://crates.io/")
        .get("/api/v1/crates/" + nockUrl)
        .reply(nockResponseCode, {
          crate: {
            repository: nockResponseRepo,
          },
        })
    }
    const res = await got(url(requestUrl), { followRedirect: false })
    expect(res.statusCode).toEqual(statusCode)
    expect(res.headers.location).toEqual(location)
  } catch (err) {
    if (err.statusCode) {
      expect(err.statusCode).toBe(statusCode)
    }
  }
}
const baseConfig = (alias = "crates") => ({
  requestUrl: alias + "/libc",
  statusCode: 302,
  location: "https://github.com/rust-lang/libc",
  nockUrl: "libc",
  nockResponseCode: 200,
  nockResponseRepo: "https://github.com/rust-lang/libc",
})

it("alias /crates", testGenerator(baseConfig("crates")))
it("alias /crate", testGenerator(baseConfig("crate")))
it("alias /rust", testGenerator(baseConfig("rust")))
it("alias /cargo", testGenerator(baseConfig("cargo")))
it(
  "work with other package",
  testGenerator({
    requestUrl: "crates/winapi",
    statusCode: 302,
    location: "https://github.com/retep998/winapi-rs",
    nockUrl: "winapi",
    nockResponseCode: 200,
    nockResponseRepo: "https://github.com/retep998/winapi-rs",
  })
)

it(
  "return 404 on not found packages",
  testGenerator({
    requestUrl: "crates/foobarbaz",
    statusCode: 404,
  })
)

afterAll(() => {
  server.close(() => console.log("Server closed"))
})
