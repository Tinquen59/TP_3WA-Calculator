const app = require("./app")

const hostname = "127.0.0.1";
const port = 3000;

const server = app

server.listen(port, hostname, () => {
    console.log(`server running at http://${hostname}:${port}`);
})