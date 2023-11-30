"use client"
import { GlobalProps } from "@/types/globals.types";
import Peer from "peerjs";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
/* -------- INTERFACE ------- */
const defaultValues: GlobalProps = {
    socket: null,
    peer: null,
    userID: "",
    IPv4: "",
    name: "",
    meetingCode: "",
    systemPopup: "",
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
    const [socket, setsocket] = useState<Socket | null>(null)
    const [peer, setpeer] = useState<Peer | null>(null)
    const [userID, setuserID] = useState<string>("")
    const [name, setname] = useState<string>("")
    const [meetingCode, setmeetingCode] = useState<string>("")
    const [systemPopup, setsystemPopup] = useState<string>("")
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        !IPv4 ? fetch("/api/getIP", { cache: "no-store" })
            .then(res => res.text())
            .then(IP => {
                setIPv4(IP)
            }) : setsocket(io(`https://${IPv4}:3001`))
    }, [IPv4])
    useEffect(() => {
        if (socket) {
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
                socket.off("connect", () => {
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
                socket.off("disconnect", () => setuserID(""))
            }
        }
    }, [socket])
    /* -------- PROVIDER -------- */
    const defaultValues: GlobalProps = {
        socket, setsocket,
        peer, setpeer,
        userID, setuserID,
        IPv4, setIPv4,
        name, setname,
        meetingCode, setmeetingCode,
        systemPopup, setsystemPopup,
    }
    return <context.Provider value={defaultValues}>
        {children}
    </context.Provider>
}