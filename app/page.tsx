"use client";

import VerseDisplay from "@/components/VerseDisplay";
import { translations } from "@/services/bible";
import { state, stateSyncStatus } from "@/services/state";
import { useValue } from "@legendapp/state/react";
import { useEffect, useState } from "react";

export default function Home() {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);

  const translation = useValue(state.translation);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date();
      const currentHour = now.getHours() % 12 || 12;
      const currentMinute = now.getMinutes();
      if (hour === currentHour && minute === currentMinute) return;
      setHour(currentHour);
      setMinute(currentMinute);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <header className="w-full flex flex-row justify-end items-center gap-4 p-4">
        <select 
          value={translation} 
          onChange={(e) => { state.translation.set(e.target.value); setHour(0); }}
          className="bg-black"
        >
          {translations.map(({ name, slug }) => (
            <option value={slug} key={slug} label={name} />
          ))}
        </select>
      </header>
      <main className="flex flex-1 w-full max-w-3xl flex-col py-32 px-16 gap-4 bg-black">
        <VerseDisplay hour={hour} minute={minute} key={`${hour}:${minute}`} />
      </main>
    </>
  );
}
