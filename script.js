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
  var seasonOverlay = document.getElementById('season-overlay');

  function getStoredSeason() {
    var stored = localStorage.getItem(SEASON_KEY);
    return SEASONS.indexOf(stored) !== -1 ? stored : 'none';
  }

  function applySeason(season) {
    root.setAttribute('data-season', season);
    if (seasonBtn) {
      seasonBtn.setAttribute('aria-label', 'Seasonal decorations: ' + (season === 'none' ? 'off' : season));
    }
    renderSeason(season);
  }

  function cobwebSVG() {
    return (
      '<svg viewBox="0 0 200 200" fill="none" stroke="rgba(236,236,236,0.95)" stroke-width="1.15">' +
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

  function batSVG() {
    return (
      '<svg viewBox="0 0 28 14" aria-hidden="true">' +
      '<path fill="#1a1210" d="M14 6c-1 0-2 2-2 3h4c0-1-1-3-2-3zM2 7c4-1 7 2 9 3-3 2-7 3-11 1 2-1 3-3 2-4zm24 0c-4-1-7 2-9 3 3 2 7 3 11 1-2-1-3-3-2-4z"/>' +
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

  // windows 98 desktop: flag button swaps the page into a retro PC shell
  var OS_KEY = 'bert-portfolio-os';
  var osBtn = document.getElementById('os-toggle');
  var desktop = document.getElementById('win98-desktop');
  var startBtn = document.getElementById('win98-start');
  var startMenu = document.getElementById('win98-start-menu');
  var windowsLayer = document.getElementById('win98-windows');
  var tasksBar = document.getElementById('win98-tasks');
  var clockEl = document.getElementById('win98-clock');
  var openWindows = {};
  var winZ = 20;
  var dragState = null;

  var PROJECTS_HTML =
    '<div class="win98-projects">' +
    '<a href="https://github.com/BertNK/BertNK.github.io" target="_blank" rel="noopener"><span class="win98-icon-art win98-icon-computer"></span><span><strong>BertNK.github.io</strong><br>This portfolio</span></a>' +
    '<a href="https://github.com/BertNK/DogPal" target="_blank" rel="noopener"><span class="win98-icon-art win98-icon-game"></span><span><strong>DogPal</strong><br>Focus extension where you earn treats for your pal</span></a>' +
    '<a href="https://github.com/BertNK/Design-Patterns" target="_blank" rel="noopener"><span class="win98-icon-art win98-icon-folder"></span><span><strong>Design-Patterns</strong><br>Code experiments</span></a>' +
    '<a href="https://github.com/BertNK" target="_blank" rel="noopener"><span class="win98-icon-art win98-icon-network"></span><span><strong>GitHub profile</strong><br>github.com/BertNK</span></a>' +
    '</div>';

  function sourceHtml(selector) {
    var node = document.querySelector(selector);
    if (!node) return '';
    var clone = node.cloneNode(true);
    clone.querySelectorAll('[id]').forEach(function (el) { el.removeAttribute('id'); });
    return clone.outerHTML;
  }

  function windowHtml(id) {
    if (id === 'projects') return PROJECTS_HTML;
    if (id === 'home') return sourceHtml('#home .hero-content');
    if (id === 'about') return sourceHtml('#about .hero-content2');
    if (id === 'skills') return sourceHtml('#skills .hero-content2');
    if (id === 'hobbies') return sourceHtml('#hobbies .hero-content2');
    if (id === 'contact') return sourceHtml('#contact .hero-content2');
    return '';
  }

  var WINDOW_TITLES = {
    home: 'My Computer',
    about: 'About Me',
    skills: 'Skills',
    hobbies: 'Hobbies',
    contact: 'Get in Touch',
    projects: 'My Projects'
  };

  function applyOs(mode) {
    root.setAttribute('data-os', mode === 'win98' ? 'win98' : 'site');
    if (desktop) desktop.hidden = mode !== 'win98';
    if (osBtn) {
      osBtn.setAttribute('aria-pressed', String(mode === 'win98'));
      osBtn.setAttribute('aria-label', mode === 'win98' ? 'Exit Windows desktop' : 'Enter Windows desktop');
    }
    if (mode !== 'win98') closeStartMenu();
  }

  function getStoredOs() {
    return localStorage.getItem(OS_KEY) === 'win98' ? 'win98' : 'site';
  }

  function closeStartMenu() {
    if (!startMenu || !startBtn) return;
    startMenu.hidden = true;
    startBtn.classList.remove('is-open');
    startBtn.setAttribute('aria-expanded', 'false');
  }

  function toggleStartMenu() {
    if (!startMenu || !startBtn) return;
    var open = startMenu.hidden;
    startMenu.hidden = !open;
    startBtn.classList.toggle('is-open', open);
    startBtn.setAttribute('aria-expanded', String(open));
  }

  function focusWindow(id) {
    var entry = openWindows[id];
    if (!entry) return;
    winZ += 1;
    entry.el.style.zIndex = String(winZ);
    Object.keys(openWindows).forEach(function (key) {
      openWindows[key].task.classList.toggle('is-active', key === id);
    });
  }

  function closeWindow(id) {
    var entry = openWindows[id];
    if (!entry) return;
    entry.el.remove();
    entry.task.remove();
    delete openWindows[id];
  }

  function openWindow(id) {
    if (!windowsLayer || !WINDOW_TITLES[id]) return;
    if (openWindows[id]) {
      focusWindow(id);
      closeStartMenu();
      return;
    }
    var count = Object.keys(openWindows).length;
    var win = document.createElement('div');
    win.className = 'win98-window';
    win.style.left = (48 + count * 28) + 'px';
    win.style.top = (36 + count * 24) + 'px';
    win.innerHTML =
      '<div class="win98-titlebar"><span>' + WINDOW_TITLES[id] + '</span><div class="win98-chrome">' +
      '<button type="button" data-act="min" aria-label="Minimize">_</button>' +
      '<button type="button" data-act="max" aria-label="Maximize">□</button>' +
      '<button type="button" data-act="close" aria-label="Close">×</button>' +
      '</div></div><div class="win98-body">' + windowHtml(id) + '</div>';
    windowsLayer.appendChild(win);

    var task = document.createElement('button');
    task.type = 'button';
    task.className = 'win98-task';
    task.textContent = WINDOW_TITLES[id];
    if (tasksBar) tasksBar.appendChild(task);

    openWindows[id] = { el: win, task: task };
    decorateFrames(root.getAttribute('data-season') || 'none');
    focusWindow(id);
    closeStartMenu();

    win.querySelectorAll('.icon-box-btn').forEach(function (b) {
      b.addEventListener('click', openMail);
    });

    win.addEventListener('mousedown', function () { focusWindow(id); });
    task.addEventListener('click', function () {
      if (win.style.display === 'none') {
        win.style.display = '';
        focusWindow(id);
      } else if (task.classList.contains('is-active')) {
        win.style.display = 'none';
        task.classList.remove('is-active');
      } else {
        win.style.display = '';
        focusWindow(id);
      }
    });

    win.querySelectorAll('.win98-chrome button').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var act = btn.getAttribute('data-act');
        if (act === 'close') closeWindow(id);
        if (act === 'min') {
          win.style.display = 'none';
          task.classList.remove('is-active');
        }
        if (act === 'max') win.classList.toggle('is-max');
      });
    });

    var bar = win.querySelector('.win98-titlebar');
    bar.addEventListener('mousedown', function (e) {
      if (e.target.closest('.win98-chrome')) return;
      if (win.classList.contains('is-max')) return;
      dragState = {
        el: win,
        x: e.clientX - win.offsetLeft,
        y: e.clientY - win.offsetTop
      };
    });
  }

  document.addEventListener('mousemove', function (e) {
    if (!dragState) return;
    dragState.el.style.left = Math.max(0, e.clientX - dragState.x) + 'px';
    dragState.el.style.top = Math.max(0, e.clientY - dragState.y) + 'px';
  });
  document.addEventListener('mouseup', function () { dragState = null; });

  function tickClock() {
    if (!clockEl) return;
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var suffix = h >= 12 ? 'PM' : 'AM';
    var hour = h % 12 || 12;
    clockEl.textContent = hour + ':' + (m < 10 ? '0' : '') + m + ' ' + suffix;
  }

  applyOs(getStoredOs());
  tickClock();
  setInterval(tickClock, 15000);

  if (osBtn) {
    osBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-os') === 'win98' ? 'site' : 'win98';
      applyOs(next);
      try { localStorage.setItem(OS_KEY, next); } catch (e) {}
    });
  }
  if (startBtn) startBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    toggleStartMenu();
  });
  document.addEventListener('click', function (e) {
    if (!startMenu || startMenu.hidden) return;
    if (startMenu.contains(e.target) || (startBtn && startBtn.contains(e.target))) return;
    closeStartMenu();
  });
  document.querySelectorAll('#win98-icons [data-window], #win98-start-menu [data-window]').forEach(function (el) {
    el.addEventListener('click', function () {
      openWindow(el.getAttribute('data-window'));
    });
  });
  var winMail = document.getElementById('win98-mail-icon');
  if (winMail) winMail.addEventListener('click', function () { openMail(); });
  var exitBtn = document.getElementById('win98-exit');
  if (exitBtn) {
    exitBtn.addEventListener('click', function () {
      applyOs('site');
      try { localStorage.setItem(OS_KEY, 'site'); } catch (e) {}
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