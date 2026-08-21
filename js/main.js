/**
 * WORKSHOP DESTRAVE SUA AUTOESTIMA
 * Clean Vanilla JavaScript - No dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. UTM & Query String Preservation for Checkout Links
  function applyUTMParameters() {
    const currentParams = new URLSearchParams(window.location.search);
    if (!currentParams.toString()) return;

    const checkoutLinks = document.querySelectorAll('a[href*="sun.eduzz.com"], a[href*="pay.hotmart.com"]');
    checkoutLinks.forEach(link => {
      try {
        const url = new URL(link.href);
        currentParams.forEach((value, key) => {
          url.searchParams.set(key, value);
        });
        link.href = url.toString();
      } catch (e) {
        console.error('Error updating checkout link:', e);
      }
    });
  }
  applyUTMParameters();

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
