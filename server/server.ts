import { PeerServer } from "peer"
import { createServer } from "https"
import { Server } from "socket.io"
import { readFileSync } from "fs"
import { TimeLog } from "./system/log"
import GETIP from "./system/ipv4"
import SocketListener from "./system/socket/socket"
import GracefulShutdown from "./system/cleanups"
const os = require("os")
/* ----- INITIALIZATION ----- */
export const httpsServer = createServer({
    cert: readFileSync("../SSL/server.crt", "utf-8"),
    key: readFileSync("../SSL/server.key", "utf-8")
}, require("express")())
export const io = new Server(httpsServer, { cors: { origin: "*" } })
export const peer = PeerServer({
    ssl: {
        cert: readFileSync("../SSL/server.crt", "utf-8"),
        key: readFileSync("../SSL/server.key", "utf-8")
    },
    allow_discovery: true,
    proxied: true,
    port: 3002,
    path: "/"
})
/* ------ API HANDLING ------ */
SocketListener()
/* ----- SERVER STARTUP ----- */
process.on("SIGINT", GracefulShutdown) //? CTRL + C EVENT
process.on("SIGTERM", GracefulShutdown) //? Terminal got closed
process.on("SIGHUP", GracefulShutdown) //? Terminal hang up
httpsServer
    .once("error", GracefulShutdown)
    .listen(3001, () => {
        console.clear() //? Clear the log
        console.log(`[ ${TimeLog(true)} ][ SOCKET RUNNING ] https://${GETIP()}:3001`)
        console.log(`[ ${TimeLog(true)} ][ PEER RUNNING ] https://${GETIP()}:3002`)
    })