const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelector('.nav__links');
  const navToggle = document.querySelector('.nav__toggle');
  let lastScroll = 0;

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-open');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.classList.remove('is-open');
      });
    });
  }

  const animated = document.querySelectorAll('[data-animate]');

  const handleNavState = (current) => {
    if (!nav) return;

    const isScrollingDown = current > lastScroll + 6;
    const isScrollingUp = current < lastScroll - 6;

    if (current > 120) {
      nav.classList.add('nav--scrolled');
      if (isScrollingDown) {
        nav.classList.add('nav--hidden');
      } else if (isScrollingUp) {
        nav.classList.remove('nav--hidden');
      }
    } else {
      nav.classList.remove('nav--scrolled');
      nav.classList.remove('nav--hidden');
    }

    lastScroll = current;
  };

  const librariesMissing =
    typeof Lenis === 'undefined' || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined';

  if (prefersReducedMotion || librariesMissing) {
    animated.forEach((el) => el.classList.add('is-visible'));
    window.addEventListener('scroll', () => handleNavState(window.scrollY));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();

  let currentScroll = window.scrollY;

  const lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true,
    smoothTouch: false,
    lerp: 0.08,
  });

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  lenis.on('scroll', ({ scroll }) => {
    currentScroll = scroll;
    handleNavState(scroll);
  });

  lenis.on('scroll', ScrollTrigger.update);

  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (arguments.length) {
        lenis.scrollTo(value, { immediate: true });
      }
      return currentScroll;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
  });

  window.addEventListener('resize', () => ScrollTrigger.refresh());
  ScrollTrigger.addEventListener('refresh', () => lenis.update());

  gsap.to('.bg-gradient', {
    duration: 16,
    rotate: 3,
    scale: 1.08,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });

  gsap.to('.bg-grid', {
    backgroundPosition: '120px 120px',
    ease: 'none',
    duration: 20,
    repeat: -1,
    yoyo: true,
  });

  const splitMap = new Map();
  if (typeof SplitType !== 'undefined') {
    document.querySelectorAll('[data-split]').forEach((target) => {
      const instance = new SplitType(target, { types: 'lines, words', tagName: 'span' });
      splitMap.set(target, instance);
    });
  }

  const heroSection = document.querySelector('#hero');
  const heroTitle = heroSection?.querySelector('.hero__title');
  const heroEyebrow = heroSection?.querySelector('.eyebrow');
  const heroParagraph = heroSection?.querySelector('p');
  const heroStats = heroSection?.querySelectorAll('.hero__stats div') || [];
  const heroScroll = heroSection?.querySelector('.hero__scroll');
  const heroPlanet = heroSection?.querySelector('.hero__planet');
  const heroCard = heroSection?.querySelector('.hero__card');

  const heroTitleSplit = heroTitle ? splitMap.get(heroTitle) : null;
  const heroEyebrowSplit = heroEyebrow ? splitMap.get(heroEyebrow) : null;
  const heroParagraphSplit = heroParagraph ? splitMap.get(heroParagraph) : null;

  const heroReveal = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (heroEyebrowSplit) {
    heroReveal.from(heroEyebrowSplit.lines, {
      yPercent: 120,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
    });
  } else if (heroEyebrow) {
    heroReveal.from(heroEyebrow, { y: 24, autoAlpha: 0, duration: 0.8 });
  }

  if (heroTitleSplit) {
    heroReveal.from(heroTitleSplit.lines, {
      yPercent: 120,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out',
      stagger: 0.12,
    });
  } else if (heroTitle) {
    heroReveal.from(heroTitle, { y: 60, autoAlpha: 0, duration: 1.1 }, '-=0.4');
  }

  if (heroParagraphSplit) {
    heroReveal.from(heroParagraphSplit.lines, {
      yPercent: 110,
      opacity: 0,
      duration: 0.9,
      stagger: 0.08,
    }, '-=0.7');
  } else if (heroParagraph) {
    heroReveal.from(heroParagraph, { y: 30, autoAlpha: 0, duration: 0.8 }, '-=0.6');
  }

  heroReveal.from('.hero__cta', { y: 28, autoAlpha: 0, duration: 0.8 }, '-=0.55');
  heroReveal.from('.hero__badges li', { y: 18, autoAlpha: 0, duration: 0.6, stagger: 0.08 }, '-=0.5');
  heroReveal.from('.hero__visual', { autoAlpha: 0, scale: 0.9, duration: 1.1, ease: 'power3.out' }, '-=1.1');
  heroReveal.from(heroStats, { y: 40, autoAlpha: 0, duration: 0.9, stagger: 0.12 }, '-=0.9');
  if (heroScroll) {
    heroReveal.from(heroScroll, { y: 24, autoAlpha: 0, duration: 0.8 }, '-=0.7');
  }

  mm.add('(min-width: 992px)', () => {
    if (!heroSection) return undefined;

    const heroTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: '+=220%',
        scrub: true,
        pin: true,
        anticipatePin: 1,
      },
    });

    if (heroTitleSplit) {
      heroTimeline.to(heroTitleSplit.lines, { yPercent: -25, stagger: 0.02, ease: 'none' }, 0);
    } else if (heroTitle) {
      heroTimeline.to(heroTitle, { yPercent: -12, ease: 'none' }, 0);
    }

    if (heroPlanet) {
      heroTimeline.to(
        heroPlanet,
        {
          rotateY: 26,
          rotateX: -16,
          rotateZ: 8,
          scale: 1.1,
          ease: 'none',
        },
        0
      );
    }

    if (heroCard) {
      heroTimeline.to(
        heroCard,
        {
          yPercent: -22,
          rotateX: 12,
          ease: 'none',
        },
        0
      );
    }

    heroTimeline.to('.hero__stats', { yPercent: 16, ease: 'none' }, 0);
    heroTimeline.to('.hero__scroll', { autoAlpha: 0, ease: 'power1.inOut' }, 0.08);

    return () => heroTimeline.kill();
  });

  const revealTargets = gsap
    .utils
    .toArray('[data-animate]')
    .filter((element) => !element.closest('#hero') && !element.closest('.programs__timeline'));
  if (revealTargets.length) {
    gsap.set(revealTargets, { autoAlpha: 0, y: 40 });

    ScrollTrigger.batch(revealTargets, {
      interval: 0.12,
      batchMax: 8,
      start: 'top 85%',
      onEnter: (batch) =>
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.08,
          overwrite: true,
        }),
      onEnterBack: (batch) =>
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.06,
        }),
      onLeave: (batch) =>
        gsap.to(batch, {
          autoAlpha: 0,
          y: 40,
          duration: 0.6,
          ease: 'power3.in',
        }),
    });
  }

  gsap.utils.toArray('[data-parallax-y]').forEach((element) => {
    if (element.closest('#hero')) return;

    const distance = Number(element.dataset.parallaxY) || 16;
    gsap.to(element, {
      yPercent: distance,
      ease: 'none',
      scrollTrigger: {
        trigger: element.closest('section') || element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  gsap.utils.toArray('[data-parallax-rotate]').forEach((element) => {
    if (element.closest('#hero')) return;

    const rotation = Number(element.dataset.parallaxRotate) || 15;
    gsap.to(element, {
      rotateZ: rotation,
      ease: 'none',
      scrollTrigger: {
        trigger: element.closest('section') || element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  const pointerFine = window.matchMedia('(pointer: fine)').matches;
  if (pointerFine) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      const tilt = (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

        gsap.to(card, {
          rotateX: y * -10,
          rotateY: x * 12,
          transformPerspective: 800,
          duration: 0.6,
          ease: 'power2.out',
        });
      };

      const reset = () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.8,
          ease: 'power2.out',
        });
      };

      card.addEventListener('pointermove', tilt);
      card.addEventListener('pointerleave', reset);
    });
  }

  mm.add('(max-width: 1023px)', () => {
    gsap.utils.toArray('.programs__item').forEach((item, index) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 82%',
        },
        x: index % 2 === 0 ? -36 : 36,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out',
      });
    });
  });

  mm.add('(min-width: 1024px)', () => {
    const timelineEl = document.querySelector('.programs__timeline');
    const items = gsap.utils.toArray('.programs__item');
    const progress = timelineEl?.querySelector('.programs__line-progress');
    if (!timelineEl || !items.length || !progress) {
      return undefined;
    }

    gsap.set(items, { autoAlpha: 0.25, scale: 0.94 });
    gsap.set(items[0], { autoAlpha: 1, scale: 1 });
    gsap.set(progress, { scaleY: 0, transformOrigin: 'top' });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: timelineEl,
        start: 'top top',
        end: `+=${items.length * 320}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
      },
    });

    timeline.to(progress, { scaleY: 1, ease: 'none' }, 0);

    const step = 1 / items.length;
    items.forEach((item, index) => {
      const start = index * step;
      timeline.to(
        item,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.6,
          ease: 'power3.out',
        },
        start
      );

      if (index > 0) {
        const previous = items[index - 1];
        timeline.to(
          previous,
          {
            autoAlpha: 0.25,
            scale: 0.94,
            duration: 0.6,
            ease: 'power3.inOut',
          },
          start
        );
      }

      if (index < items.length - 1) {
        timeline.to(
          item,
          {
            autoAlpha: 0.35,
            scale: 0.94,
            duration: 0.6,
            ease: 'power3.inOut',
          },
          start + step * 0.85
        );
      }
    });

    return () => timeline.kill();
  });

  gsap.to('.innovation__orb', {
    scale: 1.2,
    rotate: -22,
    ease: 'none',
    scrollTrigger: {
      trigger: '.innovation',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });

  gsap.to('.innovation__halo', {
    scale: 1.15,
    rotate: 36,
    ease: 'none',
    scrollTrigger: {
      trigger: '.innovation',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });

  gsap.from('.highlight', {
    scrollTrigger: {
      trigger: '.highlight',
      start: 'top 80%',
    },
    autoAlpha: 0,
    scale: 0.96,
    duration: 1,
    ease: 'power3.out',
  });

  gsap.utils.toArray('.community__details > div').forEach((item, index) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
      },
      y: 40,
      autoAlpha: 0,
      duration: 0.8,
      delay: index * 0.1,
      ease: 'power3.out',
    });
  });

  const stats = document.querySelectorAll('.hero__stats dt');
  stats.forEach((stat) => {
    const suffix = stat.dataset.suffix || '';
    const value = Number(stat.dataset.value || stat.textContent.replace(/[^0-9.]/g, ''));

    gsap.fromTo(
      { count: 0 },
      { count: value },
      {
        duration: 2.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: stat,
          start: 'top 80%',
          once: true,
        },
        onUpdate() {
          stat.textContent = Math.round(this.targets()[0].count).toLocaleString('ru-RU') + suffix;
        },
      }
    );
  });

  const swiperEl = document.querySelector('.community__gallery');
  if (swiperEl && typeof Swiper !== 'undefined') {
    // eslint-disable-next-line no-undef
    new Swiper(swiperEl, {
      loop: true,
      speed: 1000,
      spaceBetween: 50,
      autoplay: {
        delay: 3200,
        disableOnInteraction: false,
      },
      pagination: {
        el: swiperEl.querySelector('.swiper-pagination'),
        clickable: true,
      },
      effect: 'creative',
      creativeEffect: {
        prev: {
          shadow: true,
          translate: ['-18%', 0, -1],
        },
        next: {
          translate: ['18%', 0, -1],
        },
      },
    });
  }

  ScrollTrigger.refresh();
  handleNavState(window.scrollY);
});
