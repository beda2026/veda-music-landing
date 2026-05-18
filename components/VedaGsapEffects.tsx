"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function VedaGsapEffects() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const ctx = gsap.context(() => {
      gsap.to(".site-bg", {
        backgroundPosition: "center 55%",
        duration: 24,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.fromTo(
        ".gsap-hero-logo",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      );

      gsap.fromTo(
        ".gsap-headline",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
      );

      gsap.fromTo(
        ".gsap-button",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.08, ease: "power3.out" },
      );

      gsap.fromTo(
        ".gsap-hero-media",
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 1.1, ease: "power3.out" },
      );

      if (!reduceMotion && !isMobile) {
        const media = document.querySelector<HTMLElement>(".gsap-hero-media");
        if (media) {
          const onMove = (event: MouseEvent) => {
            const x = (event.clientX / window.innerWidth - 0.5) * 8;
            const y = (event.clientY / window.innerHeight - 0.5) * 6;
            gsap.to(media, { x, y, duration: 0.8, ease: "power2.out", overwrite: true });
          };
          window.addEventListener("mousemove", onMove, { passive: true });
          gsap.delayedCall(0, () => {
            ctx.add(() => window.removeEventListener("mousemove", onMove));
          });
        }
      }

      gsap.utils.toArray<HTMLElement>(".gsap-card").forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: reduceMotion ? 16 : 40 },
          {
            opacity: 1,
            y: 0,
            duration: reduceMotion ? 0.4 : 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".gsap-ad-slot").forEach((ad) => {
        gsap.fromTo(ad, { opacity: 0, x: -20 }, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ad, start: "top 85%", once: true },
        });
      });

      gsap.to(".gsap-radio-pulse", {
        scale: 1.025,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "center center",
      });

      gsap.utils.toArray<HTMLElement>(".gsap-sponsor-card").forEach((card) => {
        const hoverIn = () => gsap.to(card, { scale: 1.03, y: -4, boxShadow: "0 16px 32px rgba(245,178,27,0.20)", duration: 0.25, ease: "power2.out" });
        const hoverOut = () => gsap.to(card, { scale: 1, y: 0, boxShadow: "0 8px 28px rgba(0,0,0,0.35)", duration: 0.25, ease: "power2.out" });
        card.addEventListener("mouseenter", hoverIn);
        card.addEventListener("mouseleave", hoverOut);
        ctx.add(() => {
          card.removeEventListener("mouseenter", hoverIn);
          card.removeEventListener("mouseleave", hoverOut);
        });
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      ctx.revert();
    };
  }, []);

  return null;
}
