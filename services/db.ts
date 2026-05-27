import SQLite, { Statement, type Database } from "better-sqlite3";
import { TranslationInfo, translations } from "./bible";

export type DB = TranslationInfo & {
    db: Database;
    stmts: {
        singleChapter: Statement;
        multiChapter: Statement;
    };
}

const getSingleChapterBookIds = (db: Database, slug: string) =>
    (db.prepare(`
        SELECT book_id FROM ${slug}_verses
        GROUP BY book_id
        HAVING COUNT(DISTINCT chapter) = 1
    `).all() as { book_id: number }[]).map(r => r.book_id);

export const dbs: Record<string, DB> = Object.fromEntries(
    translations.map(({ name, slug }) => {
        const db = new SQLite(`./data/bible_databases/formats/sqlite/${slug}.db`, { readonly: true });
        db.pragma('cache_size = -64000'); // 64MB cache
        db.pragma('temp_store = memory');
        const singleChapterBookIds = getSingleChapterBookIds(db, slug).join(',');
        return [
            slug, 
            { 
                name, 
                slug, 
                db,
                stmts: {
                    singleChapter: db.prepare(`
                        SELECT b.name AS book, v.text AS verse
                        FROM ${slug}_verses v
                        JOIN ${slug}_books b ON b.id = v.book_id
                        WHERE v.verse = ?
                        AND v.text != ''
                        AND b.id IN (${singleChapterBookIds})
                        AND v.chapter = 1
                    `),
                    multiChapter: db.prepare(`
                        SELECT b.name AS book, v.text AS verse
                        FROM ${slug}_verses v
                        JOIN ${slug}_books b ON b.id = v.book_id
                        WHERE v.verse = ?
                        AND v.text != ''
                        AND b.id NOT IN (${singleChapterBookIds})
                        AND v.chapter = ?
                    `),
                },
            },
        ];
    }),
);

export const getVerses = (translation: string, hour: number, minute: number) => {
    const db = dbs[translation];
    if (!db) throw new Error('Translation not found');
    const isSingleChapterMode = minute === 0;

    return isSingleChapterMode
        ? db.stmts.singleChapter.all(hour)
        : db.stmts.multiChapter.all(minute, hour);
};