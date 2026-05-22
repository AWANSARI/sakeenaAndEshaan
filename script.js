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

})();
