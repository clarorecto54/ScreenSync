import { Dispatch, SetStateAction } from "react"

interface SessionProps {
    host: boolean
    streamAcces: boolean
    mutestream: boolean
    presenting: boolean
    interactive: string
    /* -------------------------- */
    sethost: Dispatch<SetStateAction<boolean>>
    setstreamAcces: Dispatch<SetStateAction<boolean>>
    setmutestream: Dispatch<SetStateAction<boolean>>
    setpresenting: Dispatch<SetStateAction<boolean>>
    setinteractive: Dispatch<SetStateAction<string>>
}

interface UserProps {
    id: string
    name: string
    IPv4: string
}

interface MessageProps {
    id: string
    name: string
    message: string | string[]
    time: string
}