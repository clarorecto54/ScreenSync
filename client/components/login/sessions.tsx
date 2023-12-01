import { RoomProps } from "@/types/session.types";
import Textbox from "../atom/textbox";
import classMerge from "../utils/classMerge";
import Image from "next/image";
import { useState } from "react";

export default function SessionList() {
    /* ----- STATES & HOOKS ----- */
    const [search, setSearch] = useState<string>("")
    const testData: RoomProps[] = [
        {
            id: "712144a9-2082-4c8a-a787-720114628e22",
            host: { id: "001", name: "Claro Recto", IPv4: "192.168.2.49" },
            key: "",
            chatlog: [],
            entries: [],
            participants: [{ id: "001", name: "Claro Recto", IPv4: "192.168.2.49" }],
            stream: { id: "", presenting: false }
        },
        {
            id: "712144a9-2082-4c8a-a787-720114628e22",
            host: { id: "001", name: "Claro Recto", IPv4: "192.168.2.49" },
            key: "",
            chatlog: [],
            entries: [],
            participants: [{ id: "001", name: "Claro Recto", IPv4: "192.168.2.49" }],
            stream: { id: "", presenting: false }
        },
        {
            id: "712144a9-2082-4c8a-a787-720114628e22",
            host: { id: "001", name: "Claro Recto", IPv4: "192.168.2.49" },
            key: "",
            chatlog: [],
            entries: [],
            participants: [{ id: "001", name: "Claro Recto", IPv4: "192.168.2.49" }],
            stream: { id: "", presenting: false }
        },
        {
            id: "38646235-1fca-4791-8f8c-25abfecd7fb2",
            host: { id: "004", name: "Sheila Mae Carmen", IPv4: "192.168.2.50" },
            key: "123",
            chatlog: [],
            entries: [],
            participants: [
                { id: "004", name: "Sheila Mae Carmen", IPv4: "192.168.2.50" },
                { id: "005", name: "Henry Hamilton", IPv4: "192.168.2.51" },
            ],
            stream: { id: "", presenting: false }
        },
    ]
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "min-w-[20em] max-w-min max-h-min p-[2em] rounded-[2em]", //? Size
            "bg-white panelStyle", //? Background
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
            {testData.length !== 0 && testData.map(({ id, host, participants, key }, index) => {
                /* ----- STATES & HOOKS ----- */
                const [keyinput, setKeyinput] = useState<string>("")
                const [showInput, setShowInput] = useState<boolean>(false)
                const [wrongKey, setWrongKey] = useState<boolean>(false)
                if (host.name.toUpperCase().includes(search.toUpperCase()) || id.toUpperCase().includes(search.toUpperCase())) {
                    /* -------- RENDERING ------- */
                    return <div //* SESSION INFO
                        key={index}
                        onClick={() => {
                            if (!key) { console.log("Entering the room") }
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
                            {key && <Image //* LOCKED ICON
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
                                if (key === keyinput) { console.log("Entering the room") }
                                else { setWrongKey(true) }
                            }}
                            className={classMerge(
                                "w-full", //? Base
                                "flex gap-[0.5em]", //? Display
                            )}>
                            {(key && showInput) && <Textbox //* INPUT
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
            })}
        </div>
    </div >
}