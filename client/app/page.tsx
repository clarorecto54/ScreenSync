"use client"
import Image from "next/image";
import classMerge from "@/components/utils/classMerge";
import LoginForm from "@/components/login/form";

export default function Home() {
  /* -------- RENDERING ------- */
  return <div //* VIEWPORT
    className={classMerge(
      "h-full w-full", //? Size
      "relative flex justify-center items-center overflow-hidden", //? Display
    )}>
    <div //* BACKDROP
      className={classMerge(
        "h-full w-full flex justify-center items-center", //? Base
        "focus-within:backdrop-blur-md focus-within:backdrop-brightness-50", //? Trigger
        "transition-all duration-1000", //? Animation
      )}>
      <LoginForm />
    </div>
    <Image //* BACKGROUND IMAGE
      priority
      className="absolute object-cover -z-[99]"
      src={require("@/public/images/Background.svg")}
      alt=""
      sizes="100vw"
      fill
    />
  </div>
}