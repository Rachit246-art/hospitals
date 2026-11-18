/**
 * Curevo Hospital - Main Application & Animation Controller
 * Powered by Lenis, GSAP, ScrollTrigger, and Vanilla Micro-Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initNavbar();
  initGSAPAnimations();
  initCounters();
  initTabs();
  initProcessTabs();
  initCaseSlider();
  initPricing();
  initVideoLightbox();
  initAppointmentModal();
  initNewsletter();
  initMarquee();
});

/* --------------------------------------------------------------------------
   1. Lenis Smooth Scroll
   -------------------------------------------------------------------------- */
let lenis = null;
function initLenis() {
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync GSAP ScrollTrigger with Lenis
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }
}

/* --------------------------------------------------------------------------
   2. Sticky Navbar & Mobile Menu
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar-wrapper, .navbar');
  const toggleBtn = document.querySelector('.mobile-menu-toggle, .menu-button');
  const drawer = document.querySelector('.mobile-drawer, .nav-menu');
  const closeBtn = document.querySelector('.mobile-drawer-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .nav-link');

  // Create Backdrop for mobile drawer if not already present
  let drawerBackdrop = document.querySelector('.mobile-drawer-backdrop');
  if (!drawerBackdrop) {
    drawerBackdrop = document.createElement('div');
    drawerBackdrop.className = 'mobile-drawer-backdrop';
    document.body.appendChild(drawerBackdrop);
  }

  // Sticky blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  function openDrawer() {
    toggleBtn?.classList.add('active', 'open');
    toggleBtn?.setAttribute('aria-expanded', 'true');
    drawer?.classList.add('open');
    drawerBackdrop?.classList.add('open');
    document.body.style.overflow = window.innerWidth <= 1080 ? 'hidden' : '';
  }

  function closeDrawer() {
    toggleBtn?.classList.remove('active', 'open');
    toggleBtn?.setAttribute('aria-expanded', 'false');
    drawer?.classList.remove('open');
    drawerBackdrop?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Toggle button click
  toggleBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (drawer?.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  // Close button click
  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeDrawer();
  });

  // Backdrop click closes drawer
  drawerBackdrop?.addEventListener('click', closeDrawer);

  // Close when clicking any nav link
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close when clicking outside drawer
  document.addEventListener('click', (e) => {
    if (!drawer || !toggleBtn) return;
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      closeDrawer();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer?.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Reset body overflow on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1080 && drawer?.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(targetEl, { offset: -80, duration: 1.2 });
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. GSAP Scroll Entrance Animations
   -------------------------------------------------------------------------- */
function initGSAPAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Fallback: Ensure elements are visible
    document.querySelectorAll('[style*="opacity:0"]').forEach((el) => {
      el.style.opacity = '1';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Animate Hero Section Elements
  gsap.fromTo(
    '.hero-sub-title',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' }
  );

  gsap.fromTo(
    '.hero-title',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, delay: 0.35, ease: 'power3.out' }
  );

  gsap.fromTo(
    '.hero-description, .hero-video-wrap, .hero-inner-info',
    { opacity: 0, y: 25 },
    { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, delay: 0.5, ease: 'power3.out' }
  );

  // Staggered reveals for other sections
  const revealElements = document.querySelectorAll(
    '.section-title-wrap, .pre-section-title-wrap, .why-choose-item, .service-tab-item, .team-item, .pricing-item, .testimonial-item, .cta-split-inner'
  );

  revealElements.forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // Clean up any remaining opacity:0 that haven't been picked up
  document.querySelectorAll('[style*="opacity:0"]').forEach((el) => {
    if (!el.classList.contains('count') && !el.classList.contains('modal-backdrop')) {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
        },
      });
    }
  });
}

/* --------------------------------------------------------------------------
   4. Animated Stat Counters
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.count');
  if (!counters.length) return;

  counters.forEach((el, idx) => {
    const raw = el.getAttribute('data-target') || el.textContent;
    const target = parseInt(String(raw).replace(/\D/g, ''), 10) || 0;
    const duration = Math.max(1.2, Math.min(2.5, (target / 500) * 1.5));
    const obj = { val: 0 };

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.to(obj, {
        val: target,
        duration: duration,
        ease: 'power2.out',
        delay: idx * 0.15,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        onUpdate: () => {
          el.textContent = Math.floor(obj.val).toLocaleString();
        },
        onComplete: () => {
          el.textContent = target.toLocaleString();
        },
      });
    } else {
      el.textContent = target.toLocaleString();
    }
  });
}

/* --------------------------------------------------------------------------
   5. Treatments / Service Tabs Interactive Switcher
   -------------------------------------------------------------------------- */
