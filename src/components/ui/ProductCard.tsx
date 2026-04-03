import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  slug: string;
  name: string;
  subtitle: string;
  price: number; // pence
  badge?: string | null;
  imageUrl?: string;
}

export function ProductCard({ slug, name, subtitle, price, badge, imageUrl }: ProductCardProps) {
  return (
    <Link
      href={`/shop/${slug}`}
      className="group block bg-infld-grey-dark border-2 border-infld-grey-mid overflow-hidden relative transition-transform duration-150 hover:rotate-1 hover:-translate-y-1 odd:rotate-[-0.5deg] even:rotate-[0.5deg]"
    >
      {/* Badge */}
      {badge && (
        <span className="absolute top-3 right-3 bg-infld-yellow text-infld-black font-display text-sm px-2 py-0.5 rotate-3 z-10">
          {badge}
        </span>
      )}

      {/* Image */}
      <div className="w-full aspect-square bg-infld-grey-mid relative overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:contrast-[1.1] group-hover:brightness-[1.1] transition-[filter] duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-infld-grey-light"
              style={{ fontFamily: "var(--font-display)", fontSize: "2rem" }}
            >
              INFLD
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 border-t-2 border-infld-grey-mid">
        <h3
          className="text-heading-2 text-infld-white mb-1"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
          }}
        >
          {name}
        </h3>
        <p
          className="text-infld-grey-light text-sm mb-3"
          style={{ fontFamily: "var(--font-typewriter)" }}
        >
          {subtitle}
        </p>
        <div className="flex items-center justify-between">
          <span
            className="text-infld-white text-lg font-bold"
            style={{ fontFamily: "var(--font-body)" }}
          >
            &pound;{(price / 100).toFixed(0)}
          </span>
          <span className="text-label text-infld-grey-light group-hover:text-infld-yellow transition-colors">
            VIEW &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
