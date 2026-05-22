/* =========================================================
   Sakeena & Eshaan — Wedding Invitation
   Interactivity: countdown, reveal-on-scroll, calendar, music
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
    const nikahStart = new Date(2026, 5, 12, 18, 30); // 6:30 PM
    const nikahEnd   = new Date(2026, 5, 12, 19, 45); // 7:45 PM
    const recStart   = new Date(2026, 5, 12, 20, 0);  // 8:00 PM
    const recEnd     = new Date(2026, 5, 13, 0, 0);   // midnight

    const stamp = icsDate(new Date());
    const uid1  = 'nikah-' + stamp + '@sakeena-eshaan';
    const uid2  = 'walima-' + stamp + '@sakeena-eshaan';

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Sakeena & Eshaan//Wedding Invitation//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      // -- Nikah --
      'BEGIN:VEVENT',
      'UID:' + uid1,
      'DTSTAMP:' + stamp,
      'DTSTART:' + icsDate(nikahStart),
      'DTEND:' + icsDate(nikahEnd),
      'SUMMARY:Nikah — Sakeena Fatima & Eshaan Arif Syed',
      'DESCRIPTION:Nikah ceremony of Sakeena Fatima and Eshaan Arif Syed\\, after Asr prayer.',
      'LOCATION:[Masjid Name] — details to follow',
      'END:VEVENT',
      // -- Walima Reception --
      'BEGIN:VEVENT',
      'UID:' + uid2,
      'DTSTAMP:' + stamp,
      'DTSTART:' + icsDate(recStart),
      'DTEND:' + icsDate(recEnd),
      'SUMMARY:Walima Reception — Sakeena & Eshaan',
      'DESCRIPTION:Walima reception of Sakeena Fatima and Eshaan Arif Syed. https://kohinoorbanquet.com/',
      'LOCATION:Kohinoor Banquet Hall',
      'URL:https://kohinoorbanquet.com/',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    return ics;
  }

  // ---------- MUSIC TOGGLE ----------
  const musicBtn = document.getElementById('musicToggle');
  const audio = document.getElementById('bgMusic');

  if (musicBtn && audio) {
    musicBtn.addEventListener('click', async () => {
      try {
        if (audio.paused) {
          audio.volume = 0.45;
          await audio.play();
          musicBtn.classList.add('is-playing');
          musicBtn.setAttribute('title', 'Pause music');
          const label = musicBtn.querySelector('.music-label');
          if (label) label.textContent = 'Pause';
        } else {
          audio.pause();
          musicBtn.classList.remove('is-playing');
          musicBtn.setAttribute('title', 'Play music');
          const label = musicBtn.querySelector('.music-label');
          if (label) label.textContent = 'Music';
        }
      } catch (err) {
        // If no music.mp3 exists or playback is blocked, fail silently
        console.info('Music playback unavailable:', err && err.message);
        musicBtn.style.display = 'none';
      }
    });

    // Hide the button if the audio file is missing
    audio.addEventListener('error', () => {
      musicBtn.style.display = 'none';
    });
  }

})();
