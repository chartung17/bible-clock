export type TranslationInfo = {
    name: string;
    slug: string;
};

export const translations: TranslationInfo[] = [
    { name: "Douay Rheims", slug: "DRC" },
    { name: "Clementine Vulgate", slug: "VulgClementine" },
    { name: "King James Version", slug: "KJV" },
    { name: "King James Version with Apocrypha", slug: "KJVA" },
    { name: "Lexham English Bible", slug: "LEB" },
    { name: "Catholic Public Domain Version", slug: "CPDV" },
    { name: "Open English Bible", slug: "OEB" },
];