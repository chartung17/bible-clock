"use client";

import nextConfig from "@/next.config";
import { translations } from "@/services/bible";
import { useEffect, useState } from "react";

export default function Home() {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [verse, setVerse] = useState({ book: "", verse: ""});
  const [translation, setTranslation] = useState("DRC");

  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date();
      const currentHour = now.getHours() % 12 || 12;
      const currentMinute = now.getMinutes();
      if (hour === currentHour && minute === currentMinute) return;

      const response = await fetch(`${nextConfig.basePath}/bibles/${translation}/${currentHour}/${currentMinute}/verses.json`);
      const verses = await response.json();
      const randomVerse = await verses[Math.floor(Math.random() * verses.length)];
      setHour(currentHour);
      setMinute(currentMinute);
      setVerse(randomVerse ?? { book: "", verse: ""});
    }, 1000);

    return () => clearInterval(interval);
  }, [hour, minute, verse, translation]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <header className="w-full flex flex-row justify-end items-center gap-4 p-4">
        <select 
          value={translation} 
          onChange={(e) => { setTranslation(e.target.value); setHour(0); setVerse({ book: "", verse: ""}); }}
          className="bg-black"
        >
          {translations.map(({ name, slug }) => (
            <option value={slug} key={slug} label={name} />
          ))}
        </select>
      </header>
      <main className="flex flex-1 w-full max-w-3xl flex-col py-32 px-16 gap-4 bg-white dark:bg-black">
        {verse.verse ? (
          <>
            <p className="text-2xl sm:text-3xl lg:text-4xl">{verse.verse}</p>
            <p className="text-4xl text-right w-full">- {verse.book} <span className="text-6xl">{hour}{minute > 0 ? `:${String(minute).padStart(2, '0')}` : ''}</span></p>
          </>
        ) : hour ? (
          <p className="text-4xl text-right w-full"><span className="text-6xl">{hour}:{minute}</span></p>
        ) : null}
      </main>
    </div>
  );
}
