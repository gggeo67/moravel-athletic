import Link from "next/link";
import { restock } from "@/config/site";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor({
  path: "/checkout/payment",
  title: "Restock notification",
  description: restock.message,
  noindex: true,
});

export default function PaymentPage() {
  return (
    <div className="wrap text-page">
      <h1>{restock.title}</h1>
      <p>{restock.message}</p>
      <p>{restock.chargeNotice}</p>
      <Link className="button-link" href="/">
        Continue shopping
      </Link>
    </div>
  );
}
