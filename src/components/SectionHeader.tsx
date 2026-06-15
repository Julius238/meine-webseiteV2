"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
};

export function SectionHeader({ eyebrow, title, description, align = "left" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current?.querySelectorAll(".reveal") || [], {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className={
        align === "center"
          ? "max-w-3xl mx-auto text-center"
          : "max-w-3xl"
      }
    >
      {eyebrow && (
        <div className="reveal chip chip-dot mb-6">{eyebrow}</div>
      )}
      <h2 className="reveal text-display-2 font-semibold text-gradient tracking-tighter2">
        {title}
      </h2>
      {description && (
        <p className="reveal mt-5 text-lg text-mute leading-relaxed">{description}</p>
      )}
    </div>
  );
}
