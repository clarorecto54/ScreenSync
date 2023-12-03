import { UserProps } from "@/types/session.types";
import Textbox from "../atom/textbox";
import classMerge from "../utils/classMerge";
import Image from "next/image";
import { useState } from "react";
import { useGlobals } from "../hooks/useGlobals";

export default function SessionList() {
    /* ----- STATES & HOOKS ----- */
    const { roomList } = useGlobals()
    const [search, setSearch] = useState<string>("")
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "min-w-[20em] max-w-min max-h-min p-[2em] rounded-[2em]", //? Size
            "bg-white panelStyle shadow-lg drop-shadow-lg backdrop-blur-md", //? Background
            "flex gap-[0.75em] flex-col items-center", //? Display
            "font-[Montserrat] font-[600] leading-5 Unselectable", //? Font
        )}>
        On-going Sessions
        <Textbox //* SEARCH BAR
            id="search" placeholder="Search for room here"
            value={search} onChange={(thisElement) => setSearch(thisElement.target.value)}
            useIcon iconSrc={require("@/public/images/Search.svg")}
            containerClass="text-[12px] w-full" />
        <div //* SESSION LIST
            className={classMerge(
                "h-full w-full max-h-[16em] p-[0.5em] pr-[0.5em] scroll-smooth ", //? Base
                "flex flex-col gap-[0.75em] overflow-y-scroll", //? Display
            )}>
            {roomList.map(({ id, host, participants, key }, index) => {
                if (host.name.toUpperCase().includes(search.toUpperCase()) || id.toUpperCase().includes(search.toUpperCase())) {
                    return <SessionInfo
                        key={index}
                        id={id}
                        host={host}
                        participants={participants}
                        meetingKey={key}
                    />
                }
            })}
        </div>
    </div >
}

function SessionInfo({ id, host, participants, meetingKey }: { id: string, host: UserProps, participants: UserProps[], meetingKey: string }) {
    /* ----- STATES & HOOKS ----- */
    const { socket, myInfo } = useGlobals()
    const [keyinput, setKeyinput] = useState<string>("")
    const [showInput, setShowInput] = useState<boolean>(false)
    const [wrongKey, setWrongKey] = useState<boolean>(false)
    /* -------- RENDERING ------- */
    return <div //* SESSION INFO
        onClick={() => {
            if (!meetingKey) { //? Join meeting
                socket?.emit("join-room", id, myInfo)
            }
            else { setShowInput(true) }
        }}
        className={classMerge(
            "p-[0.5em] rounded-[0.5em] leading-5", //? Base
            "hover:cursor-pointer hover:backdrop-brightness-95 hover:shadow-lg hover:scale-105", //? Hover
            "flex flex-col", //? Display
            "transition-all duration-500", //? Animation
        )}>
        <label //* HEADER
            className={classMerge(
                "flex p-[0.25em] px-[0.75em] rounded-full gap-[0.5em] items-center w-max hover:cursor-pointer", //? Base
                "bg-[#A14E2D]", //? Background
                "text-[0.8em] text-white font-[600]", //? Font
            )}>
            {host.name}
            {meetingKey && <Image //* LOCKED ICON
                className="h-[0.75em] w-[0.75em] aspect-square hover:cursor-pointer whiteOverlay"
                src={require("@/public/images/Lock.svg")}
                alt=""
                sizes="100vw"
            />}
        </label>
        <label className="pl-[0.25em] text-[0.8em] italic hover:cursor-pointer">{participants.length} participants</label>
        <label className="pl-[0.25em] w-full text-start text-[0.6em] font-[500] italic hover:cursor-pointer">{id}</label>
        <form //* KEY INPUT
            onSubmit={(thisElement) => {
                thisElement.preventDefault()
                if (meetingKey === keyinput) { //? Join Room
                    socket?.emit("join-room", id, myInfo)
                }
                else { setWrongKey(true) }
            }}
            className={classMerge(
                "w-full", //? Base
                "flex gap-[0.5em]", //? Display
            )}>
            {(meetingKey && showInput) && <Textbox //* INPUT
                autoFocus autoComplete="password" type="password" value={keyinput}
                onChange={(thisElement) => setKeyinput(thisElement.target.value)}
                onBlur={() => setShowInput(false)}
                id="keyInput" placeholder="Input the key here"
                useIcon iconSrc={require("@/public/images/Key.svg")}
                containerClass={classMerge(
                    "w-full text-[12px]", //? Base
                    wrongKey && "focus-within:border-[1px] focus-within:border-red-600"
                )} />}
        </form>
    </div>
}