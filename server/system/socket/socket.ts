import { io } from "../../server"
import { ServerLog } from "../log"

export default function SocketListener() {
    io.on("connection", socket => {
        //* CLIENT CONNECTION
        ServerLog("socket", `Total Client: ${io.sockets.sockets.size}`)
        ServerLog("socket", `Client Connected: ${socket.id}`)
        //* CLIENT DISCONNECTION
        socket.on("disconnect", () => {
            ServerLog("socket", `Total Client: ${io.sockets.sockets.size}`)
            ServerLog("socket", `Client Disnnected: ${socket.id}`)
        })
        /* -------------------------- */
    })
}