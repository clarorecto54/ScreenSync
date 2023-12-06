import { useEffect, useRef } from "react";
import AnimatedLogo from "../animated.logo";
import { useSession } from "../hooks/useSession";
import classMerge from "../utils/classMerge";
import Button from "../atom/button";
import { useGlobals } from "../hooks/useGlobals";

export default function MainDisplay() {
    /* ----- STATES & HOOKS ----- */
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "h-full w-full", //? Sizing
            "rounded-3xl overflow-hidden", //? Border
            "flex relative", //? Display
        )}>
        <DefaultDisplay />
        <StreamDisplay />
    </div>
}
function DefaultDisplay() {
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "h-full w-full", //? Sizing
            "bg-[#525252]", //? Background presenting ? "bg-[#]" : 
            "flex flex-col gap-[32px] justify-center items-center Unselectable", //? Display
            "transition-[background-color] duration-500", //? Animation
        )}>
        <AnimatedLogo size={16} />
        <label //* SCHOOL NAME
            className="text-center font-[500] text-[20px] font-[Montserrat] leading-[40px]">
            Technological University of the Philippines <br />
            Cavite Campus
        </label>
    </div>
}
function StreamDisplay() {
    /* ----- STATES & HOOKS ----- */
    const streamRef = useRef<HTMLVideoElement>(null)
    const { socket, meetingCode } = useGlobals()
    const {
        host, mutestream,
        stream, setstream,
        presenting, setpresenting,
        calls, setcalls,
        streamAccess, setstreamAcces,
        fullscreen, setfullscreen,
    } = useSession()
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        const target = streamRef.current
        if (target) {
            if (stream) { target.srcObject = stream }
            else { target.srcObject = null }
            if (fullscreen) {
                target.requestFullscreen({ navigationUI: "hide" }).then(() => {
                    setfullscreen(false)
                    return
                })
            }
        }
    }, [stream, fullscreen])
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "h-full w-full", //? Sizing
            "bg-[#161616]", //? Background
            "absolute flex flex-col gap-[32px] justify-center items-center Unselectable", //? Display
            !presenting && "opacity-0",//? Conditional
            "transition-[opacity] duration-1000", //? Animation
        )}>
        {!stream && <div className="h-full w-full font-[600] font-[Montserrat] flex justify-center items-center">No Stream</div>}
        {(stream && calls.length !== 0) && <div className={classMerge(
            "h-full w-full", //? Sizing
            "flex flex-col gap-[1em] justify-center items-center", //? Display
            "font-[600] font-[Montserrat]", //? Font
        )}>
            Screen sharing is on
            {(presenting && (host || streamAccess)) && < Button //* STOP PARTICIPANT'S SHARE SCREEN
                circle useIcon iconSrc={require("@/public/images/Share Screen (1).svg")}
                iconOverlay
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
                }}
                className={classMerge(
                    "bg-[#DF2020] shadow-lg shadow-red-500", //? Background
                    "animate-pulse transition-all duration-500", //? Animation
                    "hover:bg-[#B21A1A] hover:scale-90", //? Hover
                )} >Stop Screen Sharing</Button>}
        </div>}
        {(stream && calls.length === 0) && <video
            autoPlay
            ref={streamRef}
            muted={mutestream}
            className="h-full w-full rounded-[2em] overflow-hidden"
            style={{
                colorAdjust: "exact",
                colorInterpolation: "sRGB",
                colorRendering: "optimizeQuality",
                textRendering: "optimizeLegibility",
                shapeRendering: "geometricPrecision",
                aspectRatio: stream.getVideoTracks()[0].getSettings().aspectRatio
            }}
        />}
    </div>
}