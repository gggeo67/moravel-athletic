/**
 * Serialises JSON-LD safely.
 *
 * `<` is escaped so a string in the data can never terminate the script tag
 * early. `JSON.stringify` handles the rest.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
