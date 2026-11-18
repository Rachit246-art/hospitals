/**
 * ORYNTH MEDICAL - Master Doctor & Surgical Sanctuary
 * Interactive Logic, Slow Luxury Animations, Custom Magnetic Cursor & 3D Tilt
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Slow Luxury Editorial Preloader with Progress Counter
  initSlowPreloader();

  // 3. Custom Luxury Cursor with Magnetic Hover Snap
  initLuxuryCursor();

  // 4. Ambient Floating Bokeh Canvas
  initAmbientBokeh();

  // 5. Hero Background Video Toggle
  initHeroVideoControls();

  // 6. Interactive 3D Card Tilt Effect
  initTiltCards();

  // 7. Navbar Scroll Transition & Active Nav Tracker
  initNavbarScroll();

  // 8. Mobile Drawer Menu
  initMobileMenu();

  // 9. Stat Counter Animation on Scroll
  initStatCounters();

  // 10. Testimonial Slider
  initTestimonialSlider();

  // 11. Modal Accessibility & Backdrop Listeners
  initModalListeners();
});

/* ==============================================================
   1. SLOW LUXURY EDITORIAL PRELOADER
   ============================================================== */
function initSlowPreloader() {
  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preloaderFill');
  const percentText = document.getElementById('preloaderPercent');
  if (!preloader) return;

  let currentPercent = 0;
  const targetPercent = 100;
  const duration = 2000; // 2 seconds slow luxury load
  const startTime = performance.now();

  function updatePreloader(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // EaseOutCubic
    const ease = 1 - Math.pow(1 - progress, 3);
    currentPercent = Math.floor(ease * targetPercent);

    if (fill) fill.style.width = `${currentPercent}%`;
    if (percentText) percentText.textContent = `${currentPercent}%`;

    if (progress < 1) {
      requestAnimationFrame(updatePreloader);
    } else {
      setTimeout(() => {
        preloader.classList.add('fade-out');
        document.body.classList.add('loaded');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 1200);
      }, 350);
    }
  }

  requestAnimationFrame(updatePreloader);
}

/* ==============================================================
   2. CUSTOM LUXURY CURSOR & MAGNETIC HOVER
   ============================================================== */
function initLuxuryCursor() {
  const cursor = document.getElementById('customCursor');
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const text = document.getElementById('cursorText');
  if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  }, { passive: true });

  // Smooth lerp for outer ring
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover triggers via [data-cursor]
  const hoverElements = document.querySelectorAll('[data-cursor], a, button, .clinic-card, .tilt-card');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      const label = el.getAttribute('data-cursor') || '';
      cursor.classList.add('cursor-hover');
      if (text) text.textContent = label;
    });

    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
      if (text) text.textContent = '';
    });
  });

  // Magnetic Pull Effect on .magnetic-btn
  const magneticButtons = document.querySelectorAll('.magnetic-btn');
  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate3d(${relX * 0.25}px, ${relY * 0.25}px, 0)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate3d(0, 0, 0)';
    });
  });
}

/* ==============================================================
   3. AMBIENT FLOATING BOKEH CANVAS
   ============================================================== */
function initAmbientBokeh() {
  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 18 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 80 + 40,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    hue: Math.random() > 0.6 ? 43 : 158, // Gold or Deep Sage
    alpha: Math.random() * 0.08 + 0.03
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -p.radius) p.x = width + p.radius;
      if (p.x > width + p.radius) p.x = -p.radius;
      if (p.y < -p.radius) p.y = height + p.radius;
      if (p.y > height + p.radius) p.y = -p.radius;

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
      if (p.hue === 43) {
        grad.addColorStop(0, `rgba(197, 160, 89, ${p.alpha * 1.5})`);
        grad.addColorStop(1, 'rgba(197, 160, 89, 0)');
      } else {
        grad.addColorStop(0, `rgba(80, 97, 82, ${p.alpha})`);
        grad.addColorStop(1, 'rgba(80, 97, 82, 0)');
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==============================================================
   4. HERO BACKGROUND VIDEO CONTROLS
   ============================================================== */
function initHeroVideoControls() {
  const video = document.getElementById('heroVideo');
  const toggleBtn = document.getElementById('videoToggleBtn');
  const toggleIcon = document.getElementById('videoToggleIcon');
  const toggleText = document.getElementById('videoToggleText');
  if (!video) return;

  // Ensure muted autoplay starts immediately
  video.muted = true;
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // If browser blocked it before interaction, play on first interaction
      document.addEventListener('click', () => {
        video.play().catch(() => {});
      }, { once: true });
    });
  }

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      if (toggleText) toggleText.textContent = 'CINEMATIC VIEW';
      if (toggleIcon) toggleIcon.setAttribute('data-lucide', 'pause');
    } else {
      video.pause();
      if (toggleText) toggleText.textContent = 'PAUSED';
      if (toggleIcon) toggleIcon.setAttribute('data-lucide', 'play');
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
  });
}

