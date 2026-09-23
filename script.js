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

  // easter egg: click name, hero jumps and stomps a critter, +1 pops up
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
    var groundY = rect.top - 10;
    var centerX = rect.left + rect.width / 2;
    var enemyX = centerX + 18;
    var heroX = centerX - 18;

    var hero = document.createElement('div');
    hero.className = 'egg-hero';
    hero.style.left = heroX + 'px';
    hero.style.top = (groundY - 26) + 'px';
    hero.innerHTML = heroSpriteSVG();

    var enemy = document.createElement('div');
    enemy.className = 'egg-enemy';
    enemy.style.left = enemyX + 'px';
    enemy.style.top = (groundY - 26) + 'px';
    enemy.innerHTML = enemySpriteSVG();

    overlay.appendChild(enemy);
    overlay.appendChild(hero);

    var score = null;

    hero.classList.add('egg-jump');
    playJump();

    // jump lands after 0.6s, that's when the stomp happens
    setTimeout(function () {
      enemy.classList.add('egg-squish');
      hero.classList.add('egg-bounce');
      playStomp();

      score = document.createElement('div');
      score.className = 'egg-score';
      score.textContent = '+1';
      score.style.left = enemyX + 'px';
      score.style.top = (groundY - 26) + 'px';
      overlay.appendChild(score);
    }, 600);

    // clean up once everything's done animating
    setTimeout(function () {
      overlay.removeChild(hero);
      overlay.removeChild(enemy);
      if (score) overlay.removeChild(score);
      playing = false;
    }, 1500);
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

  // simple pixel critter, own shapes, not based on any real character
  function enemySpriteSVG() {
    return (
      '<svg viewBox="0 0 16 16" shape-rendering="crispEdges">' +
      '<rect x="4" y="6" width="8" height="6" fill="#8a5a3b"/>' +
      '<rect x="4" y="12" width="3" height="2" fill="#5c3b24"/>' +
      '<rect x="9" y="12" width="3" height="2" fill="#5c3b24"/>' +
      '<rect x="6" y="8" width="1" height="1" fill="#1a1a1a"/>' +
      '<rect x="9" y="8" width="1" height="1" fill="#1a1a1a"/>' +
      '</svg>'
    );
  }

  // short jump blip, own notes, square wave, no copyright
  function playJump() {
    playNotes([{ f: 700, t: 0, d: 0.12 }]);
  }

  // short stomp + ding, own notes, square wave, no copyright
  function playStomp() {
    playNotes([
      { f: 150, t: 0, d: 0.08, type: 'square' },
      { f: 1046.5, t: 0.06, d: 0.18, type: 'square' }
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