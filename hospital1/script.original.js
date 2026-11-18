/**
 * Hero Hospital - Interactive Scripts & Animations
 * Features: 3D Tilt, Parallax, Number Counters, Scroll Progress,
 * Time Slot Selector, Department Filters, Hotspots, Toast & Booking Modals
 */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================================================
  // 1. Scroll Progress Bar & Sticky Header
  // ========================================================================
  const progressBar = document.getElementById('scrollProgressBar');
  const siteHeader = document.querySelector('.site-header');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const progressRingCircle = document.querySelector('.progress-ring-circle');
  const circleCircumference = 2 * Math.PI * 23; // r=23 => ~144.5px

  if (progressRingCircle) {
    progressRingCircle.style.strokeDasharray = `${circleCircumference}`;
    progressRingCircle.style.strokeDashoffset = `${circleCircumference}`;
  }

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = docHeight > 0 ? scrollTop / docHeight : 0;

    // Header sticky shadow
    if (scrollTop > 20) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    // Top horizontal progress bar
    if (progressBar) {
      progressBar.style.width = `${scrollFraction * 100}%`;
    }

    // Back to top circular button
    if (backToTopBtn && progressRingCircle) {
      if (scrollTop > 300) {
        backToTopBtn.classList.add('visible');
        const offset = circleCircumference - (scrollFraction * circleCircumference);
        progressRingCircle.style.strokeDashoffset = offset;
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ========================================================================
  // 2. Animated Number Counters
  // ========================================================================
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  function runCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target') || '0', 10);
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quad
        const easeOut = 1 - (1 - progress) * (1 - progress);
        const currentCount = Math.floor(easeOut * target);

        counter.textContent = currentCount;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // Trigger counters with Intersection Observer
  const statsRow = document.querySelector('.hero-stats-row');
  if (statsRow) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          runCounters();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsRow);
  }

  // ========================================================================
  // 3. 3D Tilt Effect on Interactive Cards
  // ========================================================================
  const tiltCards = document.querySelectorAll('.floating-booking-card, .specialty-card, .doctor-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6; // Max 6 deg
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ========================================================================
  // 4. Scroll Reveal Animations (Intersection Observer)
  // ========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  // ========================================================================
  // 5. Mobile Navigation Menu Toggle & Auto-Close
  // ========================================================================
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any nav link or action button
    navMenu.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ========================================================================
  // 6. Time Slot Quick Select Chips
  // ========================================================================
  const timeChips = document.querySelectorAll('.time-chip-btn');
  const timeInput = document.getElementById('bookingTimeInput');

  timeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      timeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const selectedTime = chip.getAttribute('data-time');
      if (timeInput) {
        timeInput.value = selectedTime;
      }
      showToast(`Selected time slot: ${chip.textContent}`);
    });
  });

  // ========================================================================
  // 7. Booking Form Submission & Confirmation Modal
  // ========================================================================
  const heroBookingForm = document.getElementById('heroBookingForm');
  const appointmentModal = document.getElementById('appointmentSuccessModal');
  const modalCloseBtns = document.querySelectorAll('.close-modal-trigger');

  function handleBookingSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const department = form.querySelector('[name="department"]')?.value || 'General Medicine';
    const doctor = form.querySelector('[name="doctor"]')?.value || 'Any Available Specialist';
    const date = form.querySelector('[name="date"]')?.value || new Date().toISOString().split('T')[0];
    const time = form.querySelector('[name="time"]')?.value || '10:00';

    // Populate Modal Ticket
    document.getElementById('ticketDept').textContent = department;
    document.getElementById('ticketDoc').textContent = doctor;
    document.getElementById('ticketDate').textContent = date;
    document.getElementById('ticketTime').textContent = time;
    document.getElementById('ticketId').textContent = 'HH-' + Math.floor(100000 + Math.random() * 900000);

    // Open Modal
    appointmentModal.classList.add('active');
    form.reset();
  }

  if (heroBookingForm) {
    heroBookingForm.addEventListener('submit', handleBookingSubmit);
  }

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('active');
      });
      const videoIframe = document.getElementById('storyVideoIframe');
      if (videoIframe) {
        videoIframe.src = videoIframe.src;
      }
    });
  });

  // Backdrop click to dismiss
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        const videoIframe = document.getElementById('storyVideoIframe');
        if (videoIframe) {
          videoIframe.src = videoIframe.src;
        }
      }
    });
  });

  // ========================================================================
  // 8. Video Modal ("Watch Our Story")
  // ========================================================================
  const watchStoryBtn = document.getElementById('watchStoryBtn');
  const videoModal = document.getElementById('videoModal');
  if (watchStoryBtn && videoModal) {
    watchStoryBtn.addEventListener('click', (e) => {
      e.preventDefault();
      videoModal.classList.add('active');
    });
  }

  // ========================================================================
  // 9. Department Cards Carousel & Pre-fill Booking
  // ========================================================================
  const specCards = document.querySelectorAll('.specialty-card');
  const specGrid = document.getElementById('specialitiesGrid');
  const specPrev = document.getElementById('specPrev');
  const specNext = document.getElementById('specNext');

  if (specGrid && specPrev && specNext) {
    specPrev.addEventListener('click', () => {
      specGrid.scrollBy({ left: -260, behavior: 'smooth' });
    });
    specNext.addEventListener('click', () => {
      specGrid.scrollBy({ left: 260, behavior: 'smooth' });
    });
  }

  // Department Card Click Pre-fills Form
  specCards.forEach(card => {
    card.addEventListener('click', () => {
      const dept = card.getAttribute('data-dept') || card.querySelector('.spec-name')?.textContent;
      showToast(`Selected Department: ${dept}`);
      const deptSelect = document.getElementById('deptSelect');
      if (deptSelect) {
        for (let option of deptSelect.options) {
          if (option.text.toLowerCase().includes(dept.toLowerCase())) {
            option.selected = true;
            break;
          }
        }
      }
      const bookingCard = document.querySelector('.floating-booking-card');
      if (bookingCard) {
        bookingCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // ========================================================================
  // 10. Doctor Cards Click Interaction
  // ========================================================================
  const doctorCards = document.querySelectorAll('.doctor-card');
  doctorCards.forEach(card => {
    card.addEventListener('click', () => {
      const docName = card.querySelector('.doctor-name')?.textContent || 'Specialist';
      showToast(`Selected ${docName} for appointment.`);
      const bookingCard = document.querySelector('.floating-booking-card');
      if (bookingCard) {
        bookingCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const docSelect = document.getElementById('doctorSelect');
        if (docSelect) {
          for (let option of docSelect.options) {
            if (option.text.includes(docName)) {
              option.selected = true;
              break;
            }
          }
        }
      }
    });
  });

  // ========================================================================
  // 11. Testimonials Carousel Controls
  // ========================================================================
  const testPrev = document.getElementById('testPrev');
  const testNext = document.getElementById('testNext');
  const testGrid = document.querySelector('.testimonials-grid');

  if (testGrid && testPrev && testNext) {
    testPrev.addEventListener('click', () => {
      testGrid.scrollBy({ left: -360, behavior: 'smooth' });
      showToast('Viewing previous review');
    });
    testNext.addEventListener('click', () => {
      testGrid.scrollBy({ left: 360, behavior: 'smooth' });
      showToast('Viewing next review');
    });
  }

  // ========================================================================
  // 12. Hotspot Pins Click Feedback
  // ========================================================================
  const hotspots = document.querySelectorAll('.tech-hotspot');
  hotspots.forEach(spot => {
    spot.addEventListener('click', () => {
      const info = spot.querySelector('.hotspot-tooltip')?.textContent || 'Feature Spec';
      showToast(`Technology detail: ${info}`);
    });
  });

  // ========================================================================
  // 13. Toast Notification Function
  // ========================================================================
  function showToast(message) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="color:#C5A059">✦</span><span>${message}</span>`;
    toast.classList.add('show');
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // ========================================================================
  // 14. Ripple Effect on Button Clicks
  // ========================================================================
  document.querySelectorAll('.magnetic-btn, .btn-primary, .btn-book-nav').forEach(button => {
    button.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('click-ripple');

      const ripple = this.querySelector('.click-ripple');
      if (ripple) {
        ripple.remove();
      }

      this.appendChild(circle);
    });
  });

  // Trigger Booking Button Handler
  document.querySelectorAll('.trigger-booking').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const bookingCard = document.querySelector('.floating-booking-card');
      if (bookingCard) {
        bookingCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

});
