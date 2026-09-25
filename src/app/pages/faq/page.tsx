import { faqs } from "@/config/site";
import { metadataForPage } from "@/lib/seo";
import { Accordion } from "@/components/accordion";
import { JsonLd } from "@/components/json-ld";
export const metadata = metadataForPage("/pages/faq");
export default function Page() {
  return (
    <div className="wrap text-page">
      <h1>Frequently asked questions</h1>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }}
      />
      {faqs.map((f) => (
        <Accordion key={f.question} title={f.question}>
          {f.answer}
        </Accordion>
      ))}
    </div>
  );
}
