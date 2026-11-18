/**
 * Hero Hospital - Premium Interactive Experience
 * Features: Left Dock Scrollspy, Sticky Header, Stats Counter,
 * 3D Tilt, Time Slot Chips, Appointment Booking & Ticket Generator,
 * Video Modal, Specialties Carousel, Toast System
 */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================================================
  // 1. Scroll Progress Indicator & Sticky Header
  // ========================================================================
  const progressBar = document.getElementById('scrollProgressBar');
  const siteHeader = document.querySelector('.site-header');
  const dockItems = document.querySelectorAll('.dock-item');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');

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

    // Top progress line
    if (progressBar) {
      progressBar.style.width = `${scrollFraction * 100}%`;
    }

    // Scrollspy for active dock and header links (Only for in-page anchors on index)
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      dockItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === `#${currentSectionId}` || href === `index.html#${currentSectionId}`) {
          item.classList.add('active');
        } else if (href.startsWith('#')) {
          item.classList.remove('active');
        }
      });

      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}` || href === `index.html#${currentSectionId}`) {
          link.classList.add('active');
        } else if (href.startsWith('#')) {
          link.classList.remove('active');
        }
      });
    }
  });

  // ========================================================================
  // 2. Animated Number Counters (Stats Bar)
  // ========================================================================
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  function runCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target') || '0', 10);
      const duration = 1800;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
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

  const statsBar = document.querySelector('.hospital-stats-bar');
  if (statsBar) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          runCounters();
        }
      });
    }, { threshold: 0.25 });

    observer.observe(statsBar);
  }

  // ========================================================================
  // 3. 3D Tilt Effect on Pedestal Specialty & Doctor Cards
  // ========================================================================
  const tiltCards = document.querySelectorAll('.pedestal-card, .specialist-doctor-card, .quick-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ========================================================================
  // 4. Modals Management: Appointment Booking & Video
  // ========================================================================
  const appointmentModal = document.getElementById('appointmentModal');
  const successModal = document.getElementById('appointmentSuccessModal');
  const videoModal = document.getElementById('videoModal');
  const bookingForm = document.getElementById('mainBookingForm');
  const modalCloseBtns = document.querySelectorAll('.close-modal-trigger');

  function openModal(modal) {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      const iframe = modal.querySelector('iframe');
      if (iframe) {
        iframe.src = iframe.src; // stop video
      }
    }
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      closeModal(modal);
    });
  }

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllModals();
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeAllModals();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // Open booking modal triggers
  document.querySelectorAll('.trigger-booking').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      // Check if button or closest card has prefill info
      const card = btn.closest('.specialist-doctor-card') || btn.closest('.pedestal-card');
      const docName = card?.getAttribute('data-doctor');
      const deptName = card?.getAttribute('data-dept');

      const deptSelect = document.getElementById('dialogDeptSelect');
      const docSelect = document.getElementById('dialogDocSelect');

      if (deptName && deptSelect) {
        for (let opt of deptSelect.options) {
          if (opt.value.toLowerCase().includes(deptName.toLowerCase()) || opt.text.toLowerCase().includes(deptName.toLowerCase())) {
            opt.selected = true;
            break;
          }
        }
      }

      if (docName && docSelect) {
        for (let opt of docSelect.options) {
          if (opt.text.toLowerCase().includes(docName.toLowerCase())) {
            opt.selected = true;
            break;
          }
        }
      }

      // Default date to tomorrow
      const dateInput = document.getElementById('dialogDateInput');
      if (dateInput && !dateInput.value) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
      }

      openModal(appointmentModal);
    });
  });

  // Watch video button trigger
  const watchStoryBtn = document.getElementById('watchStoryBtn');
  if (watchStoryBtn) {
    watchStoryBtn.addEventListener('click', () => {
      openModal(videoModal);
    });
  }

  // Time Slot Selection Chips
  const timeChips = document.querySelectorAll('.time-slot-chip');
  const timeInput = document.getElementById('dialogTimeInput');

  timeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      timeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const selectedTime = chip.getAttribute('data-time');
      if (timeInput) {
        timeInput.value = selectedTime;
      }
      showToast(`Selected slot: ${selectedTime}`);
    });
  });

  // Handle Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const department = document.getElementById('dialogDeptSelect')?.value || 'Cardiology';
      const doctor = document.getElementById('dialogDocSelect')?.value || 'Any Available Specialist';
      const date = document.getElementById('dialogDateInput')?.value || 'Tomorrow';
      const time = timeInput?.value || '09:30 AM';
      const patient = document.getElementById('dialogPatientName')?.value || 'Valued Patient';

      // Fill Ticket Details
      document.getElementById('ticketDept').textContent = department;
      document.getElementById('ticketDoc').textContent = doctor;
      document.getElementById('ticketDate').textContent = date;
      document.getElementById('ticketTime').textContent = time;
      document.getElementById('ticketPatient').textContent = patient;
      document.getElementById('ticketId').textContent = 'HH-' + Math.floor(100000 + Math.random() * 900000);

      // Transition modals
      closeModal(appointmentModal);
      setTimeout(() => {
        openModal(successModal);
        showToast('Appointment booked successfully!');
      }, 250);

      bookingForm.reset();
    });
  }

  // ========================================================================
  // 5. Specialties Carousel Controls
  // ========================================================================
  const specPrev = document.getElementById('specPrev');
  const specNext = document.getElementById('specNext');
  const specGrid = document.getElementById('specialitiesGrid');

  if (specGrid && specPrev && specNext) {
    specPrev.addEventListener('click', () => {
      specGrid.scrollBy({ left: -260, behavior: 'smooth' });
    });
    specNext.addEventListener('click', () => {
      specGrid.scrollBy({ left: 260, behavior: 'smooth' });
    });
  }

  // Clicking on any specialty card pre-fills booking
  document.querySelectorAll('.pedestal-card').forEach(card => {
    card.addEventListener('click', () => {
      const dept = card.getAttribute('data-dept');
      showToast(`Selected Department: ${dept}`);
      const deptSelect = document.getElementById('dialogDeptSelect');
      if (deptSelect && dept) {
        for (let opt of deptSelect.options) {
          if (opt.value.toLowerCase().includes(dept.toLowerCase()) || opt.text.toLowerCase().includes(dept.toLowerCase())) {
            opt.selected = true;
            break;
          }
        }
      }
      openModal(appointmentModal);
    });
  });

  // ========================================================================
  // 6. Toast Notification Helper
  // ========================================================================
  function showToast(message) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="color:#FF6B35">✦</span> <span>${message}</span>`;
    toast.classList.add('show');
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // ========================================================================
  // 7. Mobile Navigation Drawer Toggle & Auto Close
  // ========================================================================
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navCenter = document.querySelector('.nav-center');

  if (mobileToggle && navCenter) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileToggle.classList.toggle('active');
      navCenter.classList.toggle('open');
    });

    // Close when clicking nav links
    navCenter.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navCenter.classList.remove('open');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navCenter.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileToggle.classList.remove('active');
        navCenter.classList.remove('open');
      }
    });
  }

  // ========================================================================
  // 8. Doctors Page: Live Search, Specialty Dropdown & Count Filter
  // ========================================================================
  const docSearchInput = document.getElementById('doctorSearchInput');
  const deptFilterSelect = document.getElementById('deptFilterSelect');
  const filterResultsCount = document.getElementById('filterResultsCount');
  const docCards = document.querySelectorAll('.doc-dir-card');

  function filterDoctors() {
    if (!docCards.length) return;

    const searchTerm = (docSearchInput?.value || '').toLowerCase().trim();
    const selectedDept = (deptFilterSelect?.value || 'all').toLowerCase();
    let visibleCount = 0;

    docCards.forEach(card => {
      const name = (card.querySelector('.doc-card-name')?.textContent || '').toLowerCase();
      const spec = (card.querySelector('.doc-card-specialty')?.textContent || '').toLowerCase();
      const dept = (card.getAttribute('data-dept') || '').toLowerCase();
      const creds = (card.querySelector('.doc-card-creds')?.textContent || '').toLowerCase();

      const matchesSearch = !searchTerm || name.includes(searchTerm) || spec.includes(searchTerm) || creds.includes(searchTerm);
      const matchesDept = selectedDept === 'all' || dept.includes(selectedDept) || spec.includes(selectedDept);

      if (matchesSearch && matchesDept) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (filterResultsCount) {
      filterResultsCount.textContent = `Showing ${visibleCount} Specialists`;
    }
  }

  if (docSearchInput) {
    docSearchInput.addEventListener('input', filterDoctors);
  }
  if (deptFilterSelect) {
    deptFilterSelect.addEventListener('change', filterDoctors);
  }

  // Hook into direct "Book Consultation" from Doctor cards
  document.querySelectorAll('.btn-book-doc').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.doc-dir-card');
      const docName = card?.querySelector('.doc-card-name')?.textContent || '';
      const deptName = card?.getAttribute('data-dept') || '';

      const deptSelect = document.getElementById('dialogDeptSelect');
      const docSelect = document.getElementById('dialogDocSelect');

      if (deptName && deptSelect) {
        for (let opt of deptSelect.options) {
          if (opt.value.toLowerCase().includes(deptName.toLowerCase()) || opt.text.toLowerCase().includes(deptName.toLowerCase())) {
            opt.selected = true;
            break;
          }
        }
      }

      if (docName && docSelect) {
        for (let opt of docSelect.options) {
          if (opt.text.toLowerCase().includes(docName.toLowerCase())) {
            opt.selected = true;
            break;
          }
        }
      }

      openModal(appointmentModal);
    });
  });

  // ========================================================================
  // 9. Specialties Page: Category Filter Pills & Search
  // ========================================================================
  const specSearchInput = document.getElementById('specSearchInput');
  const specPills = document.querySelectorAll('.spec-filter-pill');
  const bentoCards = document.querySelectorAll('.bento-card');

  function filterSpecialties(categoryTerm, queryTerm) {
    if (!bentoCards.length) return;
    const cat = (categoryTerm || 'all').toLowerCase();
    const query = (queryTerm || '').toLowerCase().trim();

    bentoCards.forEach(card => {
      const title = (card.querySelector('.bento-title')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.bento-desc')?.textContent || '').toLowerCase();
      const dept = (card.getAttribute('data-dept') || '').toLowerCase();
      const tags = (card.querySelector('.bento-tags')?.textContent || '').toLowerCase();

      const matchesCat = cat === 'all' || dept.includes(cat) || title.includes(cat);
      const matchesQuery = !query || title.includes(query) || desc.includes(query) || tags.includes(query);

      if (matchesCat && matchesQuery) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  specPills.forEach(pill => {
    pill.addEventListener('click', () => {
      specPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.getAttribute('data-filter') || 'all';
      filterSpecialties(cat, specSearchInput?.value || '');
    });
  });

  if (specSearchInput) {
    specSearchInput.addEventListener('input', () => {
      const activePill = document.querySelector('.spec-filter-pill.active');
      const cat = activePill ? activePill.getAttribute('data-filter') : 'all';
      filterSpecialties(cat, specSearchInput.value);
    });
  }

  // ========================================================================
  // 10. Facilities Page: Room Accommodation Tab Switcher
  // ========================================================================
  const roomTabBtns = document.querySelectorAll('.room-tab-btn');
  const roomPanels = document.querySelectorAll('.room-panel');

  roomTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetRoom = btn.getAttribute('data-room');
      roomTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      roomPanels.forEach(panel => {
        if (panel.id === targetRoom) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // ========================================================================
  // 11. Contact Page: FAQ Accordion Toggle & Inquiry Form Handler
  // ========================================================================
  const faqItems = document.querySelectorAll('.faq-accordion-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });

  const inquiryForm = document.getElementById('contactInquiryForm');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const patientName = document.getElementById('inquiryName')?.value || 'Valued Patient';
      showToast(`Thank you, ${patientName}! Your query has been logged. Our coordinator will contact you shortly.`);
      inquiryForm.reset();
    });
  }

});
