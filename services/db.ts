import SQLite, { type Database } from "better-sqlite3";
import { TranslationInfo, translations } from "./bible";

export type DB = TranslationInfo & {
    db: Database;
}

export const dbs: Record<string, DB> = Object.fromEntries(
    translations.map(({ name, slug }) => ([
        slug, 
        { 
            name, 
            slug, 
            db: new SQLite(`./data/bible_databases/formats/sqlite/${slug}.db`),
        },
    ])),
);

export const getVerses = (translation: string, hour: number, minute: number) => {
    const db = dbs[translation];
    if (!db) throw new Error('Translation not found');
    const isSingleChapterMode = minute === 0;

    const stmt = db.db.prepare(`
        SELECT b.name AS book, v.text AS verse
        FROM ${db.slug}_verses v
        JOIN ${db.slug}_books b ON b.id = v.book_id
        WHERE v.verse = ?
        AND v.text != ''
        AND b.id IN (
            SELECT v2.book_id
            FROM ${db.slug}_verses v2
            GROUP BY v2.book_id
            HAVING COUNT(DISTINCT v2.chapter) ${isSingleChapterMode ? '=' : '>'} 1
        )
        AND v.chapter = ${isSingleChapterMode ? 1 : '?'}
    `);

    return isSingleChapterMode
        ? stmt.all(hour)
        : stmt.all(minute, hour);
};