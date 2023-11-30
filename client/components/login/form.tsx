import Image from "next/image";
import { useGlobals } from "../hooks/useGlobals";
import { useState } from "react"
import classMerge from "../utils/classMerge";
import TUPBackImg from "@/public/images/TUP Back.svg"
import TUPFrontImg from "@/public/images/TUP Front.svg"
import Textbox from "../atom/textbox";
import ParticipantImg from "@/public/images/Participants.svg"
import KeyImg from "@/public/images/Key.svg"
import Button from "../atom/button";
import JoinImg from "@/public/images/Join.svg"

export default function LoginForm() {
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "p-[2em] px-[3em]", //? Sizing
            "bg-white rounded-[2em] panelStyle", //? Background
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
        <div //* LOGO CONTAINER
            className="relative h-[4em] w-[4em] flex justify-center items-center Unselectable">
            <Image //* BACK LOGO
                className="aspect-square object-cover animate-spin"
                src={TUPBackImg}
                alt=""
                sizes="100vw"
                fill
            />
            <Image //* LOGO
                className="aspect-square object-cover"
                src={TUPFrontImg}
                alt=""
                sizes="100vw"
                fill
            />
        </div>
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
        name, setname
    } = useGlobals()
    const [key, setKey] = useState<string>("")
    /* -------- RENDERING ------- */
    return <form
        className={classMerge(
            "flex flex-col gap-[1em] justify-center items-center", //? Display
        )}>
        <div //* INPUT CONTAINER
            className="flex flex-col gap-[0.5em]">
            <Textbox //* NAME
                maxLength={32} containerClass="text-[14px]"
                value={name} onChange={(thisElement) => setname(thisElement.target.value)}
                id="name" useIcon iconSrc={ParticipantImg}
                placeholder="What is your name?" />
            {name.length > 3 && <Textbox //* KEY
                maxLength={32} containerClass="text-[14px]"
                value={key} onChange={(thisElement) => setKey(thisElement.target.value)}
                id="key" useIcon iconSrc={KeyImg}
                placeholder="Key is optional" />}
        </div>
        {name.length > 3 && <Button
            type="submit" containerClass="text-[14px]"
            useIcon iconOverlay iconSrc={JoinImg}
            className={classMerge(
                "bg-red-500 hover:bg-red-700 hover:scale-90", //? Base
                "transition-all duration-300", //? Animation
            )}>
            Join Meeting
        </Button>}
    </form>
}