/* ==============================================================
   5. INTERACTIVE 3D CARD TILT EFFECT
   ============================================================== */
function initTiltCards() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const cards = document.querySelectorAll('.tilt-card, .clinic-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6; // Max 6 deg
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    });
  });
}

/* ==============================================================
   6. NAVBAR SCROLL & ACTIVE TRACKER
   ============================================================== */
function initNavbarScroll() {
  const header = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==============================================================
   7. LUXURY MOBILE DRAWER MENU
   ============================================================== */
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileToggle = document.getElementById('mobileToggle');
  if (!mobileMenu) return;
  
  const isOpen = mobileMenu.classList.toggle('open');
  if (mobileToggle) {
    mobileToggle.classList.toggle('active', isOpen);
  }
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function openMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileToggle = document.getElementById('mobileToggle');
  if (mobileMenu) {
    mobileMenu.classList.add('open');
    if (mobileToggle) mobileToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileToggle = document.getElementById('mobileToggle');
  if (mobileMenu) {
    mobileMenu.classList.remove('open');
    if (mobileToggle) mobileToggle.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileToggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  // Close menu on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });
}

// Global window exposure
window.toggleMobileMenu = toggleMobileMenu;
window.openMobileMenu = openMobileMenu;
window.closeMobileMenu = closeMobileMenu;

/* ==============================================================
   8. STAT NUMBER COUNTERS (INTERSECTION OBSERVER)
   ============================================================== */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsSection = document.getElementById('statsGrid');
  let counted = false;

  const countUp = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const duration = 2200;
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = (target * ease).toFixed(decimals);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toFixed(decimals);
      }
    };
    requestAnimationFrame(update);
  };

  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
          counted = true;
          statNumbers.forEach(stat => countUp(stat));
        }
      });
    }, { threshold: 0.25 });

    observer.observe(statsSection);
  }
}

/* ==============================================================
   9. TESTIMONIAL CAROUSEL
   ============================================================== */
let currentSlideIndex = 0;
let slideInterval = null;

function initTestimonialSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  if (!slides.length) return;

  function showSlide(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    currentSlideIndex = index;
  }

  window.goToSlide = function(index) {
    showSlide(index);
    resetAutoSlide();
  };

  window.slideNext = function() {
    let nextIndex = (currentSlideIndex + 1) % slides.length;
    showSlide(nextIndex);
    resetAutoSlide();
  };

  window.slidePrev = function() {
    let prevIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
    resetAutoSlide();
  };

  function startAutoSlide() {
    slideInterval = setInterval(() => {
      let nextIndex = (currentSlideIndex + 1) % slides.length;
      showSlide(nextIndex);
    }, 7500);
  }

  function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
  }

  startAutoSlide();
}

/* ==============================================================
   10. MODAL LISTENERS & FORM SUBMISSIONS
   ============================================================== */
function initModalListeners() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDoctorBookingModal();
      closeDoctorModal();
    }
  });

  const modals = [document.getElementById('doctorBookingModal'), document.getElementById('doctorProfileModal')];
  modals.forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
  });

  // Set minimum date to tomorrow
  const dateInput = document.getElementById('doctorBookingDate');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
  }
}

