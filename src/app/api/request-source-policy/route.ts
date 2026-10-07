import { requestSourceEligible } from "@/lib/request-source-server";
export const dynamic = "force-dynamic";
export async function GET() {
  return Response.json(
    { enabled: await requestSourceEligible() },
    {
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
        Vary: "x-vercel-ip-country, sec-gpc, dnt",
        "X-Robots-Tag": "noindex",
      },
    },
  );
}
