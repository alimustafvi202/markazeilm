import { libre_baskerville } from "./font";

export default async function Home() {
  return (
    <div className="h-screen w-full bg-white grid place-items-center p-2 md:p-8">
      <div className="relative heading-div max-w-7xl w-[90%] xl:w-[50rem] mx-auto p-6 md:p-24 bg-white border-[2px] border-primary-teal rounded-xl">
        <h1 className="text-center text-[4rem] md:text-[7.5rem] leading-snug font-bold text-l-t-r-gradient w-fit heading-text relative mx-auto">
          Nigotis
        </h1>
        <h2
          className={`${libre_baskerville.className} text-center text-2xl md:text-5xl leading-snug text-l-t-r-gradient pb-6 w-fit mx-auto font-bold italic heading-text relative`}
        >
          Coming Soon
        </h2>
      </div>
    </div>
  );
}
