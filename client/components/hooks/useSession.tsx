"use client"
import { SessionProps } from "@/types/session.types"
import { ReactNode, createContext, useContext, useState } from "react"
/* -------- INTERFACE ------- */
const defaultValues: SessionProps = {
    host: false,
    streamAcces: false,
    mutestream: false,
    presenting: false,
    interactive: "",
    /* -------------------------- */
    sethost: () => { },
    setstreamAcces: () => { },
    setmutestream: () => { },
    setpresenting: () => { },
    setinteractive: () => { },
}
const context = createContext<SessionProps>(defaultValues)
/* ------ HOOK PROVIDER ----- */
export function useSession() { return useContext<SessionProps>(context) }
/* --------- CONTEXT -------- */
export function SessionContextProvider({ children }: { children: ReactNode }) {
    /* ----- STATES & HOOKS ----- */
    const [host, sethost] = useState<boolean>(false)
    const [streamAcces, setstreamAcces] = useState<boolean>(false)
    const [mutestream, setmutestream] = useState<boolean>(false)
    const [presenting, setpresenting] = useState<boolean>(false)
    const [interactive, setinteractive] = useState<string>("")
    /* ------ EVENT HANDLER ----- */
    /* -------- PROVIDER -------- */
    const defaultValues: SessionProps = {
        host,
        streamAcces,
        mutestream,
        presenting,
        interactive,
        /* -------------------------- */
        sethost,
        setstreamAcces,
        setmutestream,
        setpresenting,
        setinteractive,
    }
    return <context.Provider value={defaultValues}>{children}</context.Provider>
}