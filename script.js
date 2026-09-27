(function () {
  var root = document.documentElement;
  var toggleBtn = document.getElementById('theme-toggle');
  var STORAGE_KEY = 'bert-portfolio-theme';

  // theme: read saved pref, else system pref
  function getPreferredTheme() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (toggleBtn) {
      var isDark = theme === 'dark';
      toggleBtn.setAttribute('aria-pressed', String(isDark));
      toggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  applyTheme(getPreferredTheme());

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      var current = root.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    });
  }

  // keep following the system/browser color scheme live, as long as
  // the person hasn't explicitly picked a theme themselves
  if (window.matchMedia) {
    var colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    var onSchemeChange = function (e) {
      if (localStorage.getItem(STORAGE_KEY)) return;
      applyTheme(e.matches ? 'dark' : 'light');
    };
    if (colorSchemeQuery.addEventListener) {
      colorSchemeQuery.addEventListener('change', onSchemeChange);
    } else if (colorSchemeQuery.addListener) {
      colorSchemeQuery.addListener(onSchemeChange);
    }
  }

  // seasonal decorations: cycles none -> christmas -> none -> halloween -> ...
  // (always passing through "none" between the two so switching never
  // looks like it glitches straight from one straight into the other)
  var SEASON_KEY = 'bert-portfolio-season';
  var SEASON_VALUES = ['none', 'christmas', 'halloween'];
  var SEASON_CYCLE = ['none', 'christmas', 'none', 'halloween'];
  var seasonBtn = document.getElementById('season-toggle');
  var seasonOverlay = document.getElementById('season-overlay');
  var seasonCycleIndex = 0;

  function monthDefaultSeason() {
    var month = new Date().getMonth(); // 0 = January
    if (month === 9) return 'halloween'; // October
    if (month === 11) return 'christmas'; // December
    return 'none';
  }

  function getStoredSeason() {
    var stored = localStorage.getItem(SEASON_KEY);
    if (SEASON_VALUES.indexOf(stored) !== -1) return stored;
    return monthDefaultSeason();
  }

  function applySeason(season) {
    root.setAttribute('data-season', season);
    if (seasonBtn) {
      seasonBtn.setAttribute('aria-label', 'Seasonal decorations: ' + (season === 'none' ? 'off' : season));
    }
    renderSeason(season);
  }

  // cobweb strokes use currentColor so CSS can recolor per theme
  function cobwebSVG() {
    return (
      '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="1.15">' +
      '<path d="M0 0h200M0 0v200"/>' +
      '<path d="M0 0l190 36M0 0l150 78M0 0l96 128M0 0l42 176"/>' +
      '<path d="M18 0q12 18 0 18M50 0q28 50 0 50M86 0q48 86 0 86M124 0q62 124 0 124M164 0q34 164 0 164"/>' +
      '</svg>'
    );
  }

  function pumpkinSVG() {
    return (
      '<svg viewBox="0 0 40 36" aria-hidden="true">' +
      '<path d="M18 8c0-4 4-7 6-7 0 3-1 6-3 8" fill="#3d7a32"/>' +
      '<ellipse cx="20" cy="22" rx="16" ry="12" fill="#e07020"/>' +
      '<ellipse cx="12" cy="22" rx="7" ry="11" fill="#f08a38"/>' +
      '<ellipse cx="28" cy="22" rx="7" ry="11" fill="#c75a12"/>' +
      '<ellipse cx="20" cy="22" rx="6" ry="11" fill="#ff9a3c"/>' +
      '<path d="M13 20c1.5 1 3 1.2 4 0M23 20c1.5 1 3 1.2 4 0" stroke="#4a2208" fill="none" stroke-width="1.2"/>' +
      '<path d="M17 25c2 2 4 2 6 0" stroke="#4a2208" fill="none" stroke-width="1.2"/>' +
      '</svg>'
    );
  }

  // bat fill uses currentColor so CSS can recolor per theme
  function batSVG() {
    return (
      '<svg viewBox="0 0 28 14" aria-hidden="true">' +
      '<path fill="currentColor" d="M14 6c-1 0-2 2-2 3h4c0-1-1-3-2-3zM2 7c4-1 7 2 9 3-3 2-7 3-11 1 2-1 3-3 2-4zm24 0c-4-1-7 2-9 3 3 2 7 3 11 1-2-1-3-3-2-4z"/>' +
      '</svg>'
    );
  }

  function decorateFrames(season) {
    document.querySelectorAll('.frame-deco').forEach(function (el) { el.remove(); });
    if (season !== 'halloween' && season !== 'christmas') return;
    document.querySelectorAll('.retro-window').forEach(function (win) {
      if (season === 'halloween') {
        var left = document.createElement('div');
        left.className = 'frame-deco frame-pumpkin frame-pumpkin-left';
        left.innerHTML = pumpkinSVG();
        var right = document.createElement('div');
        right.className = 'frame-deco frame-pumpkin frame-pumpkin-right';
        right.innerHTML = pumpkinSVG();
        win.appendChild(left);
        win.appendChild(right);
      } else {
        var lights = document.createElement('div');
        lights.className = 'frame-deco frame-lights';
        lights.innerHTML = '<span class="wire"></span>';
        for (var i = 0; i < 11; i += 1) {
          var bulb = document.createElement('span');
          bulb.className = 'bulb';
          lights.appendChild(bulb);
        }
        win.appendChild(lights);
      }
    });
  }

  function renderSeason(season) {
    if (!seasonOverlay) return;
    seasonOverlay.innerHTML = '';
    decorateFrames(season);

    if (season === 'christmas') {
      for (var i = 0; i < 42; i += 1) {
        var flake = document.createElement('span');
        flake.className = 'season-flake' + (i % 3 === 0 ? ' crystal' : '');
        flake.style.left = (Math.random() * 100) + 'vw';
        var size = 4 + Math.random() * 7;
        flake.style.width = size + 'px';
        flake.style.height = size + 'px';
        flake.style.opacity = (0.45 + Math.random() * 0.5).toFixed(2);
        flake.style.animationDuration = (8 + Math.random() * 10) + 's';
        flake.style.animationDelay = (Math.random() * -14) + 's';
        seasonOverlay.appendChild(flake);
      }
    } else if (season === 'halloween') {
      var layer = document.createElement('div');
      layer.className = 'season-web-layer';
      seasonOverlay.appendChild(layer);
      ['tl', 'tr', 'bl', 'br'].forEach(function (corner) {
        var web = document.createElement('div');
        web.className = 'season-web season-web-' + corner;
        web.innerHTML = cobwebSVG();
        seasonOverlay.appendChild(web);
      });
      for (var j = 0; j < 5; j += 1) {
        var bat = document.createElement('span');
        bat.className = 'season-bat';
        bat.innerHTML = batSVG();
        bat.style.top = (8 + Math.random() * 55) + 'vh';
        bat.style.animationDuration = (9 + Math.random() * 10) + 's';
        bat.style.animationDelay = (Math.random() * -12) + 's';
        seasonOverlay.appendChild(bat);
      }
    }
  }

  var initialSeason = getStoredSeason();
  seasonCycleIndex = Math.max(0, SEASON_CYCLE.indexOf(initialSeason));
  applySeason(initialSeason);

  if (seasonBtn) {
    seasonBtn.addEventListener('click', function () {
      seasonCycleIndex = (seasonCycleIndex + 1) % SEASON_CYCLE.length;
      var next = SEASON_CYCLE[seasonCycleIndex];
      applySeason(next);
      try { localStorage.setItem(SEASON_KEY, next); } catch (e) {}
    });
  }

  // scroll spy: mark active section in nav + rail
  var sections = document.querySelectorAll('#home, #about, #skills, #hobbies, #contact');
  var navLinks = document.querySelectorAll('.navbar .nav-links a');
  var railItems = document.querySelectorAll('.rail-item');

  function setActive(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-section') === id);
    });
    railItems.forEach(function (item) {
      item.classList.toggle('active', item.getAttribute('data-section') === id);
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        var visible = entries
          .filter(function (e) { return e.isIntersecting; })
          .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; })[0];
        if (visible) setActive(visible.target.id);
      },
      { threshold: [0.35, 0.5, 0.65] }
    );
    sections.forEach(function (section) { observer.observe(section); });
  }

  // mail modal: opens a form, sends via the visitor's own mail app
  var EMAIL = 'bertnikkelen1@gmail.com';
  var mailOpenBtn = document.getElementById('mail-open-btn');
  var mailCloseBtn = document.getElementById('mail-close-btn');
  var mailBackdrop = document.getElementById('mail-backdrop');
  var mailForm = document.getElementById('mail-form');
  var mailCopyBtn = document.getElementById('mail-copy-btn');
  var copyToast = document.getElementById('copy-toast');

  function openMail() {
    if (!mailBackdrop) return;
    mailBackdrop.hidden = false;
    requestAnimationFrame(function () {
      mailBackdrop.classList.add('is-open');
    });
    document.addEventListener('keydown', onMailKeydown);
  }

  function closeMail() {
    if (!mailBackdrop) return;
    mailBackdrop.classList.remove('is-open');
    document.removeEventListener('keydown', onMailKeydown);
    setTimeout(function () { mailBackdrop.hidden = true; }, 250);
  }

  function onMailKeydown(e) {
    if (e.key === 'Escape') closeMail();
  }

  if (mailOpenBtn) mailOpenBtn.addEventListener('click', openMail);
  if (mailCloseBtn) mailCloseBtn.addEventListener('click', closeMail);
  if (mailBackdrop) {
    mailBackdrop.addEventListener('click', function (e) {
      if (e.target === mailBackdrop) closeMail();
    });
  }

  // builds a mailto link from the form and hands off to the mail app,
  // since a static site can't send mail itself
  if (mailForm) {
    mailForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(mailForm);
      var name = (data.get('name') || '').toString();
      var from = (data.get('email') || '').toString();
      var message = (data.get('message') || '').toString();
      var subject = 'Portfolio contact from ' + name;
      var body = message + '\n\n- ' + name + ' (' + from + ')';
      var link = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      window.location.href = link;
      closeMail();
      mailForm.reset();
    });
  }

  // copy button: puts the address on the clipboard, shows a small toast
  if (mailCopyBtn) {
    mailCopyBtn.addEventListener('click', function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(EMAIL).then(showCopyToast).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }
    });
  }

  function fallbackCopy() {
    var tmp = document.createElement('textarea');
    tmp.value = EMAIL;
    tmp.style.position = 'fixed';
    tmp.style.opacity = '0';
    document.body.appendChild(tmp);
    tmp.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(tmp);
    showCopyToast();
  }

  var copyToastTimer = null;
  function showCopyToast() {
    if (!copyToast) return;
    copyToast.classList.add('show');
    clearTimeout(copyToastTimer);
    copyToastTimer = setTimeout(function () {
      copyToast.classList.remove('show');
    }, 1500);
  }

  // confirm popup: linkedin/github links open only after a heads-up
  var confirmBackdrop = document.getElementById('confirm-backdrop');
  var confirmMessage = document.getElementById('confirm-message');
  var confirmContinueBtn = document.getElementById('confirm-continue-btn');
  var confirmCancelBtn = document.getElementById('confirm-cancel-btn');
  var confirmCloseBtn = document.getElementById('confirm-close-btn');
  var pendingUrl = null;

  function openConfirm(url, label) {
    if (!confirmBackdrop) return;
    pendingUrl = url;
    if (confirmMessage) confirmMessage.textContent = 'This will open a new page to ' + label + '.';
    confirmBackdrop.hidden = false;
    requestAnimationFrame(function () { confirmBackdrop.classList.add('is-open'); });
    document.addEventListener('keydown', onConfirmKeydown);
  }

  function closeConfirm() {
    if (!confirmBackdrop) return;
    confirmBackdrop.classList.remove('is-open');
    document.removeEventListener('keydown', onConfirmKeydown);
    setTimeout(function () {
      confirmBackdrop.hidden = true;
      pendingUrl = null;
    }, 250);
  }

  function onConfirmKeydown(e) {
    if (e.key === 'Escape') closeConfirm();
  }

  document.querySelectorAll('a[target="_blank"]').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    var label = null;
    if (href.indexOf('linkedin.com') !== -1) label = 'LinkedIn';
    else if (href.indexOf('github.com') !== -1) label = 'GitHub';
    else if (href.indexOf('chamsyslighting.com') !== -1) label = 'the official Chamsys website';
    if (!label) return;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      openConfirm(href, label);
    });
  });

  if (confirmContinueBtn) {
    confirmContinueBtn.addEventListener('click', function () {
      if (pendingUrl) window.open(pendingUrl, '_blank', 'noopener');
      closeConfirm();
    });
  }
  if (confirmCancelBtn) confirmCancelBtn.addEventListener('click', closeConfirm);
  if (confirmCloseBtn) confirmCloseBtn.addEventListener('click', closeConfirm);
  if (confirmBackdrop) {
    confirmBackdrop.addEventListener('click', function (e) {
      if (e.target === confirmBackdrop) closeConfirm();
    });
  }

  // easter egg: click name, hero shoots 3 aliens above it, +1 each
  var nameEl = document.getElementById('hero-name');
  var overlay = document.getElementById('egg-overlay');
  if (!nameEl || !overlay) return;

  var playing = false;

  nameEl.addEventListener('click', function () {
    if (playing) return;
    playEasterEgg();
  });

  function playEasterEgg() {
    playing = true;

    var rect = nameEl.getBoundingClientRect();
    var baseX = rect.left + rect.width / 2;
    var mobileLift = window.innerWidth <= 768 ? 35 : 0;
    var heroY = rect.top - 8 - mobileLift;
    var gunX = baseX;
    var gunY = heroY - 24;

    var hero = document.createElement('div');
    hero.className = 'egg-hero egg-appear';
    hero.style.left = (baseX - 12) + 'px';
    hero.style.top = (heroY - 24) + 'px';
    hero.innerHTML = heroSpriteSVG();
    overlay.appendChild(hero);

    // left top, middle top, right top - all above the name
    var spreadX = window.innerWidth <= 768 ? 42 : 55;
    var spots = [
      { x: baseX - spreadX, y: heroY - 70 },
      { x: baseX, y: heroY - 95 },
      { x: baseX + spreadX, y: heroY - 70 }
    ];
    var els = [];

    spots.forEach(function (spot) {
      var alien = document.createElement('div');
      alien.className = 'egg-alien egg-appear';
      alien.style.left = (spot.x - 10) + 'px';
      alien.style.top = (spot.y - 10) + 'px';
      alien.innerHTML = alienSpriteSVG();
      overlay.appendChild(alien);
      els.push(alien);
    });

    var i = 0;
    setTimeout(fireNext, 200);

    function fireNext() {
      if (i >= spots.length) {
        setTimeout(cleanup, 1100);
        return;
      }
      var index = i;
      var spot = spots[index];
      var alien = els[index];
      shoot(gunX, gunY, spot.x, spot.y, function () {
        alien.classList.add('egg-hit');
        playHit();
        dropScore(spot.x, spot.y);
        if (index === spots.length - 1) {
          playLevelUp();
          dropLevelUp(baseX, heroY - 24);
        }
      });
      i += 1;
      setTimeout(fireNext, 260);
    }

    function cleanup() {
      overlay.removeChild(hero);
      els.forEach(function (el) { overlay.removeChild(el); });
      overlay.querySelectorAll('.egg-score').forEach(function (el) { overlay.removeChild(el); });
      overlay.querySelectorAll('.egg-levelup').forEach(function (el) { overlay.removeChild(el); });
      playing = false;
    }
  }

  // fires one bullet from (x1,y1) to (x2,y2), calls onHit when it lands
  function shoot(x1, y1, x2, y2, onHit) {
    var bullet = document.createElement('div');
    bullet.className = 'egg-bullet';
    bullet.style.left = x1 + 'px';
    bullet.style.top = y1 + 'px';
    bullet.style.setProperty('--dx', (x2 - x1) + 'px');
    bullet.style.setProperty('--dy', (y2 - y1) + 'px');
    overlay.appendChild(bullet);
    playShoot();

    bullet.classList.add('egg-fire');
    setTimeout(function () {
      overlay.removeChild(bullet);
      onHit();
    }, 220);
  }

  function dropScore(x, y) {
    var score = document.createElement('div');
    score.className = 'egg-score';
    score.textContent = '+1';
    score.style.left = x + 'px';
    score.style.top = y + 'px';
    overlay.appendChild(score);
  }

  function dropLevelUp(x, y) {
    var el = document.createElement('div');
    el.className = 'egg-levelup';
    el.textContent = 'LEVEL UP +1';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    overlay.appendChild(el);
  }

  // simple pixel guy, own shapes, not based on any real character
  function heroSpriteSVG() {
    return (
      '<svg viewBox="0 0 16 16" shape-rendering="crispEdges">' +
      '<rect x="6" y="1" width="4" height="4" fill="currentColor" style="color:var(--accent-strong,#0B4F4C)"/>' +
      '<rect x="5" y="5" width="6" height="5" fill="currentColor" style="color:var(--accent2)"/>' +
      '<rect x="4" y="10" width="3" height="4" fill="currentColor" style="color:var(--accent-strong,#0B4F4C)"/>' +
      '<rect x="9" y="10" width="3" height="4" fill="currentColor" style="color:var(--accent-strong,#0B4F4C)"/>' +
      '<rect x="3" y="6" width="2" height="4" fill="currentColor" style="color:var(--accent2)"/>' +
      '<rect x="11" y="6" width="2" height="4" fill="currentColor" style="color:var(--accent2)"/>' +
      '</svg>'
    );
  }

  // simple pixel alien, own shapes, not based on any real character
  function alienSpriteSVG() {
    return (
      '<svg viewBox="0 0 16 16" shape-rendering="crispEdges">' +
      '<rect x="5" y="2" width="1" height="2" fill="currentColor" style="color:var(--accent)"/>' +
      '<rect x="10" y="2" width="1" height="2" fill="currentColor" style="color:var(--accent)"/>' +
      '<rect x="4" y="4" width="8" height="6" fill="currentColor" style="color:var(--accent)"/>' +
      '<rect x="6" y="6" width="1" height="1" fill="#14181C"/>' +
      '<rect x="9" y="6" width="1" height="1" fill="#14181C"/>' +
      '<rect x="3" y="10" width="2" height="2" fill="currentColor" style="color:var(--accent)"/>' +
      '<rect x="11" y="10" width="2" height="2" fill="currentColor" style="color:var(--accent)"/>' +
      '<rect x="6" y="10" width="4" height="2" fill="currentColor" style="color:var(--accent)"/>' +
      '</svg>'
    );
  }

  // soft laser zap: a quick downward pitch sweep on a sine wave,
  // gentler on the ears than a flat square-wave beep
  function playShoot() {
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      var ctx = new Ctx();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      var t0 = ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100, t0);
      osc.frequency.exponentialRampToValueAtTime(420, t0 + 0.12);
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(0.09, t0 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.16);
      setTimeout(function () { ctx.close(); }, 400);
    } catch (e) {
      // no web audio, animation still runs without sound
    }
  }

  // hit + ding, triangle/sine instead of square, smoother
  function playHit() {
    playNotes([
      { f: 180, t: 0, d: 0.09, type: 'triangle' },
      { f: 880, t: 0.05, d: 0.16, type: 'sine' }
    ]);
  }

  // level-up fanfare once all 3 aliens are down, own notes, no copyright
  function playLevelUp() {
    playNotes([
      { f: 523.25, t: 0, d: 0.09, type: 'triangle' },
      { f: 659.25, t: 0.09, d: 0.09, type: 'triangle' },
      { f: 783.99, t: 0.18, d: 0.09, type: 'triangle' },
      { f: 1046.5, t: 0.27, d: 0.3, type: 'sine' }
    ]);
  }

  function playNotes(notes) {
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      var ctx = new Ctx();
      notes.forEach(function (n) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = n.type || 'square';
        osc.frequency.value = n.f;
        var startAt = ctx.currentTime + n.t;
        var stopAt = startAt + n.d;
        gain.gain.setValueAtTime(0, startAt);
        gain.gain.linearRampToValueAtTime(0.12, startAt + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, stopAt);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startAt);
        osc.stop(stopAt + 0.02);
      });
      setTimeout(function () { ctx.close(); }, 1000);
    } catch (e) {
      // no web audio, animation still runs without sound
    }
  }
})();