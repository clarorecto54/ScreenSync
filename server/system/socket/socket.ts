import { io } from "../../server"
import { SocketCleanup } from "../cleanups"
import { ServerLog, TimeLog } from "../log"
import { PeerCount } from "../peer/peer"
import RoomSystem from "./room"

export default function SocketListener() {
    io.on("connection", socket => {
        //* CLIENT CONNECTION
        io.local.emit("leave-room")
        SocketCleanup()
        ServerLog("server", `[ CLIENTS ] Socket: ${io.sockets.sockets.size} | Peer: ${PeerCount}`, true)
        ServerLog("socket", `[ CONNECTED ] ${socket.id}`, true)
        //* CLIENT DISCONNECTION
        socket.on("disconnect", () => {
            SocketCleanup()
            ServerLog("server", `[ CLIENTS ] Socket: ${io.sockets.sockets.size} | Peer: ${PeerCount}`, true)
            ServerLog("socket", `[ DISCONNECTED ] ${socket.id}`, true)
        })
        //* SERVER TIME & PING
        setInterval(() => {
            const now = new Date()
            socket.local.emit("get-server-time", TimeLog())
            socket.local.emit("ping", now.getTime())
        }, 1000)
        //* GETTING IPV4
        socket.on("my-ipv4", () => {
            io.to(socket.id).emit("my-ipv4", socket.handshake.address)
        })
        /* -------------------------- */
        RoomSystem(socket)
    })
}