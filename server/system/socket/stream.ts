import { Socket } from "socket.io";
import { RoomList } from "../cleanups";
import { UserProps } from "./socket.types";

export default function StreamSystem(socket: Socket) {
    socket.on("start-stream", (targetRoom: string, streamer: UserProps) => {
        socket.broadcast.to(targetRoom).emit("streaming")
    })
    socket.on("stop-stream", (targetRoom: string) => {
        socket.broadcast.to(targetRoom).emit("avail-req")
    })
    socket.on("req-stream", (targetRoom: string, client: UserProps) => {
        socket.broadcast.to(targetRoom).emit("req-stream", client)
    })
    socket.on("grant-access", (targetRoom: string, targetID: string) => {
        socket.broadcast.to(targetRoom).emit("grant-access", targetID)
    })
}