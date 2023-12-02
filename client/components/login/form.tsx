"use client"
import { useGlobals } from "../hooks/useGlobals";
import { useEffect, useState } from "react"
import classMerge from "../utils/classMerge";
import Textbox from "../atom/textbox";
import Button from "../atom/button";
import AnimatedLogo from "../animated.logo";
import { RoomProps } from "@/types/session.types";
import { v4 } from "uuid"
import { redirect, RedirectType } from "next/navigation";
export default function LoginForm() {
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "p-[2em] px-[3em]", //? Sizing
            "bg-white rounded-[2em] panelStyle shadow-lg drop-shadow-lg", //? Background
            "flex flex-col justify-center items-center gap-[1em]", //? Display
        )}>
        <Logo />
        <Description />
        <Input />
    </div>
}
function Logo() {
    /* ----- STATES & HOOKS ----- */
    const { userID } = useGlobals()
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "flex gap-[0.5em] justify-center items-center", //? Display
        )}>
        <AnimatedLogo size={4} />
        <div //* DESCRIPTION
            className="font-[Montserrat] font-[600] leading-5 Unselectable">
            ScreenSync <br />
            <span className={classMerge(
                "rounded-full", //? Size
                userID ? "bg-green-600" : "bg-red-600", //? Background
                "flex justify-center items-center", //? Display
                "font-[500] font-[Gotham] text-[0.75em] text-white italic", //? Text Styling
            )}>
                {userID ? "Connected" : "Disconnected"}
            </span>
        </div>
    </div>
}
function Description() {
    return <div //* DESCRIPTION
        className="w-full flex flex-col gap-[0.5em] max-w-min text-[1em] Unselectable">
        <label //* HEADER 1
            className="font-[500] font-[Montserrat] text-[1em] min-w-max">
            TUPC Screen Mirroring Solution
        </label>
        <label //* DESCRIPTION
            className="font-[400] font-[Montserrat] text-[0.75em]">
            Enjoy the power of visual communication and take your educational experience to the next level
        </label>
    </div>
}
function Input() {
    /* ----- STATES & HOOKS ----- */
    const {
        socket, userID, myIPv4,
        name, setname,
        meetingCode, setmeetingCode,
    } = useGlobals()
    const [key, setKey] = useState<string>("")
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        meetingCode && redirect(`/${meetingCode}`, RedirectType.replace)
    }, [meetingCode])
    /* -------- RENDERING ------- */
    return <form //* INPUTS CONTAINER
        onSubmit={(thisElement) => { //? Start meeting
            thisElement.preventDefault()
            if (name.length > 3) {
                const room: RoomProps = {
                    id: v4(),
                    key: key,
                    host: { id: userID, IPv4: myIPv4, name: name },
                    participants: [{ id: userID, IPv4: myIPv4, name: name }],
                    stream: { hostID: userID, id: "", presenting: false },
                    entries: [],
                    chatlog: []
                }
                socket?.emit("create-room", room)
                setmeetingCode(room.id)
            }
        }}
        className={
            classMerge(
                "flex flex-col gap-[1em] justify-center items-center", //? Display
            )
        } >
        <div //* INPUT CONTAINER
            className="flex flex-col gap-[0.5em]">
            <Textbox //* NAME
                maxLength={32} containerClass="text-[12px]"
                value={name} onChange={(thisElement) => setname(thisElement.target.value)}
                id="name" useIcon iconSrc={require("@/public/images/Participants.svg")}
                placeholder="What is your name?" />
            {name.length > 3 && <Textbox //* KEY
                maxLength={32} containerClass="text-[12px]"
                value={key} onChange={(thisElement) => setKey(thisElement.target.value)}
                id="key" useIcon iconSrc={require("@/public/images/Key.svg")}
                placeholder="Key is optional" />}
        </div>
        {
            name.length > 3 && <Button //* START MEETING BUTTON
                type="submit"
                useIcon iconOverlay iconSrc={require("@/public/images/Join.svg")}
                className={classMerge(
                    "bg-red-500 hover:bg-red-700 hover:scale-90 text-[12px]", //? Base
                    "transition-all duration-300", //? Animation
                )}>
                Start Meeting
            </Button>
        }
    </form >
}