"use client"
import { SessionContextProvider } from "@/components/hooks/useSession";
import AppDock from "@/components/session/appdock";
import MainDisplay from "@/components/session/display";
import Header from "@/components/session/headers";
import classMerge from "@/components/utils/classMerge";

export default function Session() {
    /* -------- RENDERING ------- */
    return <SessionContextProvider>
        <div //* VIEWPORT
            className={classMerge(
                "h-full w-full p-[1.25em] py-[0.75em]", //? Sizing
                "relative flex flex-col gap-[0.75em] justify-center items-start", //? Display
                "bg-black", //? Background
                "text-white font-[600] font-[Gotham]", //? Font Styling
            )}>
            <Header />
            <MainDisplay />
            <AppDock />
        </div>
    </SessionContextProvider>
}