"use client"
import { SessionProps, UserProps } from "@/types/session.types"
import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { useGlobals } from "./useGlobals"
import { redirect, RedirectType } from "next/navigation"
/* -------- INTERFACE ------- */
const defaultValues: SessionProps = {
    host: false,
    streamAcces: false,
    mutestream: false,
    presenting: false,
    interactive: "",
    muted: [],
    /* -------------------------- */
    sethost: () => { },
    setstreamAcces: () => { },
    setmutestream: () => { },
    setpresenting: () => { },
    setinteractive: () => { },
    setmuted: () => { },
}
const context = createContext<SessionProps>(defaultValues)
/* ------ HOOK PROVIDER ----- */
export function useSession() { return useContext<SessionProps>(context) }
/* --------- CONTEXT -------- */
export function SessionContextProvider({ children }: { children: ReactNode }) {
    /* ----- STATES & HOOKS ----- */
    const {
        socket,
        meetingCode, setmeetingCode,
    } = useGlobals()
    const [host, sethost] = useState<boolean>(false)
    const [streamAcces, setstreamAcces] = useState<boolean>(false)
    const [mutestream, setmutestream] = useState<boolean>(false)
    const [presenting, setpresenting] = useState<boolean>(false)
    const [interactive, setinteractive] = useState<string>("")
    const [muted, setmuted] = useState<string[]>([])
    /* ---- SESSION VALIDATOR --- */
    useEffect(() => {
        !meetingCode && redirect("/", RedirectType.replace)
    }, [meetingCode])
    /* ----- SOCKET HANDLER ----- */
    useEffect(() => {
        //* EMIT (REQ)
        socket?.emit("check-host", meetingCode)
        //* ON (RES)
        socket?.on("dissolve-meeting", () => {
            socket.emit("leave-room", meetingCode)
            setmeetingCode("")
        })
        socket?.on("check-host", () => sethost(true))
        return () => {
            socket?.off("dissolve-meeting", () => {
                socket.emit("leave-room", meetingCode)
                setmeetingCode("")
            })
            socket?.off("check-host", () => sethost(true))
        }
    }, [])
    /* -------- PROVIDER -------- */
    const defaultValues: SessionProps = {
        host,
        streamAcces,
        mutestream,
        presenting,
        interactive,
        muted,
        /* -------------------------- */
        sethost,
        setstreamAcces,
        setmutestream,
        setpresenting,
        setinteractive,
        setmuted,
    }
    return <context.Provider value={defaultValues}>{children}</context.Provider>
}