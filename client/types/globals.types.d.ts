import { Socket } from "socket.io-client";
import { Peer } from "peerjs"
import { Dispatch, SetStateAction } from "react"
interface GlobalProps {
    socket: Socket | null
    peer: Peer | null
    userID: string
    IPv4: string
    name: string
    meetingCode: string
    systemPopup: string
    /* -------------------------- */
    setsocket: Dispatch<SetStateAction<Socket | null>>
    setpeer: Dispatch<SetStateAction<Peer | null>>
    setuserID: Dispatch<SetStateAction<string>>
    setIPv4: Dispatch<SetStateAction<string>>
    setname: Dispatch<SetStateAction<string>>
    setmeetingCode: Dispatch<SetStateAction<string>>
    setsystemPopup: Dispatch<SetStateAction<string>>
}