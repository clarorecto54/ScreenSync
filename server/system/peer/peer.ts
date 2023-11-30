import { peer } from "../../server"
import { ServerLog } from "../log"
export default function PeerListener() {
    var PeerCount: number = 0
    peer.on("connection", (client) => {
        PeerCount += 1
        ServerLog("peer", `Total Peer: ${PeerCount}`)
        ServerLog("peer", `Peer Connected: ${client.getId()}`)
    })
    peer.on("disconnect", (client) => {
        PeerCount -= 1
        ServerLog("peer", `Total Peer: ${PeerCount}`)
        ServerLog("peer", `Peer Disconnected: ${client.getId()}`)
    })
}