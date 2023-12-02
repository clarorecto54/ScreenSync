import Button from "../atom/button"
import { useGlobals } from "../hooks/useGlobals"
import { useSession } from "../hooks/useSession"
import classMerge from "../utils/classMerge"
import Reaction from "./dock/reaction"
import Chat from "./interactive/chat"
import Participants from "./interactive/participants"

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
        host,
        presenting, setpresenting,
        mutestream, setmutestream,
    } = useSession()
    const {
        socket, setname,
        meetingCode, setmeetingCode,
    } = useGlobals()
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className="flex gap-[16px] justify-center items-center">
        <Reaction />
        <Button //* FULLSCREEN
            circle useIcon iconOverlay iconSrc={require("@/public/images/Fullscreen.svg")}
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
        <Button //* MUTE
            circle useIcon iconSrc={mutestream ? require("@/public/images/Audio (1).svg") : require("@/public/images/Audio (2).svg")}
            iconOverlay customOverlay={mutestream ? "redOverlay" : undefined}
            onClick={() => setmutestream(!mutestream)}
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
        <Button //* SHARE SCREEN
            circle useIcon iconSrc={presenting ? require("@/public/images/Share Screen (1).svg") : require("@/public/images/Share Screen (2).svg")}
            iconOverlay customOverlay={presenting ? "redOverlay" : undefined}
            onClick={() => setpresenting(!presenting)}
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
        <Button //* END CALL
            circle useIcon iconOverlay iconSrc={require("@/public/images/End Call.svg")}
            onClick={() => {
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