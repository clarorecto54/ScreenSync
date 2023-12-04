import { Socket } from "socket.io";

export default function InteractiveSystem(socket: Socket) {
    socket.on("alert", (targetID: string) => socket.to(targetID).emit("alert"))
    socket.on("kick", (targetID: string) => socket.to(targetID).emit("dissolve-meeting"))
    socket.on("alert-all", (targetRoom: string) => socket.broadcast.to(targetRoom).emit("alert"))
    socket.on("kick-all", (targetRoom: string) => socket.broadcast.to(targetRoom).emit("dissolve-meeting"))
}