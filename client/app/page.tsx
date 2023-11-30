import classMerge from "@/components/utils/classMerge";

export default function Home() {
  return <div
    className={classMerge(
      "h-full w-full bg-black text-white", //? Size
      "flex justify-center items-center", //? Display
    )}>
    {typeof window}
  </div>
}