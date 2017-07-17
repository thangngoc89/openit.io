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
      nock("https://packagist.org/")
        .get("packages/" + nockUrl + ".json")
        .reply(nockResponseCode, {
          package: {
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
const baseConfig = (alias = "php") => ({
  requestUrl: alias + "/laravel/laravel",
  statusCode: 302,
  location: "https://github.com/laravel/laravel",
  nockUrl: "laravel/laravel",
  nockResponseCode: 200,
  nockResponseRepo: "https://github.com/laravel/laravel",
})

it("alias /php", testGenerator(baseConfig("php")))
it("alias /composer", testGenerator(baseConfig("composer")))
it("alias /packagist", testGenerator(baseConfig("packagist")))
it(
  "work with other package",
  testGenerator({
    requestUrl: "php/psr/log",
    statusCode: 302,
    location: "https://github.com/php-fig/log",
    nockUrl: "psr/log",
    nockResponseCode: 200,
    nockResponseRepo: "https://github.com/php-fig/log",
  })
)

it(
  "return 404 on not found packages",
  testGenerator({
    requestUrl: "php/foo/bar",
    statusCode: 404,
  })
)

afterAll(() => {
  server.close(() => console.log("Server closed"))
})
