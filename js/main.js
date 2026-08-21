/**
 * WORKSHOP DESTRAVE SUA AUTOESTIMA
 * Clean Vanilla JavaScript - No dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. UTM & SCK Tracking for Hotmart / Checkout Links
  function applyTrackingParameters() {
    console.log('%cScript de rastreio by Comunidade Nova Ordem do Digital - Dericson Calari e Samuel Choairy', 'color: purple; font-size: 20px;');

    try {
      let parametros = ["utm_source"];
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);

      for (const [key] of params) {
        if (!parametros.includes(key)) {
          parametros.push(key);
        }
      }

      const urlParamsCapt = new URLSearchParams(window.location.search);
      const urlParamsCaptReferrer = new URLSearchParams(document.referrer.split('?')[1] || '');
      let utms = {};

      parametros.forEach(el => {
        if (el === "utm_source") {
          let refHostname = "";
          try {
            if (document.referrer) {
              refHostname = new URL(document.referrer).hostname;
            }
          } catch (_) {}
          utms[el] = urlParamsCapt.get(el) ?? (urlParamsCaptReferrer.get(el) ?? (refHostname || "direto"));
        } else {
          utms[el] = urlParamsCapt.get(el) ?? (urlParamsCaptReferrer.get(el) ?? "");
        }
      });

      let scks = Object.values(utms).filter(value => value !== "" && value !== null && value !== undefined);

      let currentSckValues = [];
      if (urlParamsCapt.get('sck')) {
        currentSckValues = urlParamsCapt.get('sck').split('|');
      }
      scks = scks.filter(value => !currentSckValues.includes(value));

      const updateLinks = (el, elURL) => {
        const elSearchParams = new URLSearchParams(elURL.search);
        let modified = false;
        for (let key in utms) {
          if (utms[key] && !elSearchParams.has(key)) {
            elSearchParams.append(key, utms[key]);
            modified = true;
          }
        }
        if (!elSearchParams.has('sck') && scks.length > 0) {
          elSearchParams.append('sck', scks.join('|'));
          modified = true;
        }
        if (modified) {
          return elURL.origin + elURL.pathname + "?" + elSearchParams.toString() + (elURL.hash || "");
        }
        return el.href;
      };

      document.querySelectorAll('a').forEach(el => {
        try {
          if (!el.href || el.getAttribute('href')?.startsWith('#') || el.href.startsWith('javascript:') || el.href.startsWith('mailto:') || el.href.startsWith('tel:')) return;
          const elURL = new URL(el.href);
          if (!elURL.hash || el.href.includes('pay.hotmart.com') || el.href.includes('sun.eduzz.com')) {
            el.href = updateLinks(el, elURL);
          }
        } catch (e) {
          // ignore invalid URLs
        }
      });

      document.querySelectorAll('iframe').forEach(iframe => {
        try {
          let actualSrc = iframe.hasAttribute('data-src') ? iframe.getAttribute('data-src') : iframe.src;
          if (actualSrc && !actualSrc.startsWith('javascript:')) {
            const iframeURL = new URL(actualSrc);
            if (iframe.hasAttribute('data-src')) {
              iframe.setAttribute('data-src', updateLinks(iframe, iframeURL));
            } else {
              iframe.src = updateLinks(iframe, iframeURL);
            }
          }
        } catch (e) {
          // ignore invalid URLs
        }
      });
    } catch (err) {
      console.error('Erro no script de rastreio:', err);
    }
  }
  applyTrackingParameters();

  // 2. Smooth Scrolling for Internal Anchors with Accurate Offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          if (window.history && window.history.pushState) {
            window.history.pushState(null, null, targetId);
          }
        }
      }
    });
  });

  // 3. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        
        // Close other accordion items for clean UX
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });

        // Toggle current
        if (isOpen) {
          item.classList.remove('active');
        } else {
          item.classList.add('active');
        }
      });
    }
  });

  // 4. Testimonials Carousel
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.querySelector('.carousel-btn-prev');
  const nextBtn = document.querySelector('.carousel-btn-next');
  const dotsContainer = document.querySelector('.carousel-dots');

  if (track && slides.length > 0) {
    let currentIndex = 0;

    function getItemsPerView() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function createDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const itemsPerView = getItemsPerView();
      const totalPages = Math.max(1, slides.length - itemsPerView + 1);
      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateCarousel() {
      const itemsPerView = getItemsPerView();
      const maxIndex = Math.max(0, slides.length - itemsPerView);
      if (currentIndex > maxIndex) currentIndex = maxIndex;

      const slideWidthPercent = 100 / itemsPerView;
      track.style.transform = `translateX(-${currentIndex * slideWidthPercent}%)`;

      // Update dots
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((d, idx) => {
          d.classList.toggle('active', idx === currentIndex);
        });
      }
    }

    function goToSlide(index) {
      const itemsPerView = getItemsPerView();
      const maxIndex = Math.max(0, slides.length - itemsPerView);
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      updateCarousel();
    }

    function nextSlide() {
      const itemsPerView = getItemsPerView();
      const maxIndex = Math.max(0, slides.length - itemsPerView);
      if (currentIndex >= maxIndex) {
        currentIndex = 0;
      } else {
        currentIndex++;
      }
      updateCarousel();
    }

    function prevSlide() {
      const itemsPerView = getItemsPerView();
      const maxIndex = Math.max(0, slides.length - itemsPerView);
      if (currentIndex <= 0) {
        currentIndex = maxIndex;
      } else {
        currentIndex--;
      }
      updateCarousel();
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Touch Swipe Support
    let startX = 0;
    track.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', e => {
      const endX = e.changedTouches[0].clientX;
      if (startX - endX > 40) {
        nextSlide();
      } else if (endX - startX > 40) {
        prevSlide();
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      createDots();
      updateCarousel();
    });

    createDots();
    updateCarousel();
  }

  // 5. Lightbox Modal for Testimonial Images
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightbox && lightboxImg) {
    document.querySelectorAll('.carousel-slide img').forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }
});
