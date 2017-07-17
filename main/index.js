const server = require("./server")

const PORT = process.env.PORT || 3000

server.listen(PORT, err => {
  if (err) {
    throw new Error(err)
  }
  console.log("Server is listening at http://localhost:" + PORT)
})
