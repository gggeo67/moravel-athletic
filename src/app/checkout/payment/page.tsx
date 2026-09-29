import Link from "next/link";
import { restock } from "@/config/site";
import { metadataFor } from "@/lib/seo";
import { getSql, hasRestockOptIn } from "@/lib/orders-db";
import { isOrderRef } from "@/lib/order";
import { ClearBag } from "@/components/clear-bag";
import { RestockOptIn } from "@/components/restock-opt-in";

export const metadata = metadataFor({
  path: "/checkout/payment",
  title: "Restock notification",
  description: restock.message,
  noindex: true,
});

/** Reads the saved choice from the database, so the page says what the customer actually agreed to. */
async function optedIn(ref: string): Promise<boolean> {
  const sql = getSql();
  if (!sql) return false;
  try {
    return await hasRestockOptIn(sql, ref);
  } catch (error) {
    console.error("[restock page] opt-in lookup failed:", error);
    return false;
  }
}

export default async function PaymentPage({
  searchParams,
}: PageProps<"/checkout/payment">) {
  const query = await searchParams;
  const ref = isOrderRef(query.ref) ? query.ref : null;
  const subscribed = ref ? await optedIn(ref) : false;
  const showOptIn = ref !== null && !subscribed && query.optin === "1";

  return (
    <div className="wrap text-page">
      {ref && <ClearBag />}
      <h1>{restock.title}</h1>
      <p>{restock.message}</p>
      {subscribed ? (
        <>
          <p>{restock.optedIn}</p>
          <p>{restock.chargeNotice}</p>
        </>
      ) : (
        <>
          <p>{restock.notOptedIn}</p>
          {ref && !showOptIn && (
            <p>
              {restock.optInPrompt}{" "}
              <Link
                className="text-link"
                href={`/checkout/payment?ref=${ref}&optin=1#restock-optin`}
              >
                {restock.optInLink}
              </Link>
            </p>
          )}
          {showOptIn && <RestockOptIn orderRef={ref} />}
        </>
      )}
      <div className="restock-actions">
        <Link className="button-link" href="/">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
