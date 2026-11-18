/**
 * Hero Hospital - Inner Pages Interactive Logic
 * Handles: Department filtering, Doctor search & department filtering,
 * FAQ accordions, Doctor credential modal, Contact form validation,
 * Hotspot popups, and Pre-filled Booking Triggers.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================================================
  // 1. FAQ Accordion Toggle
  // ========================================================================
  const faqButtons = document.querySelectorAll('.faq-question-btn');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentItem = btn.closest('.faq-item');
      const wasActive = parentItem.classList.contains('active');

      // Close siblings in the same accordion group if desired
      const siblingItems = parentItem.parentElement.querySelectorAll('.faq-item');
      siblingItems.forEach(item => item.classList.remove('active'));

      if (!wasActive) {
        parentItem.classList.add('active');
      }
    });
  });

  // ========================================================================
  // 2. Department Filter Pills (`departments.html`)
  // ========================================================================
  const deptFilterPills = document.querySelectorAll('.dept-filter-pill');
  const deptCards = document.querySelectorAll('.dept-card-showcase');

  if (deptFilterPills.length > 0 && deptCards.length > 0) {
    deptFilterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        deptFilterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const filterValue = pill.getAttribute('data-filter');

        deptCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'grid';
            card.style.animation = 'fadeInUp 0.4s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });

        // Trigger toast
        showInnerToast(`Showing: ${pill.textContent.trim()}`);
      });
    });
  }

  // ========================================================================
  // 3. Doctors Search & Filter Console (`doctors.html`)
  // ========================================================================
  const doctorSearchInput = document.getElementById('doctorSearchInput');
  const deptSelectFilter = document.getElementById('deptSelectFilter');
  const availFilterPills = document.querySelectorAll('.avail-filter-pill');
  const doctorCards = document.querySelectorAll('.doc-directory-card');
  const doctorCountBadge = document.getElementById('doctorCountBadge');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');

  function filterDoctors() {
    if (!doctorCards.length) return;

    const query = (doctorSearchInput?.value || '').toLowerCase().trim();
    const selectedDept = (deptSelectFilter?.value || 'all').toLowerCase();
    const activeAvail = document.querySelector('.avail-filter-pill.active')?.getAttribute('data-avail') || 'all';

    let visibleCount = 0;

    doctorCards.forEach(card => {
      const name = (card.querySelector('.doc-full-name')?.textContent || '').toLowerCase();
      const dept = (card.querySelector('.doc-dept-badge')?.textContent || '').toLowerCase();
      const designation = (card.querySelector('.doc-designation')?.textContent || '').toLowerCase();
      const isAvailableToday = card.getAttribute('data-avail') === 'today';

      const matchesQuery = !query || name.includes(query) || dept.includes(query) || designation.includes(query);
      const matchesDept = (selectedDept === 'all') || dept.includes(selectedDept);
      const matchesAvail = (activeAvail === 'all') || (activeAvail === 'today' && isAvailableToday);

      if (matchesQuery && matchesDept && matchesAvail) {
        card.style.display = 'flex';
        card.style.animation = 'fadeInUp 0.35s ease forwards';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (doctorCountBadge) {
      doctorCountBadge.textContent = visibleCount;
    }
  }

  if (doctorSearchInput) {
    doctorSearchInput.addEventListener('input', filterDoctors);
  }
  if (deptSelectFilter) {
    deptSelectFilter.addEventListener('change', filterDoctors);
  }
  if (availFilterPills.length > 0) {
    availFilterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        availFilterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        filterDoctors();
      });
    });
  }
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      if (doctorSearchInput) doctorSearchInput.value = '';
      if (deptSelectFilter) deptSelectFilter.value = 'all';
      availFilterPills.forEach(p => p.classList.remove('active'));
      const firstAvail = document.querySelector('.avail-filter-pill[data-avail="all"]');
      if (firstAvail) firstAvail.classList.add('active');
      filterDoctors();
      showInnerToast('Doctor filters reset');
    });
  }

  // ========================================================================
  // 4. Doctor Profile Modal Trigger (`doctors.html`)
  // ========================================================================
  const viewProfileBtns = document.querySelectorAll('.view-doc-profile-btn');
  const docProfileModal = document.getElementById('doctorProfileModal');
  const modalDocImg = document.getElementById('modalDocImg');
  const modalDocName = document.getElementById('modalDocName');
  const modalDocDept = document.getElementById('modalDocDept');
  const modalDocCreds = document.getElementById('modalDocCreds');
  const modalDocExp = document.getElementById('modalDocExp');
  const modalDocBio = document.getElementById('modalDocBio');

  viewProfileBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.doc-directory-card');
      if (!card) return;

      const name = card.querySelector('.doc-full-name')?.textContent;
      const dept = card.querySelector('.doc-dept-badge')?.textContent;
      const creds = card.querySelector('.doc-designation')?.textContent;
      const exp = card.getAttribute('data-exp') || '15+ Years';
      const imgSrc = card.querySelector('.doc-card-top img')?.src;
      const bio = card.getAttribute('data-bio') || `${name} is an internationally acclaimed specialist with extensive expertise in advanced clinical procedures, dedicated to compassionate, evidence-based patient recovery.`;

      if (modalDocName) modalDocName.textContent = name;
      if (modalDocDept) modalDocDept.textContent = dept;
      if (modalDocCreds) modalDocCreds.textContent = creds;
      if (modalDocExp) modalDocExp.textContent = exp;
      if (modalDocImg && imgSrc) modalDocImg.src = imgSrc;
      if (modalDocBio) modalDocBio.textContent = bio;

      if (docProfileModal) {
        docProfileModal.classList.add('active');
      }
    });
  });

  // ========================================================================
  // 5. Direct Doctor Appointment Pre-fill Button
  // ========================================================================
  const bookDoctorBtns = document.querySelectorAll('.book-doctor-btn');
  const appointmentModal = document.getElementById('appointmentSuccessModal');
  const quickBookingModal = document.getElementById('quickBookingModal');

  bookDoctorBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.doc-directory-card, .dept-card-showcase');
      const docName = btn.getAttribute('data-doctor') || card?.querySelector('.doc-full-name, .lead-doc-name')?.textContent || 'Medical Specialist';
      const deptName = btn.getAttribute('data-department') || card?.querySelector('.doc-dept-badge, .dept-heading')?.textContent || 'General Medicine';

      // If quickBookingModal exists, populate fields and open
      const bookingDocSelect = document.getElementById('bookingModalDoctor');
      const bookingDeptSelect = document.getElementById('bookingModalDept');

      if (bookingDocSelect) {
        for (let opt of bookingDocSelect.options) {
          if (opt.text.toLowerCase().includes(docName.toLowerCase())) {
            opt.selected = true;
            break;
          }
        }
      }

      if (bookingDeptSelect) {
        for (let opt of bookingDeptSelect.options) {
          if (opt.text.toLowerCase().includes(deptName.toLowerCase())) {
            opt.selected = true;
            break;
          }
        }
      }

      if (quickBookingModal) {
        quickBookingModal.classList.add('active');
      } else {
        // Fallback: If on another page without quick modal, scroll to booking or redirect
        window.location.href = `index.html#specialities`;
      }
    });
  });

  // Handle Quick Modal Booking Form Submission
  const quickBookingForm = document.getElementById('quickBookingForm');
  if (quickBookingForm) {
    quickBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const dept = form.querySelector('[name="department"]')?.value || 'General Medicine';
      const doc = form.querySelector('[name="doctor"]')?.value || 'Senior Consultant';
      const date = form.querySelector('[name="date"]')?.value || new Date().toISOString().split('T')[0];
      const time = form.querySelector('[name="time"]')?.value || '10:30 AM';

      if (quickBookingModal) quickBookingModal.classList.remove('active');

      // Populate Ticket Confirmation Modal
      if (document.getElementById('ticketDept')) document.getElementById('ticketDept').textContent = dept;
      if (document.getElementById('ticketDoc')) document.getElementById('ticketDoc').textContent = doc;
      if (document.getElementById('ticketDate')) document.getElementById('ticketDate').textContent = date;
      if (document.getElementById('ticketTime')) document.getElementById('ticketTime').textContent = time;
      if (document.getElementById('ticketId')) document.getElementById('ticketId').textContent = 'HH-' + Math.floor(100000 + Math.random() * 900000);

      if (appointmentModal) {
        appointmentModal.classList.add('active');
      }
      form.reset();
    });
  }

  // ========================================================================
  // 6. Contact & Inquiry Form Submission (`contact.html`)
  // ========================================================================
  const contactInquiryForm = document.getElementById('contactInquiryForm');
  if (contactInquiryForm) {
    contactInquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactInquiryForm.querySelector('[name="fullName"]')?.value || 'Valued Patient';
      showInnerToast(`Thank you, ${name}! Your inquiry has been routed to our patient desk.`);
      contactInquiryForm.reset();
    });
  }

  // ========================================================================
  // 7. Hotspot Interactive Details (`facilities.html`)
  // ========================================================================
  const hotspotNodes = document.querySelectorAll('.hotspot-interactive-node');
  hotspotNodes.forEach(node => {
    node.addEventListener('click', () => {
      const title = node.querySelector('.hotspot-popup-title')?.textContent || 'Facility Feature';
      showInnerToast(`Inspecting: ${title}`);
    });
  });

  // ========================================================================
  // 8. Shared Modal Close Handlers
  // ========================================================================
  document.querySelectorAll('.close-modal-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('active');
      });
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  // ========================================================================
  // 9. Toast Notification Utility
  // ========================================================================
  function showInnerToast(msg) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="color:#C5A059">✦</span><span>${msg}</span>`;
    toast.classList.add('show');
    clearTimeout(window.innerToastTimer);
    window.innerToastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

});
