document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    document.body.classList.add("reduced-motion");
    return;
  }

  gsap.from(".nav", {
    y: -40,
    opacity: 0,
    duration: 1.2,
    ease: "expo.out"
  });

  const heroTl = gsap.timeline({ defaults: { ease: "expo.out" } });
  heroTl
    .from(".hero__eyebrow", { y: 30, opacity: 0, duration: 0.9 })
    .from(".hero__title", { y: 60, opacity: 0, duration: 1.1 }, "-=0.4")
    .from(".hero__subtitle", { y: 40, opacity: 0, duration: 0.9 }, "-=0.6")
    .from(".hero__cta-group", { y: 30, opacity: 0, duration: 0.9 }, "-=0.6")
    .from(".hero__stats div", { y: 40, opacity: 0, duration: 0.8, stagger: 0.12 }, "-=0.6")
    .from(
      ".hero__visual",
      {
        scale: 0.8,
        rotate: 6,
        opacity: 0,
        duration: 1.3
      },
      "-=1.1"
    );

  gsap.to(".hero__orb", {
    y: 26,
    repeat: -1,
    duration: 4.5,
    yoyo: true,
    ease: "sine.inOut"
  });

  gsap.to(".hero__glow", {
    scale: 1.08,
    repeat: -1,
    duration: 5.5,
    yoyo: true,
    ease: "sine.inOut"
  });

  gsap.utils.toArray("section").forEach((section, index) => {
    if (section.id === "hero") return;

    gsap.from(section.querySelectorAll(".section__header, .mission__item, .programs__card, .innovation__list li, .innovation__quote, .experience__step, .community__left, .community__card, .cta__content, .contact__info, .contact__map"), {
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      y: 70,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.12
    });
  });

  const timelineCards = gsap.utils.toArray(".programs__card");
  timelineCards.forEach((card, idx) => {
    const direction = idx % 2 === 0 ? -1 : 1;
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse"
      },
      x: 120 * direction,
      opacity: 0,
      duration: 1.1,
      ease: "power4.out"
    });
  });

  gsap.to(".innovation__sphere", {
    scrollTrigger: {
      trigger: ".innovation",
      start: "top center",
      end: "bottom top",
      scrub: true
    },
    rotateY: 40,
    rotateX: -30,
    scale: 1.12
  });

  gsap.to(".innovation__halo", {
    scrollTrigger: {
      trigger: ".innovation",
      start: "top center",
      end: "bottom top",
      scrub: true
    },
    rotate: 220,
    scale: 1.2,
    opacity: 0.4
  });

  gsap.to(".community__card", {
    scrollTrigger: {
      trigger: ".community",
      start: "top 70%",
      end: "bottom top",
      scrub: true
    },
    yPercent: (i) => (i - 1) * 12,
    ease: "none"
  });

  gsap.to(".cta", {
    scrollTrigger: {
      trigger: ".cta",
      start: "top 80%",
      toggleActions: "play none none reverse"
    },
    boxShadow: "0 40px 120px rgba(61, 139, 255, 0.6)",
    duration: 1.2
  });

  gsap.utils.toArray(".hero__stats div").forEach((stat) => {
    const counter = { value: 0 };
    const targetText = stat.querySelector("strong").textContent;
    const numeric = parseInt(targetText, 10);
    if (Number.isNaN(numeric)) return;

    ScrollTrigger.create({
      trigger: stat,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          value: numeric,
          duration: 2.4,
          ease: "power1.out",
          onUpdate: () => {
            stat.querySelector("strong").textContent = Math.floor(counter.value) + (targetText.includes("+") ? "+" : "%");
          }
        });
      }
    });
  });
});
