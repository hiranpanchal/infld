import { StarFilled, StarOutline, Lightning } from "@/components/doodles";
import { EmailForm } from "@/components/ui/EmailForm";

export const metadata = {
  title: "INFLD — Coming Soon",
  description:
    "INFLD is coming. Streetwear for 7–15 year olds who think for themselves. Sign up to be notified.",
};

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center section-textured relative overflow-hidden px-4">
      {/* Scattered doodles */}
      <div className="absolute top-12 left-8 text-infld-yellow opacity-50 rotate-12">
        <StarFilled size={24} />
      </div>
      <div className="absolute top-20 right-16 text-infld-yellow opacity-40 -rotate-6">
        <Lightning size={28} />
      </div>
      <div className="absolute bottom-24 left-12 text-infld-yellow opacity-30 rotate-45">
        <StarOutline size={32} />
      </div>
      <div className="absolute bottom-16 right-10 text-infld-yellow opacity-50 -rotate-12">
        <StarFilled size={20} />
      </div>
      <div className="absolute top-1/3 left-1/4 text-infld-grey-mid opacity-15 rotate-6">
        <Lightning size={48} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-xl mx-auto">
        <h1
          className="text-display text-infld-white stencil-text mb-2"
          style={{ fontSize: "clamp(5rem, 20vw, 16rem)" }}
        >
          INFLD
        </h1>

        <p
          className="text-heading-1 text-infld-white mb-6"
          style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}
        >
          COMING SOON
        </p>

        <p
          className="text-infld-grey-light mb-10"
          style={{ fontFamily: "var(--font-typewriter)" }}
        >
          We&apos;re getting ready. You should too.
        </p>

        {/* Email signup */}
        <div className="max-w-md mx-auto mb-12">
          <EmailForm />
        </div>

        <p
          className="text-infld-grey-mid text-xs"
          style={{ fontFamily: "var(--font-body)" }}
        >
          NOT YOUR BRAND. NOT EVEN CLOSE.
        </p>
      </div>
    </main>
  );
}
