export interface UserProps {
    id: string
    name: string
    IPv4: string
}

export interface MessageProps {
    id: string
    name: string
    message: string | string[]
    time: string
}
export interface StreamProps {
    hostID: string
    id: string
    presenting: boolean
}
export interface AttendanceProps {
    id: string
    name: string
    time: string
}
export interface RoomProps {
    id: string
    key: string
    host: UserProps
    participants: UserProps[]
    chatlog: MessageProps[]
    stream: StreamProps
    entries: AttendanceProps[]
}