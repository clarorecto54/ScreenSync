import { io } from "../../server"
import { ServerLog } from "../log"

export default function SocketListener() {
    io.on("connection", socket => {
        //* CLIENT CONNECTION
        ServerLog("socket", `Client Connected: ${socket.id}`)
        ServerLog("socket", `Total Client: ${io.sockets.sockets.size}`)
        //* CLIENT DISCONNECTION
        socket.on("disconnect", () => {
            ServerLog("socket", `Client Disnnected: ${socket.id}`)
            ServerLog("socket", `Total Client: ${io.sockets.sockets.size}`)
        })
    })
}