function initTabs() {
  const tabLinks = document.querySelectorAll('.service-section .w-tab-link');
  const tabPanes = document.querySelectorAll('.service-section .w-tab-pane');

  if (!tabLinks.length || !tabPanes.length) return;

  // Ensure initial active tab pane is displayed
  tabPanes.forEach((pane, idx) => {
    if (idx === 0) {
      pane.classList.add('w--tab-active');
    } else {
      pane.classList.remove('w--tab-active');
    }
  });

  tabLinks.forEach((link, idx) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Update link active state
      tabLinks.forEach((l) => l.classList.remove('w--current'));
      link.classList.add('w--current');

      // Update pane active state with fade
      tabPanes.forEach((pane, pIdx) => {
        if (pIdx === idx) {
          pane.classList.add('w--tab-active');
        } else {
          pane.classList.remove('w--tab-active');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. Our Process Tabs Switcher
   -------------------------------------------------------------------------- */
function initProcessTabs() {
  const procLinks = document.querySelectorAll('.our-process-section .w-tab-link');
  const procPanes = document.querySelectorAll('.our-process-section .w-tab-pane');

  if (!procLinks.length || !procPanes.length) return;

  procPanes.forEach((pane, idx) => {
    if (idx === 0) {
      pane.classList.add('w--tab-active');
    } else {
      pane.classList.remove('w--tab-active');
    }
  });

  procLinks.forEach((link, idx) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      procLinks.forEach((l) => l.classList.remove('w--current'));
      link.classList.add('w--current');

      procPanes.forEach((pane, pIdx) => {
        if (pIdx === idx) {
          pane.classList.add('w--tab-active');
        } else {
          pane.classList.remove('w--tab-active');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. Case Studies Carousel
   -------------------------------------------------------------------------- */
function initCaseSlider() {
  const slider = document.querySelector('.case-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.case-slide');
  const leftArrow = slider.querySelector('.slide-left-arrow');
  const rightArrow = slider.querySelector('.slide-right-arrow');
  const dotsContainer = slider.querySelector('.slide-nav');

  if (!slides.length) return;

  let currentIndex = 0;
  const totalSlides = slides.length;

  // Build dots if needed
  if (dotsContainer && !dotsContainer.children.length) {
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = `w-slider-dot ${i === 0 ? 'w-active' : ''}`;
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goToSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    slides.forEach((s, idx) => {
      if (idx === currentIndex) {
        s.style.display = 'block';
        s.style.opacity = '1';
      } else {
        s.style.display = 'none';
        s.style.opacity = '0';
      }
    });

    // Update dots
    const dots = dotsContainer?.querySelectorAll('.w-slider-dot');
    dots?.forEach((d, idx) => {
      d.classList.toggle('w-active', idx === currentIndex);
    });
  }

  // Initialize first slide
  goToSlide(0);

  leftArrow?.addEventListener('click', (e) => {
    e.preventDefault();
    goToSlide(currentIndex - 1);
  });

  rightArrow?.addEventListener('click', (e) => {
    e.preventDefault();
    goToSlide(currentIndex + 1);
  });
}

/* --------------------------------------------------------------------------
   8. Pricing Slider & Billing Switch (Monthly / Annual)
   -------------------------------------------------------------------------- */
function initPricing() {
  const pricingSection = document.querySelector('.pricing-section');
  if (!pricingSection) return;

  // Add Billing Switcher UI dynamically if not present
  const pricingHeader = pricingSection.querySelector('.section-title-wrap');
  if (pricingHeader && !pricingSection.querySelector('.pricing-billing-switch')) {
    const switchWrap = document.createElement('div');
    switchWrap.className = 'pricing-billing-switch';
    switchWrap.innerHTML = `
      <button type="button" class="pricing-switch-btn active" data-billing="monthly">Monthly Billing</button>
      <button type="button" class="pricing-switch-btn" data-billing="annual">Annual Billing <span class="save-badge">Save 20%</span></button>
    `;
    pricingHeader.appendChild(switchWrap);

    const priceValues = [
      { monthly: '$49', annual: '$39' },
      { monthly: '$89', annual: '$71' },
      { monthly: '$149', annual: '$119' },
    ];

    const priceHeadings = pricingSection.querySelectorAll('.pricing-content-title-wrap + .pricing-inner-info h3, .pricing-slide h3');

    switchWrap.querySelectorAll('.pricing-switch-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        switchWrap.querySelectorAll('.pricing-switch-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const isAnnual = btn.getAttribute('data-billing') === 'annual';

        // Update pricing cards
        document.querySelectorAll('.pricing-item, .pricing-slide').forEach((card, idx) => {
          const priceEl = card.querySelector('h3:not(.pricing-content-title)');
          if (priceEl && priceValues[idx % priceValues.length]) {
            const val = isAnnual ? priceValues[idx % priceValues.length].annual : priceValues[idx % priceValues.length].monthly;
            priceEl.innerHTML = `${val} <span style="font-size: 1rem; font-weight: normal; color: var(--text-muted);">/month</span>`;
          }
        });
        showToast(isAnnual ? 'Applied 20% Annual Care Discount!' : 'Switched to Monthly Care Plan');
      });
    });
  }

  // Pricing Slider Prev / Next buttons
  const leftBtn = pricingSection.querySelector('.pricing-slide-button.left');
  const rightBtn = pricingSection.querySelector('.pricing-slide-button.right');
  const slides = pricingSection.querySelectorAll('.pricing-slide');

  if (slides.length > 1) {
    let pIdx = 0;
    function updatePricingSlide(idx) {
      pIdx = (idx + slides.length) % slides.length;
      slides.forEach((s, i) => {
        s.style.display = i === pIdx ? 'block' : 'none';
      });
    }

    leftBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      updatePricingSlide(pIdx - 1);
    });

    rightBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      updatePricingSlide(pIdx + 1);
    });
  }
}

/* --------------------------------------------------------------------------
   9. Infinite Marquee Continuous Gliding Setup
   -------------------------------------------------------------------------- */
function initMarquee() {
  const marqueeContainer = document.querySelector('.about-marquee-main');
  if (!marqueeContainer) return;

  const existingLists = marqueeContainer.querySelectorAll('.about-marquee-list');
  if (existingLists.length > 0) {
    const track = document.createElement('div');
    track.className = 'about-marquee-track';

    existingLists.forEach((l) => track.appendChild(l.cloneNode(true)));
    // Clone again for seamless infinite loop
    existingLists.forEach((l) => track.appendChild(l.cloneNode(true)));

    marqueeContainer.innerHTML = '';
    marqueeContainer.appendChild(track);
  }
}

/* --------------------------------------------------------------------------
   10. Video Lightbox Modal
   -------------------------------------------------------------------------- */
function initVideoLightbox() {
  const videoTriggers = document.querySelectorAll('.hero-video-wrap, .hero-video-lightbox, .play-pulse');

  // Create Video Lightbox Modal in DOM
  const modal = document.createElement('div');
  modal.className = 'video-modal-backdrop';
  modal.innerHTML = `
    <div class="video-modal-container">
      <button class="video-modal-close" aria-label="Close Video">&times;</button>
      <iframe src="" title="Curevo Hospital Tour & Care Services" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
  `;
  document.body.appendChild(modal);

  const iframe = modal.querySelector('iframe');
  const closeBtn = modal.querySelector('.video-modal-close');

  function openVideo(url) {
    iframe.src = url || 'https://www.youtube.com/embed/g0J6yzw7p_8?autoplay=1';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeVideo() {
    modal.classList.remove('active');
    iframe.src = '';
    document.body.style.overflow = '';
  }

  videoTriggers.forEach((trig) => {
    trig.addEventListener('click', (e) => {
      e.preventDefault();
      openVideo();
    });
  });

  closeBtn?.addEventListener('click', closeVideo);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeVideo();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeVideo();
    }
  });
}

/* --------------------------------------------------------------------------
   11. Interactive Multi-Step Appointment Booking Modal
   -------------------------------------------------------------------------- */
function initAppointmentModal() {
  // Create Modal DOM
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.id = 'appointmentModal';
  modal.innerHTML = `
    <div class="modal-card">
      <button class="modal-close-btn" aria-label="Close modal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <div class="modal-header">
        <span class="modal-tag">ONLINE APPOINTMENT</span>
        <h2 class="modal-title">Book your doctor visit</h2>
        <p style="color: var(--text-muted); font-size: 0.92rem; margin-top: 6px;">Experience personalized healthcare with Curevo's certified specialists.</p>
      </div>

      <form id="appointmentForm">
        <div class="form-group">
          <label class="form-label">Medical Specialty / Department</label>
          <select class="form-control" id="aptDepartment" required>
            <option value="General Medicine">General Medicine (Primary Care)</option>
            <option value="Physical Therapy">Physical Therapy & Rehabilitation</option>
            <option value="Women's Health">Women's Health & Maternity</option>
            <option value="Mental Health">Mental Health & Counseling</option>
            <option value="Pediatrics">Pediatrics (Children's Care)</option>
            <option value="Cardiology">Cardiology & Heart Care</option>
            <option value="Dermatology">Dermatology & Skin Health</option>
            <option value="Radiology & Diagnostics">Radiology & Advanced Imaging</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Preferred Specialist</label>
          <select class="form-control" id="aptDoctor" required>
            <option value="First Available Specialist">First Available Specialist</option>
            <option value="Dr. Michael Hayes (Cardiologist)">Dr. Michael Hayes — Cardiologist</option>
            <option value="Dr. Olivia Reynolds (Dermatologist)">Dr. Olivia Reynolds — Dermatology Specialist</option>
            <option value="Dr. Ava Kim (Neurologist)">Dr. Ava Kim — Neurologist</option>
            <option value="Dr. David Lin (Pediatrician)">Dr. David Lin — Pediatrician</option>
          </select>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <div class="form-group">
            <label class="form-label">Preferred Date</label>
            <input type="date" class="form-control" id="aptDate" required />
          </div>
          <div class="form-group">
            <label class="form-label">Preferred Time</label>
            <select class="form-control" id="aptTime" required>
              <option value="09:00 AM">09:00 AM (Morning)</option>
              <option value="10:30 AM">10:30 AM (Morning)</option>
              <option value="11:45 AM">11:45 AM (Midday)</option>
              <option value="02:00 PM">02:00 PM (Afternoon)</option>
              <option value="03:30 PM">03:30 PM (Afternoon)</option>
              <option value="05:00 PM">05:00 PM (Evening)</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input type="text" class="form-control" id="aptName" placeholder="e.g. Sarah Jenkins" required />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input type="tel" class="form-control" id="aptPhone" placeholder="+1 (555) 000-0000" required />
          </div>
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-control" id="aptEmail" placeholder="sarah@example.com" required />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Symptoms / Notes (Optional)</label>
          <textarea class="form-control" id="aptNotes" rows="2" placeholder="Briefly describe your symptoms or reason for visit..."></textarea>
        </div>

        <button type="submit" class="button-arrow" style="width: 100%; justify-content: center; margin-top: 10px;">
          <div class="button-text-wrap">
            <div class="button-text-one">Confirm Appointment</div>
            <div class="button-text-two">Confirm Appointment</div>
          </div>
          <div class="button-icon-wrap">
            <img src="assets/690c7ad5bf0d16a67d6a12d6_button_arrow__2_.svg" alt="Arrow" class="button-icon"/>
            <img src="assets/690c7ad5bf0d16a67d6a12d6_button_arrow__2_.svg" alt="Arrow" class="button-hover-icon"/>
          </div>
        </button>
      </form>

      <div class="booking-success-card" id="bookingSuccess">
        <div class="success-check-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#26332d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h3 style="font-family: var(--font-serif); font-size: 1.8rem; margin-bottom: 8px;">Appointment Confirmed!</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem;">Thank you, <strong id="confName" style="color: var(--dark-forest);"></strong>. Your consultation has been scheduled.</p>
        
        <div style="background: var(--sage-light); border-radius: 16px; padding: 18px; margin: 20px 0; text-align: left; font-size: 0.9rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--text-muted);">Appointment ID:</span>
            <strong id="confId" style="font-family: var(--font-mono); color: var(--dark-forest);"></strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--text-muted);">Specialist:</span>
            <strong id="confDoctor" style="color: var(--dark-forest);"></strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Date & Time:</span>
            <strong id="confDateTime" style="color: var(--dark-forest);"></strong>
          </div>
        </div>

        <button type="button" class="button-arrow" id="closeSuccessBtn" style="width: 100%; justify-content: center;">
          <div class="button-text-wrap">
            <div class="button-text-one">Done & Close</div>
            <div class="button-text-two">Done & Close</div>
          </div>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Set default min date to tomorrow
  const dateInput = modal.querySelector('#aptDate');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.min = tomorrow.toISOString().split('T')[0];
  dateInput.value = tomorrow.toISOString().split('T')[0];

  function openModal(preselectDoctor = '', preselectDept = '') {
    if (preselectDoctor) {
      const docSelect = modal.querySelector('#aptDoctor');
      for (let opt of docSelect.options) {
        if (opt.value.toLowerCase().includes(preselectDoctor.toLowerCase())) {
          docSelect.value = opt.value;
          break;
        }
      }
    }
    if (preselectDept) {
      const deptSelect = modal.querySelector('#aptDepartment');
      for (let opt of deptSelect.options) {
        if (opt.value.toLowerCase().includes(preselectDept.toLowerCase())) {
          deptSelect.value = opt.value;
          break;
        }
      }
    }

    modal.querySelector('#appointmentForm').style.display = 'block';
    modal.querySelector('#bookingSuccess').style.display = 'none';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Bind all buttons that trigger appointment
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('a[href*="book"], button[data-action="book"], .doctor-book-btn');
    if (btn) {
      e.preventDefault();
      const doctorName = btn.getAttribute('data-doctor') || '';
      const deptName = btn.getAttribute('data-dept') || '';
      openModal(doctorName, deptName);
    }
  });

  modal.querySelector('.modal-close-btn').addEventListener('click', closeModal);
  modal.querySelector('#closeSuccessBtn').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  // Handle Form Submission
  const form = modal.querySelector('#appointmentForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = modal.querySelector('#aptName').value.trim();
    const doctor = modal.querySelector('#aptDoctor').value;
    const date = modal.querySelector('#aptDate').value;
    const time = modal.querySelector('#aptTime').value;
    const refCode = 'CRV-' + Math.floor(10000 + Math.random() * 90000);

    modal.querySelector('#confName').textContent = name;
    modal.querySelector('#confId').textContent = refCode;
    modal.querySelector('#confDoctor').textContent = doctor;
    modal.querySelector('#confDateTime').textContent = `${date} at ${time}`;

    form.style.display = 'none';
    modal.querySelector('#bookingSuccess').style.display = 'block';

    showToast(`Appointment confirmed for ${name}! Reference: ${refCode}`);
  });
}

/* --------------------------------------------------------------------------
   12. Newsletter Form Handling
   -------------------------------------------------------------------------- */
function initNewsletter() {
  const forms = document.querySelectorAll('.footer-form, form');
  forms.forEach((form) => {
    if (form.id === 'appointmentForm') return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value.trim()) {
        showToast('✓ Welcome to Curevo Health! Check your inbox for updates.');
        input.value = '';
      } else {
        showToast('✓ Thank you for reaching out to Curevo.');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   13. Toast Notification Helper
   -------------------------------------------------------------------------- */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#85fa6d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 50);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}


/* --------------------------------------------------------------------------
   14. Specialty Filter Bar Controller
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  initDropdowns();
});

function initFilters() {
  const filterBars = document.querySelectorAll('.filter-bar');
  filterBars.forEach((bar) => {
    const buttons = bar.querySelectorAll('.filter-btn');
    const targetSelector = bar.getAttribute('data-target') || '.filterable-item';
    const items = document.querySelectorAll(targetSelector);

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filterVal = btn.getAttribute('data-filter') || 'all';

        items.forEach((item) => {
          const category = item.getAttribute('data-category') || '';
          if (filterVal === 'all' || category.toLowerCase() === filterVal.toLowerCase()) {
            item.style.display = '';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  });
}

function initDropdowns() {
  const dropdowns = document.querySelectorAll('.dropdown, .w-dropdown');
  dropdowns.forEach((dd) => {
    const toggle = dd.querySelector('.dropdown-toggle, .w-dropdown-toggle');
    const list = dd.querySelector('.dropdown-list, .w-dropdown-list');

    if (toggle && list) {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dd.classList.toggle('open');
      });

      document.addEventListener('click', (e) => {
        if (!dd.contains(e.target)) {
          dd.classList.remove('open');
        }
      });
    }
  });
}
