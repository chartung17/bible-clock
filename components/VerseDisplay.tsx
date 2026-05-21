"use client";

import nextConfig from "@/next.config";
import { state } from "@/services/state";
import { useValue } from "@legendapp/state/react";
import { useEffect, useMemo, useState } from "react";

type Verse = {
  book: string;
  verse: string;
};

export default function VerseDisplay({ hour, minute }: { hour: number; minute: number }) {
    const [verses, setVerses] = useState<Verse[]>([]);
    const [verseIndex, setVerseIndex] = useState(0);

    const verse = useMemo(() => verses[verseIndex] ?? { book: "", verse: "" }, [verses, verseIndex]);

    const time = useMemo(() => `${hour}${minute > 0 ? `:${String(minute).padStart(2, '0')}` : ''}`, [hour, minute]);

    const translation = useValue(state.translation);
    const favoriteVerse = useValue(state.favoriteVerses[time]);

    const favorited = verse.book === favoriteVerse;

    const favorite = () => state.favoriteVerses[time].set(verse.book);

    const unfavorite = () => state.favoriteVerses[time].delete();

    const refresh = () => {
        if (verses.length <= 1) return;
        const maxRetries = 10;
        let index = 0;
        for (let i = 0; i < maxRetries; i++) {
            index = Math.floor(Math.random() * verses.length);
            if (index !== verseIndex) break;
        }
        setVerseIndex(index);
    }

    useEffect(() => {
        const fetchVerse = async () => {
            const response = await fetch(`${nextConfig.basePath}/bibles/${translation}/${hour}/${minute}/verses.json`);
            const newVerses: Verse[] = await response.json();
            setVerses(newVerses);
            let index: number | undefined;
            if (favoriteVerse) {
                index = newVerses.findIndex(v => v.book === favoriteVerse);
            }
            if (index === undefined) {
                index = Math.floor(Math.random() * newVerses.length);
            }
            setVerseIndex(index ?? 0);
        }

        if (hour > 0) {
            fetchVerse();
        }
    }, [hour, minute, translation]);

    return (
        verse.verse ? (
            <>
            <div className="w-full flex flex-row justify-end gap-4">
                {verses.length > 1 && (
                    <button onClick={refresh} className="cursor-pointer text-2xl">
                        ↻
                    </button>
                )}
                <button onClick={favorited ? unfavorite : favorite} className="cursor-pointer text-2xl">
                    {favorited ? "♥" : "♡"}
                </button>
            </div>
            <p className="text-2xl sm:text-3xl lg:text-4xl sm:text-justify">{verse.verse}</p>
            <p className="text-4xl text-right w-full">- {verse.book} <span className="text-6xl">{time}</span></p>
            </>
        ) : hour ? (
            <p className="text-4xl text-right w-full"><span className="text-6xl">{time}</span></p>
        ) : null
    );
}
