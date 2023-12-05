"use client"
import { SessionProps, UserProps } from "@/types/session.types"
import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { useGlobals } from "./useGlobals"
import { redirect, RedirectType } from "next/navigation"
import { MediaConnection } from "peerjs"
import { transformSDP } from "../utils/sdp.transform"
/* -------- INTERFACE ------- */
const defaultValues: SessionProps = {
    host: false,
    streamAccess: false,
    mutestream: false,
    presenting: false,
    interactive: "",
    muted: [],
    calls: [],
    stream: null,
    participantList: [],
    fullscreen: false,
    /* -------------------------- */
    sethost: () => { },
    setstreamAcces: () => { },
    setmutestream: () => { },
    setpresenting: () => { },
    setinteractive: () => { },
    setmuted: () => { },
    setcalls: () => { },
    setstream: () => { },
    setParticipantList: () => { },
    setfullscreen: () => { },
}
const context = createContext<SessionProps>(defaultValues)
/* ------ HOOK PROVIDER ----- */
export function useSession() { return useContext<SessionProps>(context) }
/* --------- CONTEXT -------- */
export function SessionContextProvider({ children }: { children: ReactNode }) {
    /* ----- STATES & HOOKS ----- */
    const {
        socket, peer,
        meetingCode, setmeetingCode,
    } = useGlobals()
    const [host, sethost] = useState<boolean>(false)
    const [streamAccess, setstreamAcces] = useState<boolean>(false)
    const [mutestream, setmutestream] = useState<boolean>(false)
    const [presenting, setpresenting] = useState<boolean>(false)
    const [interactive, setinteractive] = useState<string>("")
    const [muted, setmuted] = useState<string[]>([])
    const [calls, setcalls] = useState<MediaConnection[]>([])
    const [streamcall, setstreamcall] = useState<MediaConnection | null>(null)
    const [stream, setstream] = useState<MediaStream | null>(null)
    const [participantList, setParticipantList] = useState<UserProps[]>([])
    const [fullscreen, setfullscreen] = useState<boolean>(false)
    /* ---- SESSION VALIDATOR --- */
    useEffect(() => {
        !meetingCode && redirect("/", RedirectType.replace)
    }, [meetingCode])
    /* ----- SOCKET HANDLER ----- */
    useEffect(() => {
        //* EMIT (REQ)
        socket?.emit("check-host", meetingCode)
        socket?.emit("participant-list", meetingCode)
        //* ON (RES)
        socket?.on("participant-list", (participantList: UserProps[]) => setParticipantList(participantList))
        socket?.on("dissolve-meeting", () => {
            socket.emit("leave-room", meetingCode)
            setmeetingCode("")
        })
        socket?.on("check-host", () => sethost(true))
        //* PEER ON (RES)
        peer?.on("call", call => {
            const peercon = call.peerConnection
            if (peercon) {
                const config = peercon.getConfiguration()
                if (config) {
                    config.bundlePolicy = "max-compat"
                    config.iceCandidatePoolSize = 32
                }
            }
            call.answer(undefined, { sdpTransform: transformSDP })
            call.on("stream", (mainStream) => setstream(mainStream))
            call.on("close", () => {
                call.close()
                if (stream) { for (const track of stream.getTracks()) { track.stop() } }
                setstream(null)
                setpresenting(false)
                setstreamAcces(false)
                setstreamcall(null)
            })
            setstreamcall(call)
        })
        return () => {
            //* SOCKET CLEANUP
            socket?.off("participant-list", (participantList: UserProps[]) => setParticipantList(participantList))
            socket?.off("dissolve-meeting", () => {
                socket.emit("leave-room", meetingCode)
                setmeetingCode("")
            })
            socket?.off("check-host", () => sethost(true))
            //* PEER ON (RES)
            peer?.off("call", call => {
                const peercon = call.peerConnection
                if (peercon) {
                    const config = peercon.getConfiguration()
                    if (config) {
                        config.bundlePolicy = "max-compat"
                        config.iceCandidatePoolSize = 32
                    }
                }
                call.answer(undefined, { sdpTransform: transformSDP })
                call.on("stream", (mainStream) => setstream(mainStream))
                call.on("close", () => {
                    call.close()
                    if (stream) { for (const track of stream.getTracks()) { track.stop() } }
                    setstream(null)
                    setpresenting(false)
                    setstreamAcces(false)
                    setstreamcall(null)
                })
                setstreamcall(call)
            })
        }
    }, [])
    /* -------- PROVIDER -------- */
    const defaultValues: SessionProps = {
        host,
        streamAccess,
        mutestream,
        presenting,
        interactive,
        muted,
        calls,
        stream,
        participantList,
        fullscreen,
        /* -------------------------- */
        sethost,
        setstreamAcces,
        setmutestream,
        setpresenting,
        setinteractive,
        setmuted,
        setcalls,
        setstream,
        setParticipantList,
        setfullscreen,
    }
    return <context.Provider value={defaultValues}>{children}</context.Provider>
}