import { StaticImageData } from "next/image"

interface SystemPopupProps {
    type: "ERROR" | "INFO" | "ALERT"
    action?: () => void
    icon?: StaticImageData
    message: string
}