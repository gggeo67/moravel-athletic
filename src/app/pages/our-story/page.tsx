import Image from "next/image";
import { storefront } from "@/config/site";
import { metadataForPage } from "@/lib/seo";
import { SplitBlock } from "@/components/editorial";
export const metadata = metadataForPage("/pages/our-story");
export default function Page() {
  return (
    <>
      <div className="page-heading">
        <h1>{storefront.story.title}</h1>
        <p>{storefront.story.intro}</p>
      </div>
      <div className="hero-photo">
        <Image
          src={storefront.hero.image}
          alt={storefront.hero.alt}
          fill
          preload
          sizes="100vw"
        />
      </div>
      {storefront.story.blocks.map((block, i) => (
        <SplitBlock key={block.title} block={block} reverse={i % 2 === 1} />
      ))}
    </>
  );
}
