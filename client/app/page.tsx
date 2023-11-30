import Button from "@/components/atom/button";
import Textbox from "@/components/atom/textbox";
import classMerge from "@/components/utils/classMerge";

export default function Home() {
  return <div
    className={classMerge(
      "h-full w-full bg-black", //? Size
      "flex justify-center items-center", //? Display
    )}>
  </div>
}