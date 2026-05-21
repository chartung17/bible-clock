import { translations } from "@/services/bible";
import { getVerses } from "@/services/db";

export const runtime = "nodejs";

export const dynamic = "force-static";

export async function generateStaticParams() {
    const results = [];
    for (const translation of translations) {
        for (let hour = 1; hour <=12; hour++) {
            for (let minute = 0; minute <= 59; minute++) {
                results.push({ translation: translation.slug, hour: String(hour), minute: String(minute) });
            }
        }
    }
    return results;
}

export async function GET(request: Request, { params }: { params: Promise<{ translation: string; hour: string; minute: string }> }) {
    const { translation, hour, minute } = await params;
    const minutes = getVerses(translation, parseInt(hour), parseInt(minute));
    return Response.json(minutes);
}