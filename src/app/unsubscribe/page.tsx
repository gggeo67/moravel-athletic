import Link from "next/link";
import { site } from "@/config/site";
import { metadataFor } from "@/lib/seo";
import { getSql } from "@/lib/orders-db";
import { isToken, unsubscribeByToken } from "@/lib/list-db";

export const metadata = metadataFor({
  path: "/unsubscribe",
  title: "Unsubscribe",
  description: `Unsubscribe from ${site.name} emails.`,
  noindex: true,
});

async function unsubscribe(token: unknown): Promise<boolean> {
  if (!isToken(token)) return false;
  const sql = getSql();
  if (!sql) return false;
  try {
    return await unsubscribeByToken(sql, site.key, token);
  } catch (error) {
    console.error("[unsubscribe] failed:", (error as Error).name);
    return false;
  }
}

export default async function UnsubscribePage({
  searchParams,
}: PageProps<"/unsubscribe">) {
  const { token } = await searchParams;
  const done = await unsubscribe(token);
  return (
    <div className="wrap text-page">
      <h1>{done ? "Unsubscribed" : "Email preferences"}</h1>
      <p>
        {done
          ? `You're unsubscribed from ${site.name} emails.`
          : "We couldn't match that link to a subscription. If you're still getting emails you don't want, send us a note and we'll remove you."}
      </p>
      <div className="restock-actions">
        <Link className="button-link" href={done ? "/" : site.contact.form}>
          {done ? "Back to the shop" : "Contact us"}
        </Link>
      </div>
    </div>
  );
}
