/* =========================================================
   Sakeena & Eshaan — Wedding Invitation
   Interactivity: countdown, reveal-on-scroll, calendar
   ========================================================= */

(function () {
  'use strict';

  // ---------- WEDDING DATE ----------
  // June 12, 2026, 6:30 PM local time (Asr-ish)
  const WEDDING = new Date(2026, 5, 12, 18, 30, 0); // month is 0-indexed: 5 = June

  // ---------- COUNTDOWN ----------
  const els = {
    days:  document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins:  document.getElementById('cd-mins'),
    secs:  document.getElementById('cd-secs'),
  };

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const diff = WEDDING.getTime() - Date.now();

    if (diff <= 0) {
      els.days.textContent  = '00';
      els.hours.textContent = '00';
      els.mins.textContent  = '00';
      els.secs.textContent  = '00';
      return;
    }

    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins  = Math.floor((diff / (1000 * 60)) % 60);
    const secs  = Math.floor((diff / 1000) % 60);

    els.days.textContent  = pad(days);
    els.hours.textContent = pad(hours);
    els.mins.textContent  = pad(mins);
    els.secs.textContent  = pad(secs);
  }
  tick();
  setInterval(tick, 1000);

  // ---------- REVEAL ON SCROLL ----------
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  } else {
    // Fallback for ancient browsers — just show everything
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  }

  // ---------- ADD TO CALENDAR (.ics download) ----------
  const calBtn = document.getElementById('addToCal');
  if (calBtn) {
    calBtn.addEventListener('click', () => {
      const icsText = buildICS();
      const blob = new Blob([icsText], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sakeena-eshaan-wedding.ics';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }

  function icsDate(d) {
    // Format: YYYYMMDDTHHMMSS (floating local time)
    return d.getFullYear()
      + pad(d.getMonth() + 1)
      + pad(d.getDate())
      + 'T'
      + pad(d.getHours())
      + pad(d.getMinutes())
      + pad(d.getSeconds());
  }

  function buildICS() {
    // Nikah Ceremony — Friday, June 12, 2026 at Kohinoor (after Asr + dinner)
    const nikahStart = new Date(2026, 5, 12, 18, 30); // 6:30 PM
    const nikahEnd   = new Date(2026, 5, 12, 22, 0);  // 10:00 PM (incl. dinner)

    // Walima — Sunday, June 14, 2026 at ICCD (time TBA — using all-day block for now)
    const walimaStart = new Date(2026, 5, 14, 17, 0); // 5:00 PM placeholder
    const walimaEnd   = new Date(2026, 5, 14, 22, 0); // 10:00 PM placeholder

    const stamp = icsDate(new Date());
    const uid1  = 'nikah-' + stamp + '@sakeena-eshaan';
    const uid2  = 'walima-' + stamp + '@sakeena-eshaan';

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Sakeena & Eshaan//Wedding Invitation//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      // -- Nikah Ceremony --
      'BEGIN:VEVENT',
      'UID:' + uid1,
      'DTSTAMP:' + stamp,
      'DTSTART:' + icsDate(nikahStart),
      'DTEND:' + icsDate(nikahEnd),
      'SUMMARY:Nikah — Sakeena Fatima & Eshaan Arif Syed',
      'DESCRIPTION:Nikah ceremony after Asr prayer\\, followed by dinner. https://kohinoorbanquet.com/',
      'LOCATION:Kohinoor Banquet Hall',
      'URL:https://maps.app.goo.gl/YTYjiBimg1Jiwysb7',
      'END:VEVENT',
      // -- Walima --
      'BEGIN:VEVENT',
      'UID:' + uid2,
      'DTSTAMP:' + stamp,
      'DTSTART:' + icsDate(walimaStart),
      'DTEND:' + icsDate(walimaEnd),
      'SUMMARY:Walima — Sakeena & Eshaan',
      'DESCRIPTION:Walima reception of Sakeena Fatima and Eshaan Arif Syed. Time to be confirmed.',
      'LOCATION:Islamic Community Center of Des Plaines',
      'URL:https://maps.app.goo.gl/itAmo8YgSmXL8e5t8',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    return ics;
  }

  // ---------- THEME SWITCHER ----------
  const THEMES = {
    ivory:      'Ivory & Gold',
    blush:      'Blush & Rose',
    sage:       'Sage Garden',
    terracotta: 'Terracotta & Bronze',
    lavender:   'Lavender & Silver',
    burgundy:   'Royal Burgundy',
    emerald:    'Emerald & Gold',
    plum:       'Plum & Gold',
    midnight:   'Midnight & Pearl',
    charcoal:   'Charcoal & Rose Gold',
  };

  const themeBtn   = document.getElementById('themeBtn');
  const themeList  = document.getElementById('themeList');
  const themeName  = document.getElementById('themeName');
  const themeSwatch= document.getElementById('themeSwatch');

  function applyTheme(theme) {
    if (!THEMES[theme]) theme = 'ivory';
    if (theme === 'ivory') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    themeName.textContent = THEMES[theme];

    // Mirror swatch from the matching option's style for visual consistency
    const matching = themeList.querySelector('[data-theme="' + theme + '"] .theme-swatch');
    if (matching && matching.getAttribute('style')) {
      themeSwatch.setAttribute('style', matching.getAttribute('style'));
    }

    // Update selected state for accessibility + visual checkmark
    themeList.querySelectorAll('[role=option]').forEach((li) => {
      li.setAttribute('aria-selected', li.dataset.theme === theme ? 'true' : 'false');
    });

    try { localStorage.setItem('weddingTheme', theme); } catch (e) {}
  }

  const isLocked = document.documentElement.hasAttribute('data-theme-locked');

  if (themeBtn && themeList && !isLocked) {
    // Initial state — read what the head-script applied (default = ivory)
    const initial = document.documentElement.getAttribute('data-theme') || 'ivory';
    applyTheme(initial);

    themeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = themeBtn.getAttribute('aria-expanded') === 'true';
      if (open) {
        themeList.hidden = true;
        themeBtn.setAttribute('aria-expanded', 'false');
      } else {
        themeList.hidden = false;
        themeBtn.setAttribute('aria-expanded', 'true');
      }
    });

    themeList.addEventListener('click', (e) => {
      const li = e.target.closest('[role=option]');
      if (!li) return;
      applyTheme(li.dataset.theme);
      themeList.hidden = true;
      themeBtn.setAttribute('aria-expanded', 'false');
    });

    // Close on outside click or Escape
    document.addEventListener('click', (e) => {
      if (!themeBtn.contains(e.target) && !themeList.contains(e.target)) {
        themeList.hidden = true;
        themeBtn.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        themeList.hidden = true;
        themeBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

})();
