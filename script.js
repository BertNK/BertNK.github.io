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

  // seasonal decorations: cycles off -> christmas -> halloween -> off
  var SEASON_KEY = 'bert-portfolio-season';
  var SEASONS = ['none', 'christmas', 'halloween'];
  var seasonBtn = document.getElementById('season-toggle');
  var seasonIcon = seasonBtn ? seasonBtn.querySelector('.season-icon') : null;
  var seasonOverlay = document.getElementById('season-overlay');

  function getStoredSeason() {
    var stored = localStorage.getItem(SEASON_KEY);
    return SEASONS.indexOf(stored) !== -1 ? stored : 'none';
  }

  function applySeason(season) {
    root.setAttribute('data-season', season);
    if (seasonIcon) {
      seasonIcon.textContent = season === 'christmas' ? '❄' : season === 'halloween' ? '🎃' : '✨';
    }
    if (seasonBtn) {
      seasonBtn.setAttribute('aria-label', 'Seasonal decorations: ' + (season === 'none' ? 'off' : season));
    }
    renderSeason(season);
  }

  function renderSeason(season) {
    if (!seasonOverlay) return;
    seasonOverlay.innerHTML = '';

    if (season === 'christmas') {
      for (var i = 0; i < 16; i += 1) {
        var flake = document.createElement('span');
        flake.className = 'season-flake';
        flake.textContent = '❄';
        flake.style.left = (Math.random() * 100) + 'vw';
        flake.style.fontSize = (10 + Math.random() * 14) + 'px';
        flake.style.opacity = (0.5 + Math.random() * 0.4).toFixed(2);
        flake.style.color = 'var(--accent)';
        flake.style.animationDuration = (7 + Math.random() * 8) + 's';
        flake.style.animationDelay = (Math.random() * -10) + 's';
        seasonOverlay.appendChild(flake);
      }
    } else if (season === 'halloween') {
      for (var j = 0; j < 6; j += 1) {
        var bat = document.createElement('span');
        bat.className = 'season-bat';
        bat.textContent = '\ud83e\udd87';
        bat.style.top = (8 + Math.random() * 55) + 'vh';
        bat.style.fontSize = (14 + Math.random() * 10) + 'px';
        bat.style.animationDuration = (9 + Math.random() * 10) + 's';
        bat.style.animationDelay = (Math.random() * -12) + 's';
        seasonOverlay.appendChild(bat);
      }
      [8, 50, 88].forEach(function (left) {
        var pumpkin = document.createElement('span');
        pumpkin.className = 'season-pumpkin';
        pumpkin.textContent = '\ud83c\udf83';
        pumpkin.style.left = left + 'vw';
        seasonOverlay.appendChild(pumpkin);
      });
    }
  }

  applySeason(getStoredSeason());

  if (seasonBtn) {
    seasonBtn.addEventListener('click', function () {
      var current = root.getAttribute('data-season') || 'none';
      var next = SEASONS[(SEASONS.indexOf(current) + 1) % SEASONS.length];
      applySeason(next);
      try { localStorage.setItem(SEASON_KEY, next); } catch (e) {}
    });
  }

  // scroll spy: mark active section in navbar + rail
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
        setTimeout(cleanup, 900);
        return;
      }
      var spot = spots[i];
      var alien = els[i];
      shoot(gunX, gunY, spot.x, spot.y, function () {
        alien.classList.add('egg-hit');
        playHit();
        dropScore(spot.x, spot.y);
      });
      i += 1;
      setTimeout(fireNext, 260);
    }

    function cleanup() {
      overlay.removeChild(hero);
      els.forEach(function (el) { overlay.removeChild(el); });
      overlay.querySelectorAll('.egg-score').forEach(function (el) { overlay.removeChild(el); });
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

  // short laser blip, own notes, square wave, no copyright
  function playShoot() {
    playNotes([{ f: 900, t: 0, d: 0.08, type: 'square' }]);
  }

  // short hit + ding, own notes, square wave, no copyright
  function playHit() {
    playNotes([
      { f: 200, t: 0, d: 0.06, type: 'square' },
      { f: 1046.5, t: 0.05, d: 0.15, type: 'square' }
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