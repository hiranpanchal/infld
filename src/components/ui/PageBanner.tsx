interface Props {
  title?: string;
  bannerUrl?: string | null;
}

export function PageBanner({ title, bannerUrl }: Props) {
  return (
    <section
      className="relative overflow-hidden flex items-center px-4"
      style={{
        height: "600px",
        ...(bannerUrl
          ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
          : undefined),
      }}
    >
      {!bannerUrl && <div className="absolute inset-0 section-textured" />}
      {bannerUrl && <div className="absolute inset-0 bg-infld-black/60" />}
      {title && (
        <div className="max-w-4xl mx-auto relative z-10">
          <h1
            className="text-infld-white stencil-text"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 12vw, 7rem)", lineHeight: 0.95 }}
          >
            {title}
          </h1>
        </div>
      )}
    </section>
  );
}
