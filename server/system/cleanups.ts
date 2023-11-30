import { httpsServer, io } from "../server"
import GETIP from "./ipv4"
import { TimeLog } from "./log"

export default function GracefulShutdown() {
    io.close(() => {
        console.log(`[ ${TimeLog(true)} ][ SOCKET STOPP ] https://${GETIP()}:3001`)
        httpsServer.close(() => {
            console.log(`[ ${TimeLog(true)} ][ PEER STOP ] https://${GETIP()}:3002`)
            process.exit(1)
        })
    })
}