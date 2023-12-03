import Button from "../atom/button"
import { useState, useEffect } from "react"
import { useGlobals } from "../hooks/useGlobals"
import { useSession } from "../hooks/useSession"
import classMerge from "../utils/classMerge"
import Reaction from "./dock/reaction"
import Chat from "./interactive/chat"
import Participants from "./interactive/participants"
import { UserProps } from "@/types/session.types"
import { transformSDP } from "../utils/sdp.transform"

export default function AppDock() {
    /* ----- STATES & HOOKS ----- */
    const { meetingCode } = useGlobals()
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "w-full p-[16px]", //? Sizing
            "flex items-center justify-evenly Unselectable", //? Display
        )}>
        <Button //* COPY MEETING
            useIcon iconSrc={require("@/public/images/Copy.svg")} iconOverlay
            onClick={() => navigator.clipboard.writeText(meetingCode)}
            className={classMerge(
                "bg-transparent", //? Background
                "hover:bg-[#525252]", //? Hover
                "transition-all duration-200", //? Animation
            )}>Meeting Code</Button>
        <Dock />
        <Interactive />
    </div>
}
function Dock() {
    /* ----- STATES & HOOKS ----- */
    const {
        host, participantList, setfullscreen,
        stream, setstream,
        calls, setcalls,
        streamAccess, setstreamAcces,
        presenting, setpresenting,
        mutestream, setmutestream,
    } = useSession()
    const {
        socket, peer, myInfo, setsystemPopup,
        meetingCode, setmeetingCode,
    } = useGlobals()
    const [requestCooldown, setRequestCooldown] = useState<boolean>(false)
    const [noRequest, setNoRequest] = useState<boolean>(false)
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        socket?.on("get-stream", (targetID: string) => {
            if (peer && stream) {
                const makeCall = peer.call(targetID, stream, { sdpTransform: transformSDP })
                setcalls(prev => [...prev, makeCall])
            }
        })
        socket?.on("streaming", () => {
            if (!host) {
                setstreamAcces(false)
                setNoRequest(true)
                setpresenting(true)
            }
        })
        socket?.on("avail-req", () => {
            if (!host || streamAccess) {
                setNoRequest(false)
                setstreamAcces(false)
            }
            setpresenting(false)
        })
        socket?.on("grant-access", (permittedID: string) => {
            if (permittedID === myInfo.id) {
                setRequestCooldown(false)
                setstreamAcces(true)
            } else { !host && setNoRequest(true) }
        })
        socket?.on("req-stream", (client: UserProps) => {
            if (host) {
                setRequestCooldown(false)
                setsystemPopup({
                    type: "INFO",
                    message: `Allow ${client.name} to have streaming access?`,
                    icon: require("@/public/images/Share Screen (2).svg"),
                    action() {
                        socket.emit("grant-access", meetingCode, client.id)
                    }
                })
            } else { setRequestCooldown(true) }
        })
        return () => {
            socket?.off("get-stream", (targetID: string) => {
                if (peer && stream) {
                    const makeCall = peer.call(targetID, stream, { sdpTransform: transformSDP })
                    setcalls(prev => [...prev, makeCall])
                }
            })
            socket?.off("streaming", () => {
                if (!host) {
                    setstreamAcces(false)
                    setNoRequest(true)
                    setpresenting(true)
                }
            })
            socket?.off("avail-req", () => {
                if (!host || streamAccess) {
                    setNoRequest(false)
                    setstreamAcces(false)
                }
                setpresenting(false)
            })
            socket?.off("grant-access", (permittedID: string) => {
                if (permittedID === myInfo.id) {
                    setRequestCooldown(false)
                    setstreamAcces(true)
                } else { !host && setNoRequest(true) }
            })
            socket?.off("req-stream", (client: UserProps) => {
                if (host) {
                    setRequestCooldown(false)
                    setsystemPopup({
                        type: "INFO",
                        message: `Allow ${client.name} to have streaming access?`,
                        icon: require("@/public/images/Share Screen (2).svg"),
                        action() {
                            socket.emit("grant-access", meetingCode, client.id)
                        }
                    })
                } else { setRequestCooldown(true) }
            })
        }
    }, [host, peer, stream])
    useEffect(() => {
        requestCooldown && setTimeout(() => {
            setRequestCooldown(false)
        }, 5000)
    }, [requestCooldown])
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className="flex gap-[16px] justify-center items-center">
        <Reaction />
        {presenting && <Button //* FULLSCREEN
            circle useIcon iconOverlay iconSrc={require("@/public/images/Fullscreen.svg")}
            onClick={() => setfullscreen(true)}
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />}
        {(presenting && (!host && !streamAccess)) && <Button //* MUTE
            circle useIcon iconSrc={mutestream ? require("@/public/images/Audio (1).svg") : require("@/public/images/Audio (2).svg")}
            iconOverlay customOverlay={mutestream ? "redOverlay" : undefined}
            onClick={() => setmutestream(!mutestream)}
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />}
        {(!presenting && !requestCooldown && !noRequest && (host || streamAccess || !streamAccess)) && < Button //* SHARE SCREEN
            circle useIcon iconSrc={require("@/public/images/Share Screen (2).svg")}
            iconOverlay customOverlay={(presenting || (!streamAccess && !host)) ? "redOverlay" : undefined}
            onClick={async () => {
                if (streamAccess || host) {
                    if (socket && peer && navigator.mediaDevices.getDisplayMedia) {
                        //* GET DISPLAY
                        const mainStream = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true })
                            .then(async (originalStream) => {
                                //* TRACK MODIFICATION
                                for (const track of originalStream.getTracks()) {
                                    //* QUALITY MODIFICATION
                                    await track.applyConstraints({
                                        displaySurface: { exact: "window" },
                                        frameRate: { exact: 60 },
                                        channelCount: { exact: 1 },
                                        echoCancellation: { exact: false },
                                        noiseSuppression: { exact: false },
                                        sampleRate: { min: 44100, max: 88200, ideal: 88200 },
                                        sampleSize: { min: 16, max: 24, ideal: 24 }
                                    }).then(() => { return }).catch(err => err)
                                    // .catch(err => console.log("Kind ", track.kind, ": ", err))
                                    //* ADD EVENT LISTENER
                                    await track.addEventListener("ended", function onEnded() {
                                        ((host || streamAccess) && (socket?.emit("stop-stream", meetingCode)))
                                        setpresenting(false)
                                        setstreamAcces(false)
                                        setNoRequest(false)
                                        track.removeEventListener("ended", onEnded)
                                    })
                                }
                                return originalStream
                            })
                        setstream(mainStream)
                        participantList.forEach(client => {
                            if (client.id !== myInfo.id) {
                                const makeCall = peer.call(client.id, mainStream, { sdpTransform: transformSDP })
                                setcalls(prev => [...prev, makeCall])
                            }
                        })
                    }
                    socket?.emit("start-stream", meetingCode, myInfo)
                    setpresenting(true)
                    setmutestream(true)
                } else {
                    socket?.emit("req-stream", meetingCode, myInfo)
                    setRequestCooldown(true)
                }
            }}
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />}
        {(presenting && (host || streamAccess)) && < Button //* STOP SHARE SCREEN
            circle useIcon iconSrc={require("@/public/images/Share Screen (1).svg")}
            iconOverlay customOverlay={(presenting || (!streamAccess && !host)) ? "redOverlay" : undefined}
            onClick={() => {
                if (host || streamAccess) {
                    calls.forEach(call => call.close())
                    setcalls([])
                }
                if (stream) { for (const track of stream.getTracks()) { track.stop() } }
                socket?.emit("stop-stream", meetingCode)
                setstream(null)
                setpresenting(false)
                setstreamAcces(false)
                setNoRequest(false)
            }}
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />}
        <Button //* END CALL
            circle useIcon iconOverlay iconSrc={require("@/public/images/End Call.svg")}
            onClick={() => {
                if (stream) {
                    if (host || streamAccess) {
                        calls.forEach(call => call.close())
                        setcalls([])
                    }
                    if (stream) { for (const track of stream.getTracks()) { track.stop() } }
                    (host || streamAccess) && socket?.emit("stop-stream", meetingCode)
                    setstream(null)
                    setpresenting(false)
                    setstreamAcces(false)
                    setNoRequest(false)
                }
                socket?.emit("leave-room", meetingCode)
                setmeetingCode("")
            }}
            containerClass="w-[6em]"
            className={classMerge(
                "bg-[#DF2020]", //? Background
                "hover:bg-[#B21A1A]", //? Hover
            )} />
    </div>
}
function Interactive() {
    return <div //* CONTAINER
        className="flex gap-[16px] justify-center items-center">
        <Chat />
        <Participants />
    </div>
}