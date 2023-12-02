import { useEffect, useState } from "react";
import classMerge from "../utils/classMerge";
import { useGlobals } from "../hooks/useGlobals";
/* ----- MEETING HEADER ----- */
export default function Header() {
    /* ----- STATES & HOOKS ----- */
    const { socket, peer, userID, IPv4 } = useGlobals()
    const [serverTime, setServerTime] = useState<string>("")
    const [ping, setPing] = useState<number>(0)
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        if (socket) {
            setInterval(() => {
                const start = Date.now();
                socket.emit("ping", () => {
                    const duration = Date.now() - start
                    setPing(duration)
                })
            }, 500)
            socket.on("get-server-time", (time: string) => setServerTime(time))
        }
        return () => {
            if (socket) {
                socket.off("get-server-time", (time: string) => setServerTime(time))
            }
        }
    }, [])
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "w-full", //? Sizing
            "grid grid-cols-3", //? Display
            "Unselectable", //? Custom Class
        )}>
        <label //* TIME
            className="font-[400] text-start">
            {serverTime}
        </label>
        <label //* APP TITLE
            className="font-[600] flex gap-[0.75em] justify-center items-center text-center">
            ScreenSync
            <div className="flex gap-[0.25em] justify-center items-center">
                <div className={classMerge(
                    "h-[0.75em] aspect-square rounded-full", //? Size
                    userID ? "bg-green-600" : "bg-red-600", //? Background
                )} />
                <span className="font-[400] text-[0.75em]">{userID ? (ping < 1 ? 1 : ping) : 999}ms</span>
            </div>
        </label>
        <label //* VERSION
            className="font-[400] text-end">
            {(userID && socket && peer) ? `${IPv4}:3000` : "Disconnected"}
        </label>
    </div>
}