import { StaticImageData } from "next/image"

interface SystemPopupProps {
    type: "ERROR" | "INFO"
    action?: () => void
    icon?: StaticImageData
    message: string
}