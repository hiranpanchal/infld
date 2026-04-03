"use client";

import { useEffect, useState, useCallback } from "react";

interface HeroSlideshowProps {
  images: string[];
  overlayOpacity: number; // 0-100
  className?: string;
}

export function HeroSlideshow({ images, overlayOpacity, className = "" }: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (transitioning || index === current) return;
      setTransitioning(true);
      setTimeout(() => {
        setCurrent(index);
        setTransitioning(false);
      }, 600);
    },
    [current, transitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % images.length);
  }, [current, images.length, goTo]);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [images.length, next]);

  if (images.length === 0) {
    // No images — just a textured dark background
    return <div className={`absolute inset-0 section-textured z-0 ${className}`} />;
  }

  const overlayStyle = { opacity: overlayOpacity / 100 };

  return (
    <>
      {/* Slides */}
      {images.map((url, i) => (
        <div
          key={url}
          className="absolute inset-0 z-0 transition-opacity duration-700"
          style={{ opacity: i === current ? (transitioning ? 0 : 1) : 0 }}
        >
          <img
            src={url}
            alt=""
            className="w-full h-full object-cover object-center"
            draggable={false}
          />
        </div>
      ))}

      {/* Overlay */}
      <div
        className="absolute inset-0 z-[1] bg-infld-black"
        style={overlayStyle}
      />

      {/* Dot indicators — only show if multiple images */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2 h-2 border border-infld-white transition-all duration-300 ${
                i === current
                  ? "bg-infld-yellow border-infld-yellow scale-125"
                  : "bg-transparent hover:bg-infld-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </>
  );
}