/* Doctor Consultation Booking Modal Handlers */
function openDoctorBookingModal(doctorPref = '') {
  const modal = document.getElementById('doctorBookingModal');
  if (modal) {
    if (doctorPref) {
      const select = document.getElementById('bookingDoctorSelect');
      if (select) select.value = doctorPref;
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeDoctorBookingModal() {
  const modal = document.getElementById('doctorBookingModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function handleDoctorBooking(event) {
  event.preventDefault();
  const status = document.getElementById('bookingStatus');
  const form = document.getElementById('bookingForm');
  
  if (status) {
    status.className = 'form-status success';
    status.innerHTML = `
      <strong>Doctor Consultation Confirmed</strong><br>
      The attending physician's clinical coordinator has received your diagnostic request and will contact you directly within 2 hours to confirm your private appointment.
    `;
    form.reset();
    setTimeout(() => {
      closeDoctorBookingModal();
      status.style.display = 'none';
    }, 4500);
  }
}

/* Newsletter Handler */
function handleNewsletter(event) {
  event.preventDefault();
  const status = document.getElementById('newsletterStatus');
  const form = document.getElementById('newsletterForm');

  if (status) {
    status.className = 'form-status success';
    status.innerHTML = `Thank you. You have been enrolled in Dr. Vance and Faculty's Clinical Research Dispatch.`;
    form.reset();
    setTimeout(() => {
      status.style.display = 'none';
    }, 5000);
  }
}

/* ==============================================================
   11. DOCTOR PROFILE QUICK-VIEW MODAL (DATA & RENDERER)
   ============================================================== */
const doctorData = {
  vance: {
    name: "Dr. Julian Vance, MD, FACS, FACC",
    title: "Chief of Cardiovascular & Thoracic Surgery",
    badge: "HARVARD MEDICAL SCHOOL FELLOW",
    location: "Tower A • Suite 401 (Zurich & New York)",
    consultFee: "$220.00 / 60 Min Initial Consult",
    experience: "24 Years Clinical Mastery",
    procedures: "3,400+ Heart Valve & Coronary Surgeries",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1000&q=80",
    bio: "Internationally renowned for pioneering sutureless aortic valve replacements and minimally invasive robotic coronary revascularization. Dr. Vance has trained over 120 thoracic fellows and holds 7 international surgical device patents.",
    credentials: [
      "MD, Harvard Medical School (Magna Cum Laude)",
      "Cardiovascular Surgical Residency, Johns Hopkins Hospital",
      "Fellow of the American College of Surgeons (FACS)",
      "Lead Investigator: Global Transcatheter Valve Durability Registry"
    ]
  },
  rostova: {
    name: "Dr. Elena Rostova, MD, PhD",
    title: "Director of Stereotactic Neurosurgery & Spine",
    badge: "KAROLINSKA INSTITUTE FELLOW",
    location: "Swiss Pavilion • Tower B (Geneva & Zurich)",
    consultFee: "$250.00 / 60 Min Initial Consult",
    experience: "19 Years Neurosurgical Innovation",
    procedures: "1,900+ Cranial & Robotic Spine Surgeries",
    image: "https://images.unsplash.com/photo-1594824813583-4a187d7b3ea0?auto=format&fit=crop&w=1000&q=80",
    bio: "Pioneer in intraoperative MRI-guided awake craniotomies and sub-millimeter robotic spinal instrumentation. Dr. Rostova is celebrated for her compassionate bedside manner and extraordinary nerve preservation success rates.",
    credentials: [
      "MD, PhD, Karolinska Institute (Stockholm)",
      "Fellowship in Functional Neurosurgery, Oxford University",
      "Editor-in-Chief: European Neurosurgery Quarterly",
      "Pioneer in Sub-Millimeter Cortical Eloquent Mapping"
    ]
  },
  pendelton: {
    name: "Dr. Arthur Pendelton, MD, PhD",
    title: "Chair of Precision Oncology & Targeted Therapeutics",
    badge: "JOHNS HOPKINS FACULTY CHAIR",
    location: "Genomic Pavilion • Level 5 (New York)",
    consultFee: "$280.00 / 60 Min Initial Consult",
    experience: "22 Years Translational Oncology",
    procedures: "420+ International Phase I-III Clinical Trials",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=1000&q=80",
    bio: "Dr. Pendelton merges whole-genome tumor sequencing with next-generation cellular therapies. His multidisciplinary tumor boards have designed custom immunotherapy regimens that have achieved long-term remission in refractory oncology cases.",
    credentials: [
      "MD, PhD in Molecular Oncology, Johns Hopkins University",
      "Senior Oncology Fellow, Memorial Sloan Kettering",
      "Member of the National Comprehensive Cancer Network (NCCN)",
      "Published in Nature Medicine and The Lancet Oncology"
    ]
  },
  sterling: {
    name: "Dr. Marcus Sterling, MD, FRCS",
    title: "Director of Robotic Orthopedic Arthroplasty",
    badge: "ROYAL COLLEGE OF SURGEONS (FRCS)",
    location: "Restorative Pavilion • North (London Harley Wing)",
    consultFee: "$200.00 / 60 Min Initial Consult",
    experience: "26 Years Orthopedic Engineering",
    procedures: "4,200+ Robotic Joint Reconstructions",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1000&q=80",
    bio: "Specializing in CT-guided robotic joint preservation, custom 3D titanium implants, and biological cartilage regeneration. Dr. Sterling's patients, from elite athletes to seniors, achieve same-day post-op walking with zero opioid protocols.",
    credentials: [
      "MBBS, MD, University of Oxford (Honours)",
      "Fellow of the Royal College of Surgeons (FRCS Orth)",
      "Consultant Orthopedic Surgeon to Olympic Athletic Boards",
      "Pioneer in Accelerating Hydrotherapy Knee Recovery Protocols"
    ]
  }
};

function openDoctorModal(id) {
  const doc = doctorData[id];
  if (!doc) return;

  const content = document.getElementById('doctorProfileContent');
  const modal = document.getElementById('doctorProfileModal');
  
  if (content && modal) {
    content.innerHTML = `
      <div class="specialty-modal-body">
        <div class="specialty-modal-media">
          <img src="${doc.image}" alt="${doc.name}" class="specialty-modal-img">
        </div>
        <div class="specialty-modal-info">
          <div class="section-tag-light" style="color: #C5A059; font-weight: 700;">${doc.badge}</div>
          <h3 style="font-size: 1.85rem; line-height: 1.15; margin-bottom: 0.35rem;">${doc.name}</h3>
          <p style="font-size: 0.85rem; color: #8C4A32; font-weight: 600; margin-bottom: 1.25rem;">${doc.title}</p>
          <p style="font-size: 0.9rem; line-height: 1.65; color: #5D635F; margin-bottom: 1.5rem;">${doc.bio}</p>
          
          <div class="spec-stats-list">
            <div class="spec-stat-item">
              <span class="spec-stat-num">${doc.experience.split(' ')[0]} ${doc.experience.split(' ')[1]}</span>
              <span class="spec-stat-lbl">CLINICAL MASTERY</span>
            </div>
            <div class="spec-stat-item">
              <span class="spec-stat-num">${doc.consultFee.split(' ')[0]}</span>
              <span class="spec-stat-lbl">60-MIN CONSULTATION</span>
            </div>
          </div>

          <div style="margin-bottom: 1.75rem;">
            <h4 style="font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 0.65rem; color: #19201D;">Credentials &amp; Fellowships:</h4>
            <ul style="display: flex; flex-direction: column; gap: 0.5rem;">
              ${doc.credentials.map(c => `
                <li style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; color: #19201D;">
                  <span style="color: #C5A059; font-weight: bold;">✦</span> ${c}
                </li>
              `).join('')}
            </ul>
          </div>

          <div style="display: flex; gap: 1rem;">
            <button class="btn btn-rust btn-pill magnetic-btn" onclick="closeDoctorModal(); openDoctorBookingModal('${id}');" data-cursor="BOOK">
              <span>SCHEDULE WITH ${doc.name.split(',')[0].toUpperCase()}</span>
              <i data-lucide="arrow-right" class="btn-arrow"></i>
            </button>
            <button class="btn btn-outline-dark btn-pill" onclick="closeDoctorModal()">
              <span>CLOSE</span>
            </button>
          </div>
        </div>
      </div>
    `;

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeDoctorModal() {
  const modal = document.getElementById('doctorProfileModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}


/* ==============================================================
   12. INNER PAGES INTERACTIVITY HELPERS
   ============================================================== */

// Check URL query parameters (e.g. ?doc=vance) on load
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const docParam = urlParams.get('doc');
  if (docParam && typeof openDoctorModal === 'function') {
    setTimeout(() => {
      openDoctorModal(docParam);
    }, 600);
  }
});

// Wing Blueprint Switcher in clinics.html
function switchWingTab(tabId) {
  const tabs = document.querySelectorAll('.wing-tab-btn');
  const panes = document.querySelectorAll('.wing-tab-pane');

  tabs.forEach(t => t.classList.remove('active'));
  panes.forEach(p => p.classList.remove('active'));

  const activeBtn = document.querySelector(`.wing-tab-btn[data-target="${tabId}"]`);
  const activePane = document.getElementById(tabId);

  if (activeBtn) activeBtn.classList.add('active');
  if (activePane) activePane.classList.add('active');
}

// Doctor Filter Pills in doctors.html
function filterDoctors(category) {
  const pills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.doc-dir-card');

  pills.forEach(p => p.classList.remove('active'));
  const activePill = document.querySelector(`.filter-pill[data-filter="${category}"]`);
  if (activePill) activePill.classList.add('active');

  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all' || cardCat === category) {
      card.style.display = 'flex';
      card.style.animation = 'fadeIn 0.5s ease forwards';
    } else {
      card.style.display = 'none';
    }
  });
}

// Multi-Step Form Stepper in contact.html
function nextFormStep(currentStep) {
  const step1 = document.getElementById('formStep1');
  const step2 = document.getElementById('formStep2');
  const ind1 = document.getElementById('stepInd1');
  const ind2 = document.getElementById('stepInd2');

  if (currentStep === 1 && step1 && step2) {
    step1.style.display = 'none';
    step2.style.display = 'block';
    if (ind1) ind1.classList.remove('active');
    if (ind2) ind2.classList.add('active');
  }
}

function prevFormStep(currentStep) {
  const step1 = document.getElementById('formStep1');
  const step2 = document.getElementById('formStep2');
  const ind1 = document.getElementById('stepInd1');
  const ind2 = document.getElementById('stepInd2');

  if (currentStep === 2 && step1 && step2) {
    step2.style.display = 'none';
    step1.style.display = 'block';
    if (ind2) ind2.classList.remove('active');
    if (ind1) ind1.classList.add('active');
  }
}
