import { HTMLAttributes, InputHTMLAttributes, forwardRef } from "react"
import Image from "next/image"
import classMerge from "../utils/classMerge"
import Button from "./button"
/* ---- TEXTBOX INTERFACE --- */
interface TextboxProps extends
    InputHTMLAttributes<HTMLInputElement> {
    id: string //? Textbox ID
    circle?: boolean //? Rounded Corners
    useIcon?: boolean //? Icon
    iconSrc?: string //? Icon Path
    iconOverlay?: boolean //? Icon Overlay
    customOverlay?: string //? Icon Custom Overlay
    useSubmit?: boolean //? Submit Button
    SubmitSrc?: string //? Button Icon
    iconClass?: HTMLAttributes<HTMLLabelElement>["className"] //? Icon Class
    containerClass?: HTMLAttributes<HTMLDivElement>["className"] //? Container Class
}
/* -------- COMPONENT ------- */
export default forwardRef<HTMLInputElement, TextboxProps>(function Textbox({ circle, useIcon, iconSrc, iconOverlay, customOverlay, useSubmit, SubmitSrc, iconClass, containerClass, type, className, placeholder, id, ...props }, ref) {
    return <div //* CONTAINER
        className={classMerge(
            "min-h-max min-w-max rounded-[1em]", //? Sizing
            "flex flex-row justify-center items-center", //? Display Styling
            "overflow-hidden shadow", //? Background Styling
            "focus-within:border-[1px] focus-within:border-blue-600", //? Border Styling
            circle && "rounded-full", //? Conditional
            containerClass
        )}>
        {useIcon && <label //* ICON BACKGROUND
            htmlFor={id}
            className={classMerge(
                "flex justify-center items-center bg-white aspect-square", //? Base
                "p-[0.917em]", //? Size
                circle && "pl-[calc(0.786em+0.5em)]",
                iconClass
            )}>
            <Image //* ICON
                className={classMerge(
                    "h-[1.25em] w-[1.5em] object-cover", //? Base
                    iconOverlay && (customOverlay ?? "whiteOverlay") //? Conditional
                )}
                src={iconSrc ?? require("@/public/images/Missing.svg")}
                alt=""
                sizes="100vw"
            /></label>}
        <input //* TEXTBOX
            id={id} ref={ref} {...props} type={type ?? "text"}
            placeholder={placeholder ?? "Text goes here"}
            className={classMerge(
                "min-h-max", //? Resizing Limit
                "h-full w-full p-[1em]", //? Textbox Size
                "bg-white", //? Background Styling
                "text-black text-[1em] font-[Gotham] font-[400]", //? Text & Font Styling
                (circle && !useIcon) && "px-[1.5em]",
                useSubmit && (circle ? "rounded-r-full" : "rounded-r-[1em]"),
                className
            )} />
        {useSubmit && <Button
            type="submit"
            useIcon circle={circle}
            iconSize={1.5}
            iconSrc={require("@/public/images/Send.svg")}
            containerClass="ml-[0.5em] text-[1em]"
            className="p-[0.75em] hover:bg-[#00000050] text-[1em]" />}
    </div>
})