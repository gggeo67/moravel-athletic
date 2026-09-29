import { PageShell } from "@/components/page-shell";
import { ContactForm } from "@/components/contact-form";
import { metadataForPage } from "@/lib/seo";

const PATH = "/pages/contact";

export const metadata = metadataForPage(PATH);

export default function Page() {
  return (
    <PageShell path={PATH}>
      <ContactForm />
    </PageShell>
  );
}
