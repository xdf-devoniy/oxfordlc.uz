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

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.35,
      rootMargin: '0px 0px -10% 0px',
    }
  );

  animated.forEach((el) => observer.observe(el));

  const handleNavState = (current) => {
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

  if (prefersReducedMotion || typeof Lenis === 'undefined' || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    animated.forEach((el) => el.classList.add('is-visible'));
    window.addEventListener('scroll', () => {
      handleNavState(window.scrollY);
    });
    return;
  }

  let currentScroll = 0;

  const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
    smoothTouch: false,
    lerp: 0.1,
  });

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  lenis.on('scroll', (e) => {
    const current = e.scroll;
    currentScroll = current;
    handleNavState(current);
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
  ScrollTrigger.refresh();

  if (typeof SplitType !== 'undefined') {
    const splitTargets = document.querySelectorAll('[data-split]');
    splitTargets.forEach((target) => {
      const splitInstance = new SplitType(target, { types: 'lines, words' });
      gsap.from(splitInstance.lines, {
        yPercent: 120,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.12,
        delay: 0.2,
      });
    });
  }

  gsap.utils.toArray('.experience__card').forEach((card) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
    });
  });

  gsap.utils.toArray('.programs__item').forEach((item, index) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      x: index % 2 === 0 ? -40 : 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });
  });

  gsap.utils.toArray('.innovation__item').forEach((item) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 75%',
      },
      y: 50,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
    });
  });

  gsap.from('.innovation__visual', {
    scrollTrigger: {
      trigger: '.innovation__visual',
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
    y: 60,
    opacity: 0,
    duration: 1.1,
    ease: 'power3.out',
  });

  gsap.from('.highlight', {
    scrollTrigger: {
      trigger: '.highlight',
      start: 'top 80%',
    },
    scale: 0.96,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
  });

  gsap.utils.toArray('.community__details > div').forEach((item, idx) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
      },
      y: 35,
      opacity: 0,
      duration: 0.8,
      delay: idx * 0.1,
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
        onUpdate: function () {
          stat.textContent = Math.round(this.targets()[0].count).toLocaleString('ru-RU') + suffix;
        },
      }
    );
  });

  const swiperEl = document.querySelector('.community__gallery');
  if (swiperEl) {
    // eslint-disable-next-line no-undef
    new Swiper(swiperEl, {
      loop: true,
      speed: 900,
      spaceBetween: 40,
      autoplay: {
        delay: 3500,
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
          translate: ['-20%', 0, -1],
        },
        next: {
          translate: ['20%', 0, -1],
        },
      },
    });
  }

  handleNavState(window.scrollY);
});
