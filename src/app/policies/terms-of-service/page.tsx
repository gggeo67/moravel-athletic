import { PageShell } from "@/components/page-shell";
import { metadataForPage } from "@/lib/seo";

const PATH = "/policies/terms-of-service";

export const metadata = metadataForPage(PATH);

export default function Page() {
  return <PageShell path={PATH} />;
}
