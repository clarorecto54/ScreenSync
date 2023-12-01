import Button from "@/components/atom/button";
import Textbox from "@/components/atom/textbox";
import { useGlobals } from "@/components/hooks/useGlobals";
import { useSession } from "@/components/hooks/useSession";
import classMerge from "@/components/utils/classMerge";
import { UserProps } from "@/types/session.types";
import { useState } from "react";

export default function Participants() {
    /* ----- STATES & HOOKS ----- */
    const { interactive, setinteractive } = useSession()
    /* -------- RENDERING ------- */
    return <div
        className="relative flex justify-center items-center">
        {interactive.includes("participants") && <Popup />}
        <Button //* PARTICIPANTS
            circle useIcon iconOverlay iconSrc={require("@/public/images/Participants.svg")}
            onClick={() => !interactive.includes("participants") ? setinteractive("participants") : setinteractive("")}
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
    </div>
}
function Popup() {
    /* ----- STATES & HOOKS ----- */
    const { userID } = useGlobals()
    const [search, setSearch] = useState<string>("")
    const [selected, setSelected] = useState<string>("")
    const [muted, setMuted] = useState<string[]>([])
    const testData: UserProps[] = [
        { id: "001", name: "Sheila Mae Carmen", IPv4: "192.168.2.49" },
        { id: "002", name: "Trisha Mariz Rodrin Tenorio", IPv4: "192.168.2.50" }
    ]
    /* -------- RENDERING ------- */
    return <div
        className={classMerge(
            "min-w-[24em] max-w-[24em] aspect-square p-[2em] py-[1.5em] rounded-[2em]", //? Size
            "absolute flex flex-col gap-[1em] -translate-y-[19em]", //? Display
            "backdrop-brightness-75", //? Background
        )}>
        <label //* HEADER
            className="text-[1.25em] font-[Montserrat] font-[600]">
            Audience
        </label>
        <Textbox //* SEARCH BAR
            circle value={search} maxLength={255}
            id="message" placeholder="Search someone here"
            useIcon iconOverlay iconSrc={require("@/public/images/Search.svg")}
            onChange={(thisElement) => setSearch(thisElement.target.value)}
            iconClass="bg-transparent"
            containerClass="focus-within:border-0 focus-within:bg-[#88888850] w-full"
            className={classMerge(
                "bg-[#88888850] text-white", //? Base
                "focus:bg-[#88888875]", //? Focus
            )} />
        <div //* LIST
            onScroll={() => setSelected("")}
            className={classMerge(
                "h-full overflow-y-scroll pr-[0.5em] px-[0.5em]", //? Base
                "flex flex-col gap-[0.5em]", //? Display
            )}>
            {!search && <div //* YOU TAB
                className={classMerge(
                    "w-full flex gap-[0.5em] justify-between items-center group", //? Base
                    "text-[1em] font-[Montserrat] font-[400] ", //? Font
                )}>
                Claro Recto ( You )
                <div //* OPTIONS CONTAINER
                    className="flex justify-center items-center">
                    {selected.includes(userID) && <div //* OPTIONS
                        className={classMerge(
                            "-translate-y-[7.5em]", //? Base
                            "absolute flex flex-col gap-[0.5em]", //? Display
                        )}>
                        <Button //* MUTE ALL
                            circle useIcon iconOverlay iconSrc={require("@/public/images/Mute.svg")}
                            onClick={() => {
                                if (muted.length === 0) { //? Mute All
                                    setMuted(testData.filter(mute => mute.id !== userID).map(target => target.id))
                                } else { //? Unmute All
                                    setMuted([])
                                }
                            }}
                            className={classMerge(
                                "bg-[#323232] text-[14px] drop-shadow-md", //? Base
                                "hover:scale-90", //? Hover
                                "transition-all duration-500", //? Animation
                            )}>
                            {muted.length === 0 ? "Mute All" : "Unmute All"}
                        </Button>
                        <Button //* ALERT ALL
                            circle useIcon iconSrc={require("@/public/images/Alert.svg")}
                            className={classMerge(
                                "bg-[#F9AE25] text-[14px] text-black drop-shadow-md", //? Base
                                "hover:scale-90", //? Hover
                                "transition-all duration-500", //? Animation
                            )}>
                            Alert All
                        </Button>
                        <Button //* KICK ALL
                            circle useIcon iconSrc={require("@/public/images/Kick.svg")}
                            className={classMerge(
                                "bg-[#E4280E] brightness-105 text-[14px] text-black drop-shadow-md", //? Base
                                "hover:scale-90", //? Hover
                                "transition-all duration-500", //? Animation
                            )}>
                            Kick All
                        </Button>
                    </div>}
                    <Button //* OPTIONS TRIGGER
                        circle iconOverlay useIcon iconSrc={require("@/public/images/3 Dots.svg")}
                        onClick={() => !selected.includes(userID) ? setSelected(userID) : setSelected("")}
                        containerClass={classMerge(
                            "text-[0.75em] opacity-0", //? Base
                            "group group-hover:opacity-100", //? Conditional
                            "transition-opacity duration-500", //? Animation
                        )} />
                </div>
            </div>}
            {testData && testData.map(({ id, name, IPv4 }, index) => {
                if (name.toUpperCase().includes(search.toUpperCase())) {
                    return <div //* PARTICIPANTS TAB
                        key={index}
                        className={classMerge(
                            "w-full flex gap-[0.5em] justify-between items-center group", //? Base
                            "text-[1em] font-[Montserrat] font-[400] ", //? Font
                        )}>
                        {name}
                        <div //* OPTIONS CONTAINER
                            className="flex justify-center items-center">
                            {selected.includes(id) && <div //* OPTIONS
                                className={classMerge(
                                    "-translate-y-[7.5em]", //? Base
                                    "absolute flex flex-col gap-[0.5em]", //? Display
                                )}>
                                <Button //* Mute
                                    circle useIcon iconOverlay iconSrc={require("@/public/images/Mute.svg")}
                                    onClick={() => {
                                        if (!muted.includes(id)) { //? Mute
                                            setMuted(prevValues => [...prevValues, id])
                                        } else { //? Unmute
                                            setMuted(muted.filter(muted => muted !== id))
                                        }
                                    }}
                                    className={classMerge(
                                        "bg-[#323232] text-[14px] drop-shadow-md", //? Base
                                        "hover:scale-90", //? Hover
                                        "transition-all duration-500", //? Animation
                                    )}>
                                    {!muted.includes(id) ? "Mute" : "Unmute"}
                                </Button>
                                <Button //* Alert
                                    circle useIcon iconSrc={require("@/public/images/Alert.svg")}
                                    className={classMerge(
                                        "bg-[#F9AE25] text-[14px] text-black drop-shadow-md", //? Base
                                        "hover:scale-90", //? Hover
                                        "transition-all duration-500", //? Animation
                                    )}>
                                    Alert
                                </Button>
                                <Button
                                    circle useIcon iconSrc={require("@/public/images/Kick.svg")}
                                    className={classMerge(
                                        "bg-[#E4280E] brightness-105 text-[14px] text-black drop-shadow-md", //? Base
                                        "hover:scale-90", //? Hover
                                        "transition-all duration-500", //? Animation
                                    )}>
                                    Kick
                                </Button>
                            </div>}
                            <Button //* OTPIONS TRIGGER
                                circle iconOverlay useIcon iconSrc={require("@/public/images/3 Dots.svg")}
                                onClick={() => !selected.includes(id) ? setSelected(id) : setSelected("")}
                                containerClass={classMerge(
                                    "text-[0.75em] opacity-0", //? Base
                                    "group group-hover:opacity-100", //? Conditional
                                    "transition-opacity duration-500", //? Animation
                                )} />
                        </div>
                    </div>
                }
            })}
        </div>
    </div>
}