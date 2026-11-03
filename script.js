// ============================================
// Dayna Studio — shared site script
// ============================================
(function () {
  'use strict';

  // ---------- Mobile menu ----------
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      navLinks.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
    // Close on link click (mobile)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
          navLinks.classList.remove('active');
          const icon = menuToggle.querySelector('i');
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // ---------- Dropdown toggle (mobile) ----------
  const dropdown = document.querySelector('.dropdown');
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  if (dropdown && dropdownToggle) {
    dropdownToggle.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle('open');
      }
    });
  }

  // ---------- FAQ accordion ----------
  document.querySelectorAll('.faq-item').forEach(function (item) {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');
      // close all others (single-open accordion)
      document.querySelectorAll('.faq-item.open').forEach(function (other) {
        if (other !== item) other.classList.remove('open');
      });
      if (isOpen) {
        item.classList.remove('open');
      } else {
        item.classList.add('open');
      }
    });
  });

  // ---------- Booking form ----------
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const submitBtn = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');
  const errorMsg = document.getElementById('formError');
  const btnText = submitBtn.querySelector('span');

  // Basic client-side validation
  function validateForm() {
    const name = form.querySelector('#fullName');
    const email = form.querySelector('#email');

    if (!name.value.trim() || name.value.trim().length < 2) {
      name.focus();
      return { ok: false, msg: 'Please enter your full name.' };
    }
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      email.focus();
      return { ok: false, msg: 'Please enter a valid email address.' };
    }
    return { ok: true };
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Honeypot check
    const honey = form.querySelector('input[name="_gotcha"]');
    if (honey && honey.value) {
      return; // silently ignore bots
    }

    const check = validateForm();
    if (!check.ok) {
      errorMsg.textContent = check.msg;
      errorMsg.hidden = false;
      successMsg.hidden = true;
      return;
    }

    // Loading state
    errorMsg.hidden = true;
    successMsg.hidden = true;
    submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Sending...';
    submitBtn.querySelector('i').className = 'fas fa-circle-notch fa-spin';

    // If the form action is still the placeholder, show helpful error
    if (form.action.indexOf('YOUR_FORMSPREE_ID') !== -1) {
      setTimeout(function () {
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Send Booking Request';
        submitBtn.querySelector('i').className = 'fas fa-paper-plane';
        errorMsg.textContent = 'Form endpoint not configured. Please contact us on WhatsApp.';
        errorMsg.hidden = false;
      }, 400);
      return;
    }

    // Send via fetch (Formspree)
    const data = new FormData(form);
    fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
      .then(function (res) {
        if (res.ok) {
          form.reset();
          successMsg.hidden = false;
        } else {
          errorMsg.hidden = false;
        }
      })
      .catch(function () {
        errorMsg.hidden = false;
      })
      .finally(function () {
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Send Booking Request';
        submitBtn.querySelector('i').className = 'fas fa-paper-plane';
      });
  });

  // Auto-close success message after a while
  // (optional) — leave visible so user can read it
})();