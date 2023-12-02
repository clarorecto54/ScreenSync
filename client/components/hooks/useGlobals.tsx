"use client"
import { GlobalProps } from "@/types/globals.types";
import { RoomProps } from "@/types/session.types";
import { SystemPopupProps } from "@/types/system.popup.types";
import { RedirectType, redirect } from "next/navigation";
import Peer from "peerjs";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
/* -------- INTERFACE ------- */
const defaultValues: GlobalProps = {
    socket: null,
    peer: null,
    userID: "",
    IPv4: "",
    myIPv4: "",
    name: "",
    meetingCode: "",
    systemPopup: null,
    roomList: [],
    /* -------------------------- */
    setsocket: () => { },
    setpeer: () => { },
    setuserID: () => { },
    setIPv4: () => { },
    setname: () => { },
    setmeetingCode: () => { },
    setsystemPopup: () => { },
}
const context = createContext<GlobalProps>(defaultValues)
/* ------ HOOK PROVIDER ----- */
export function useGlobals() { return useContext<GlobalProps>(context) }
/* --------- CONTEXT -------- */
export function GlobalContextProvider({ children }: { children: ReactNode }) {
    /* ----- STATES & HOOKS ----- */
    const [IPv4, setIPv4] = useState<string>("")
    const [myIPv4, setmyIPv4] = useState<string>("")
    const [socket, setsocket] = useState<Socket | null>(null)
    const [peer, setpeer] = useState<Peer | null>(null)
    const [userID, setuserID] = useState<string>("")
    const [name, setname] = useState<string>("")
    const [meetingCode, setmeetingCode] = useState<string>("")
    const [systemPopup, setsystemPopup] = useState<SystemPopupProps | null>(null)
    const [roomList, setRoomList] = useState<RoomProps[]>([])
    /* ------- IP HANDLER ------- */
    useEffect(() => {
        if (!IPv4) {
            fetch("/api/getIP", { cache: "no-store" })
                .then(res => res.text())
                .then(IP => {
                    setIPv4(IP)
                })
        } else {
            setsocket(io(`https://${IPv4}:3001`, {
                transports: ["websocket", "polling"]
            }))
        }
    }, [IPv4])

    /* ----- SOCKET HANDLER ----- */
    useEffect(() => {
        if (socket) {
            //* EMIT (REQ)
            socket.emit("my-ipv4")
            //* ON (RES)
            socket.on("user-existed", () => setsystemPopup({
                type: "ERROR", icon: require("@/public/images/Participants.svg"),
                message: "Username is already existing on the room. Please change your username."
            }))
            socket.on("join-room", (targetRoom: string) => {
                setmeetingCode(targetRoom)
            })
            socket.on("room-list", (rooms: RoomProps[]) => setRoomList(rooms))
            socket.on("my-ipv4", (myIPv4: string) => setmyIPv4(myIPv4))
            socket.on("connect", () => {
                if (typeof window !== "undefined") {
                    setuserID(socket.id)
                    setpeer(new Peer(socket.id, {
                        host: IPv4,
                        port: 3002,
                        path: "/",
                        secure: true,
                        pingInterval: 1000,
                        config: {
                            'iceServers': [
                                { url: "stun:192.168.2.49:3003" },
                                { url: "stun:192.168.2.49:3004" },
                                { url: "stun:192.168.2.49:3005" }
                            ]
                        }
                    }))
                }
            })
            socket.on("disconnect", () => setuserID(""))
        }
        return () => {
            if (socket) {
                socket.off("user-existed", () => setsystemPopup({
                    type: "ERROR", icon: require("@/public/images/Participants.svg"),
                    message: "Username is already existing on the room. Please change your username."
                }))
                socket.off("join-room", (targetRoom: string) => {
                    setmeetingCode(targetRoom)
                })
                socket.off("room-list", (rooms: RoomProps[]) => setRoomList(rooms))
                socket.off("my-ipv4", (myIPv4: string) => setmyIPv4(myIPv4))
                socket.off("connect", () => {
                    if (typeof window !== "undefined") {
                        setuserID(socket.id)
                        setpeer(new Peer(socket.id, {
                            host: IPv4,
                            port: 3002,
                            path: "/",
                            secure: true,
                            pingInterval: 40,
                            config: {
                                'iceServers': [
                                    { url: "stun:192.168.2.49:3003" },
                                    { url: "stun:192.168.2.49:3004" },
                                    { url: "stun:192.168.2.49:3005" }
                                ]
                            }
                        }))
                    }
                })
                socket.off("disconnect", () => setuserID(""))
            }
        }
    }, [socket])
    /* -------- PROVIDER -------- */
    const defaultValues: GlobalProps = {
        socket, setsocket,
        peer, setpeer,
        userID, setuserID,
        IPv4, setIPv4, myIPv4,
        name, setname,
        meetingCode, setmeetingCode,
        systemPopup, setsystemPopup,
        roomList,
    }
    return <context.Provider value={defaultValues}>
        {children}
    </context.Provider>
}