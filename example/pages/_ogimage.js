import { useMeta } from "next-opengraph-image";

export default function OgImage() {
  const { title, description } = useMeta();

  return (
    <div className="w-[1200px] h-[600px] bg-gray-100 py-44 px-32 flex flex-col justify-between">
      <img src="/vercel.svg" className="w-[500px]" alt="" />
      <div className="space-y-8">
        <h1 className="text-[11em]font-extrabold leading-none">{title}</h1>
        <h2 className="text-[4.7em] font-medium leading-snug">{description}</h2>
      </div>
    </div>
  );
}
