const { createServer } = require('https')
const { parse } = require('url')
const next = require('next')
const fs = require("fs")
const start = process.env.NODE_ENV === 'production'
const hostname = 'localhost'
const port = 3000
const app = next({ start, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    createServer({
        key: fs.readFileSync("../SSL/server.key"),
        cert: fs.readFileSync("../SSL/server.crt")
    }, async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true)
            const { pathname, query } = parsedUrl
            if (pathname === '/a') {
                await app.render(req, res, '/a', query)
            } else if (pathname === '/b') {
                await app.render(req, res, '/b', query)
            } else {
                await handle(req, res, parsedUrl)
            }
        } catch (err) {
            console.error('Error occurred handling', req.url, err)
            res.statusCode = 500
            res.end('internal server error')
        }
    })
        .once('error', (err) => {
            console.error(err)
            process.exit(1)
        })
        .listen(port, () => {
            console.log(`> Ready on https://${hostname}:${port}`)
        })
})