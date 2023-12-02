import { Socket } from "socket.io";
import { RoomProps, UserProps } from "./socket.types";
import { ServerLog, TimeLog } from "../log";
import { io } from "../../server";
import { RoomCleanup, RoomList, SocketCleanup } from "../cleanups";

export default function RoomSystem(socket: Socket) {
    RoomCleanup()
    socket.on("check-host", (targetRoom: string) => {
        RoomList.forEach(room => {
            if (room.id === targetRoom) { //? Find the target room
                room.host.id === socket.id && io.to(socket.id).emit("check-host")
            }
        })
    })
    socket.on("participant-list", (targetRoom: string) => { RoomList.forEach(room => room.id === targetRoom && io.to(room.id).emit("participant-list", room.participants)) }) //? Sends the updated participant list)
    socket.on("create-room", (room: RoomProps) => {
        const creationTime: string = TimeLog()
        room.entries.push({ //? Creates an attendance of the host
            id: room.host.id,
            name: room.host.name,
            time: creationTime
        })
        RoomList.push(room)
        socket.join(room.id) //? Join the room in socket
        io.local.emit("room-list", RoomList)
        RoomCleanup()
        SocketCleanup()
        ServerLog("server", `[ ROOM ][ ${room.id} ] new room has created.`, true)
    })
    socket.on("join-room", (roomID: string, userInfo: UserProps) => {
        RoomList.forEach(room => { //? VALIDATION (Make sure the username is not existed in the room)
            if (room.id === roomID) { //? Find the specific room
                if (room.participants.some(participant => participant.name === userInfo.name)) { //? If username existed
                    io.to(socket.id).emit("user-existed")
                } else { //? Join room if username is not existed
                    if (((userInfo.IPv4 === room.host.IPv4) && (userInfo.name === room.host.name))) { //? Incase host got reconnected (New ID)
                        console.log("Host ID renewed")
                        room.host.id = socket.id //? Update host ID
                    }
                    room.participants.push(userInfo) //? Adds user to the participants list
                    !room.entries.some(participant => participant.id === socket.id) && room.entries.push({ id: userInfo.id, name: userInfo.name, time: TimeLog() }) //? Adds the attendance of the participant (one time only)
                    io.to(socket.id).emit("join-room", roomID) //? Redirect the client to the room
                    io.to(roomID).emit("participant-list", room.participants) //? Sends the updated participant list
                    io.local.emit("room-list", RoomList) //? Sends the updated roomlist
                    socket.join(roomID) //? Join the room in socket
                }
            }
        })
        RoomCleanup()
        SocketCleanup()
    })
    socket.on("leave-room", (targetRoom: string) => {
        RoomList.forEach(room => {
            if (room.id === targetRoom) { //? Find the target room
                if (room.host.id === socket.id) { //? If host leave the meeting
                    socket.broadcast.to(targetRoom).emit("dissolve-meeting")
                    room.participants = []
                    ServerLog("server", `[ ROOM ][ ${room.id} ] new room has deleted.`, true)
                } else { //? If a participant leave the meeting
                    room.participants = room.participants.filter(participant => participant.id !== socket.id) //? Update the participant list
                    io.to(targetRoom).emit("participant-list", room.participants) //? Sends the updated participant list
                }
            }
        })
        socket.leave(targetRoom) //? Left the room in socket
        io.local.emit("room-list", RoomList) //? Sends the updated roomlist
        RoomCleanup()
        SocketCleanup()
    })

}