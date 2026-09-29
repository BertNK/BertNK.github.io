(function () {
  // load-in reveal: wait for everything (assets + fonts), then one
  // extra second of calm before the ripple opens
  var curtain = document.getElementById('preload-curtain');

  var drop = document.getElementById('preload-drop');

  // sequence: a drop falls to the focal point, then rings spread out
  // while the curtain opens along the first ring
  function revealPage() {
    if (!curtain) return;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // size the rings so the first one travels with the edge of the reveal
    var W = curtain.clientWidth || window.innerWidth;
    var H = curtain.clientHeight || window.innerHeight;
    var cx = W * 0.5;
    var cy = H * 0.42;
    var farthest = Math.sqrt(Math.pow(Math.max(cx, W - cx), 2) + Math.pow(Math.max(cy, H - cy), 2));
    if (drop) drop.style.setProperty('--pd-ring-size', (farthest * 2 * 1.12) + 'px');

    var fallMs = reduceMotion ? 0 : 850;
    if (drop && !reduceMotion) drop.classList.add('is-falling');

    setTimeout(function () {
      if (drop) drop.classList.add('is-impact');
      curtain.classList.add('revealed');
    }, fallMs);

    setTimeout(function () {
      if (curtain.parentNode) curtain.parentNode.removeChild(curtain);
      if (drop && drop.parentNode) drop.parentNode.removeChild(drop);
    }, fallMs + 2800);
  }

  function scheduleReveal() {
    var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    fontsReady.catch(function () {}).then(function () {
      setTimeout(revealPage, 1000);
    });
  }

  if (document.readyState === 'complete') {
    scheduleReveal();
  } else {
    window.addEventListener('load', scheduleReveal);
  }

  var root = document.documentElement;
  var toggleBtn = document.getElementById('theme-toggle');
  var metaThemeColor = document.querySelector('meta[name="theme-color"]');
  var STORAGE_KEY = 'bert-portfolio-theme';
  var currentTheme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  var userPickedTheme = false;

  // storage can throw (private modes, blocked cookies, some in-app
  // browsers) - never let that stop the rest of the page from working
  function readStored(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function writeStored(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  function systemPrefersDark() {
    try {
      return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch (e) {
      return false;
    }
  }

  // theme: a saved pick wins, otherwise follow the browser/system
  function getPreferredTheme() {
    var stored = readStored(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      userPickedTheme = true;
      return stored;
    }
    return systemPrefersDark() ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    currentTheme = theme;
    root.setAttribute('data-theme', theme);
    if (metaThemeColor) metaThemeColor.setAttribute('content', theme === 'dark' ? '#0E1418' : '#E9EFE9');
    if (toggleBtn) {
      var isDark = theme === 'dark';
      toggleBtn.setAttribute('aria-pressed', String(isDark));
      toggleBtn.setAttribute('aria-label', isDark ? t('theme.toLight') : t('theme.toDark'));
    }
  }

  // ---------------------------------------------------------------
  // language (EN / NL): a saved pick wins, otherwise follow the
  // browser/system language. Static text is tagged in index.html with
  // data-i18n (text), data-i18n-html (text with highlight spans),
  // data-i18n-aria / -alt / -title (attributes); dynamic text uses t().
  // ---------------------------------------------------------------
  var LANG_KEY = 'bert-portfolio-lang';
  var I18N = {
    en: {
      'common.close': 'Close',
      'nav.aria': 'Section navigation',
      'nav.home': 'Home', 'nav.about': 'About', 'nav.skills': 'Skills',
      'nav.hobbies': 'Hobbies', 'nav.contact': 'Contact',
      'hero.eyebrow': '01 // Software Developer',
      'hero.hello': 'Hello, my name is',
      'hero.nameTitle': 'try clicking me three times',
      'hero.iam': 'I am a',
      'hero.role': 'Software Developer',
      'hero.ctaAbout': 'About me',
      'hero.ctaContact': 'Contact Me',
      'about.eyebrow': '02 // Profile',
      'about.title': 'About Me',
      'about.p1': 'Hi, I\'m <span class="highlight">Bert</span>, a student <span class="highlight">Software Developer</span> at the <span class="highlight">ROC Technovium</span> in Nijmegen.',
      'about.p2': 'I love working on websites with <span class="highlight">VueJS/Javascript</span>',
      'about.img': 'Laptop on a desk',
      'skills.eyebrow': '03 // Stack',
      'skills.title': 'Skills',
      'skills.p1': 'My strongest skill is Back-End, working with frameworks/languages like',
      'skills.img': 'Skills illustration',
      'hobbies.eyebrow': '04 // Off the clock',
      'hobbies.title': 'Hobbies',
      'hobbies.p1': 'In my free time I test software and work with',
      'hobbies.p2a': 'Click',
      'hobbies.p2link': 'me',
      'hobbies.p2b': 'to learn more about my skills',
      'contact.eyebrow': '05 // Say hello',
      'contact.title': 'Get in Touch',
      'contact.p1': 'Want to connect with me?',
      'contact.p2a': 'Reach out via',
      'contact.p2b': 'or',
      'contact.p2email': 'Email!',
      'contact.iconEmail': 'Email',
      'mail.title': 'new message',
      'mail.to': 'to:',
      'mail.copy': 'Copy email address',
      'mail.copied': 'copied',
      'mail.name': 'Your name',
      'mail.email': 'Your email',
      'mail.message': 'Message',
      'mail.send': 'Send',
      'mail.hint': 'opens your email app',
      'confirm.title': 'Leaving this site',
      'confirm.default': 'This will open a new page.',
      'confirm.msg': 'This will open a new page to {label}.',
      'confirm.label.linkedin': 'LinkedIn',
      'confirm.label.github': 'GitHub',
      'confirm.label.chamsys': 'the official Chamsys website',
      'confirm.continue': 'Continue',
      'confirm.cancel': 'Cancel',
      'scrollHint.aria': 'Scroll to next section',
      'theme.toLight': 'Switch to light mode',
      'theme.toDark': 'Switch to dark mode',
      'season.aria': 'Seasonal decorations: {state}',
      'season.none': 'off', 'season.christmas': 'christmas', 'season.halloween': 'halloween',
      'lang.switch': 'Switch language to Dutch',
      'boss.skip': 'skip',
      'boss.title': 'GIANT PUMPKIN!',
      'boss.aria': 'Giant pumpkin: tap it {n} times',
      'boss.tapAria': 'Tap the giant pumpkin',
      'boss.hint': 'Tap it {n} times! The clock starts on your first tap.',
      'boss.tooSlow': 'TOO SLOW!',
      'boss.healed': 'It healed itself. Try again!',
      'boss.smashIt': 'SMASH IT!',
      'boss.keepTapping': 'Keep tapping!',
      'boss.smashed': 'SMASHED!',
      'egg.levelUp': 'LEVEL UP +1'
    },
    nl: {
      'common.close': 'Sluiten',
      'nav.aria': 'Sectienavigatie',
      'nav.home': 'Home', 'nav.about': 'Over mij', 'nav.skills': 'Vaardigheden',
      'nav.hobbies': 'Hobby\'s', 'nav.contact': 'Contact',
      'hero.eyebrow': '01 // Softwareontwikkelaar',
      'hero.hello': 'Hallo, mijn naam is',
      'hero.nameTitle': 'probeer drie keer op me te klikken',
      'hero.iam': 'Ik ben een',
      'hero.role': 'Softwareontwikkelaar',
      'hero.ctaAbout': 'Over mij',
      'hero.ctaContact': 'Neem contact op',
      'about.eyebrow': '02 // Profiel',
      'about.title': 'Over mij',
      'about.p1': 'Hoi, ik ben <span class="highlight">Bert</span>, een student <span class="highlight">Softwareontwikkelaar</span> aan het <span class="highlight">ROC Technovium</span> in Nijmegen.',
      'about.p2': 'Ik werk graag aan websites met <span class="highlight">VueJS/Javascript</span>',
      'about.img': 'Laptop op een bureau',
      'skills.eyebrow': '03 // Stack',
      'skills.title': 'Vaardigheden',
      'skills.p1': 'Mijn sterkste vaardigheid is back-end, waarbij ik werk met frameworks/talen zoals',
      'skills.img': 'Illustratie van vaardigheden',
      'hobbies.eyebrow': '04 // Buiten werktijd',
      'hobbies.title': 'Hobby\'s',
      'hobbies.p1': 'In mijn vrije tijd test ik software en werk ik met',
      'hobbies.p2a': 'Klik op',
      'hobbies.p2link': 'mij',
      'hobbies.p2b': 'om meer te leren over mijn vaardigheden',
      'contact.eyebrow': '05 // Zeg hallo',
      'contact.title': 'Neem contact op',
      'contact.p1': 'Wil je met me in contact komen?',
      'contact.p2a': 'Neem contact op via',
      'contact.p2b': 'of',
      'contact.p2email': 'E-mail!',
      'contact.iconEmail': 'E-mail',
      'mail.title': 'nieuw bericht',
      'mail.to': 'aan:',
      'mail.copy': 'E-mailadres kopiëren',
      'mail.copied': 'gekopieerd',
      'mail.name': 'Je naam',
      'mail.email': 'Je e-mailadres',
      'mail.message': 'Bericht',
      'mail.send': 'Verzenden',
      'mail.hint': 'opent je e-mailapp',
      'confirm.title': 'Je verlaat deze site',
      'confirm.default': 'Dit opent een nieuwe pagina.',
      'confirm.msg': 'Dit opent een nieuwe pagina naar {label}.',
      'confirm.label.linkedin': 'LinkedIn',
      'confirm.label.github': 'GitHub',
      'confirm.label.chamsys': 'de officiële Chamsys-website',
      'confirm.continue': 'Doorgaan',
      'confirm.cancel': 'Annuleren',
      'scrollHint.aria': 'Scroll naar de volgende sectie',
      'theme.toLight': 'Schakel over naar lichte modus',
      'theme.toDark': 'Schakel over naar donkere modus',
      'season.aria': 'Seizoensdecoratie: {state}',
      'season.none': 'uit', 'season.christmas': 'kerst', 'season.halloween': 'halloween',
      'lang.switch': 'Schakel over naar Engels',
      'boss.skip': 'overslaan',
      'boss.title': 'REUZENPOMPOEN!',
      'boss.aria': 'Reuzenpompoen: tik er {n} keer op',
      'boss.tapAria': 'Tik op de reuzenpompoen',
      'boss.hint': 'Tik er {n} keer op! De klok start bij je eerste tik.',
      'boss.tooSlow': 'TE LANGZAAM!',
      'boss.healed': 'Hij is vanzelf genezen. Probeer het opnieuw!',
      'boss.smashIt': 'SLA HEM KAPOT!',
      'boss.keepTapping': 'Blijf tikken!',
      'boss.smashed': 'KAPOTGESLAGEN!',
      'egg.levelUp': 'LEVEL UP +1'
    }
  };

  function systemLanguage() {
    try {
      var list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || 'en'];
      return String(list[0] || 'en').toLowerCase().indexOf('nl') === 0 ? 'nl' : 'en';
    } catch (e) {
      return 'en';
    }
  }

  var userPickedLang = false;
  function getPreferredLang() {
    var stored = readStored(LANG_KEY);
    if (stored === 'en' || stored === 'nl') {
      userPickedLang = true;
      return stored;
    }
    return systemLanguage();
  }

  var currentLang = getPreferredLang();

  function t(key, vars) {
    var table = I18N[currentLang] || I18N.en;
    var str = table[key];
    if (str === undefined) str = I18N.en[key];
    if (str === undefined) return key;
    if (vars) {
      Object.keys(vars).forEach(function (k) { str = str.split('{' + k + '}').join(vars[k]); });
    }
    return str;
  }

  function seasonAria(season) {
    return t('season.aria', { state: t('season.' + season) });
  }

  applyTheme(getPreferredTheme());

  // the toggle flips whatever is currently shown, no matter what the
  // browser default is, and remembers the pick
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      var next = currentTheme === 'dark' ? 'light' : 'dark';
      userPickedTheme = true;
      applyTheme(next);
      writeStored(STORAGE_KEY, next);
    });
  }

  // keep following live system changes, but only until a theme is picked
  try {
    if (window.matchMedia) {
      var colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      var onSchemeChange = function (e) {
        if (userPickedTheme) return;
        applyTheme(e.matches ? 'dark' : 'light');
      };
      if (colorSchemeQuery.addEventListener) {
        colorSchemeQuery.addEventListener('change', onSchemeChange);
      } else if (colorSchemeQuery.addListener) {
        colorSchemeQuery.addListener(onSchemeChange);
      }
    }
  } catch (e) {}

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
    var stored = readStored(SEASON_KEY);
    if (SEASON_VALUES.indexOf(stored) !== -1) return stored;
    return monthDefaultSeason();
  }

  function applySeason(season) {
    root.setAttribute('data-season', season);
    if (seasonBtn) {
      seasonBtn.setAttribute('aria-label', seasonAria(season));
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

  // a squashed pumpkin: flat orange mess, seeds, a bent stem, a few drips
  function smashedPumpkinSVG() {
    return (
      '<svg viewBox="0 0 40 36" aria-hidden="true">' +
      '<path d="M3 27C2 22 8 19 13 20C14 15 21 14 25 17C29 15 36 18 35 23C39 25 37 30 32 30C28 33 20 32 16 32C10 33 4 31 3 27Z" fill="#e07020"/>' +
      '<path d="M9 26C12 22 18 23 21 25C25 22 30 23 32 27C27 29 22 29 19 30C14 30 10 29 9 26Z" fill="#c75a12"/>' +
      '<ellipse cx="14" cy="22" rx="3" ry="1.4" fill="#f08a38"/>' +
      '<ellipse cx="18" cy="26" rx="1.6" ry="0.9" fill="#f6dfb0" transform="rotate(-20 18 26)"/>' +
      '<ellipse cx="24" cy="27" rx="1.6" ry="0.9" fill="#f6dfb0" transform="rotate(15 24 27)"/>' +
      '<ellipse cx="28" cy="24" rx="1.4" ry="0.8" fill="#f6dfb0" transform="rotate(-10 28 24)"/>' +
      '<path d="M22 14l4-4 2 2-3 4z" fill="#3d7a32"/>' +
      '<circle cx="2" cy="18" r="1.6" fill="#e07020"/>' +
      '<circle cx="38" cy="20" r="1.4" fill="#e07020"/>' +
      '<circle cx="33" cy="12" r="1.2" fill="#c75a12"/>' +
      '<circle cx="8" cy="14" r="1.3" fill="#e07020"/>' +
      '<circle cx="20" cy="7" r="1" fill="#f08a38"/>' +
      '<path d="M12 31q0 4 1.5 5q1.5-1 1.5-5z" fill="#c75a12"/>' +
      '</svg>'
    );
  }

  // pumpkins that have been smashed - stays until the page is refreshed
  var smashedPumpkins = {};

  function decorateFrames(season) {
    document.querySelectorAll('.frame-deco').forEach(function (el) { el.remove(); });
    if (season !== 'halloween' && season !== 'christmas') return;
    document.querySelectorAll('.retro-window').forEach(function (win, index) {
      if (season === 'halloween') {
        win.appendChild(createPumpkin('left', index + '-left'));
        win.appendChild(createPumpkin('right', index + '-right'));
      } else {
        var lights = document.createElement('div');
        lights.className = 'frame-deco frame-lights';
        lights.innerHTML = '<span class="wire"></span>';
        for (var i = 0; i < 11; i += 1) {
          lights.appendChild(createBulb(index + '-' + i));
        }
        win.appendChild(lights);
      }
    });
  }

  // builds one frame pumpkin; if it was smashed earlier it comes back smashed
  function createPumpkin(side, key) {
    var outer = document.createElement('div');
    outer.className = 'frame-deco frame-pumpkin frame-pumpkin-' + side;
    var inner = document.createElement('span');
    inner.className = 'frame-pumpkin-inner';
    outer.appendChild(inner);

    if (smashedPumpkins[key]) {
      outer.classList.add('is-smashed');
      inner.innerHTML = smashedPumpkinSVG();
    } else {
      inner.innerHTML = pumpkinSVG();
      outer.addEventListener('click', function () { smashPumpkin(outer, inner, key); });
    }
    return outer;
  }

  // instant smash: swap to the splat, throw a few chunks, play the splash
  function smashPumpkin(outer, inner, key) {
    if (smashedPumpkins[key]) return;
    smashedPumpkins[key] = true;
    outer.classList.add('is-smashed');
    inner.innerHTML = smashedPumpkinSVG();
    inner.classList.add('splat-pop');
    spawnChunks(outer);
    playSplash();
    checkPumpkinBoss();
  }

  function spawnChunks(outer, count) {
    var colors = ['#e07020', '#f08a38', '#c75a12', '#f6dfb0'];
    var total = count || 10;
    for (var i = 0; i < total; i += 1) {
      var chunk = document.createElement('span');
      chunk.className = 'frame-chunk';
      var angle = Math.random() * Math.PI * 2;
      var dist = 22 + Math.random() * 34;
      var size = 3 + Math.random() * 4;
      chunk.style.setProperty('--dx', (Math.cos(angle) * dist) + 'px');
      chunk.style.setProperty('--dy', (Math.sin(angle) * dist * 0.8 - 6) + 'px');
      chunk.style.background = colors[i % colors.length];
      chunk.style.width = size + 'px';
      chunk.style.height = size + 'px';
      outer.appendChild(chunk);
      (function (c) {
        setTimeout(function () { if (c.parentNode) c.parentNode.removeChild(c); }, 700);
      })(chunk);
    }
  }

  // soft wet splash: low-passed noise burst that closes down, plus a
  // short low thump - filtered so it stays gentle on the ears
  function playSplash() {
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      var ctx = new Ctx();
      var t0 = ctx.currentTime;

      var len = Math.floor(ctx.sampleRate * 0.4);
      var buffer = ctx.createBuffer(1, len, ctx.sampleRate);
      var data = buffer.getChannelData(0);
      for (var i = 0; i < len; i += 1) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
      }
      var noise = ctx.createBufferSource();
      noise.buffer = buffer;
      var filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2600, t0);
      filter.frequency.exponentialRampToValueAtTime(350, t0 + 0.35);
      var noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.0001, t0);
      noiseGain.gain.exponentialRampToValueAtTime(0.28, t0 + 0.015);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.38);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      var thump = ctx.createOscillator();
      var thumpGain = ctx.createGain();
      thump.type = 'sine';
      thump.frequency.setValueAtTime(140, t0);
      thump.frequency.exponentialRampToValueAtTime(45, t0 + 0.14);
      thumpGain.gain.setValueAtTime(0.0001, t0);
      thumpGain.gain.exponentialRampToValueAtTime(0.35, t0 + 0.01);
      thumpGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.18);
      thump.connect(thumpGain);
      thumpGain.connect(ctx.destination);

      noise.start(t0);
      thump.start(t0);
      thump.stop(t0 + 0.2);
      setTimeout(function () { ctx.close(); }, 700);
    } catch (e) {
      // no web audio, the smash still happens silently
    }
  }

  // ---------------------------------------------------------------
  // shared audio: one context reused for lots of tiny sounds (bulbs,
  // taps) so rapid clicking never runs into the browser's context limit
  // ---------------------------------------------------------------
  var sharedAudio = null;
  function getAudioCtx() {
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      if (!sharedAudio) sharedAudio = new Ctx();
      if (sharedAudio.state === 'suspended') sharedAudio.resume();
      return sharedAudio;
    } catch (e) {
      return null;
    }
  }

  function noiseBuffer(ctx, seconds, power) {
    var len = Math.floor(ctx.sampleRate * seconds);
    var buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < len; i += 1) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, power);
    }
    return buffer;
  }

  // tiny glassy tick + a short ring
  function playBulbPop() {
    var ctx = getAudioCtx();
    if (!ctx) return;
    try {
      var t0 = ctx.currentTime;
      var src = ctx.createBufferSource();
      src.buffer = noiseBuffer(ctx, 0.05, 3);
      var hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 2500;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.2, t0);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.05);
      src.connect(hp);
      hp.connect(g);
      g.connect(ctx.destination);
      src.start(t0);

      var o = ctx.createOscillator();
      var og = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(2400, t0);
      o.frequency.exponentialRampToValueAtTime(1500, t0 + 0.12);
      og.gain.setValueAtTime(0.0001, t0);
      og.gain.exponentialRampToValueAtTime(0.08, t0 + 0.005);
      og.gain.exponentialRampToValueAtTime(0.001, t0 + 0.14);
      o.connect(og);
      og.connect(ctx.destination);
      o.start(t0);
      o.stop(t0 + 0.16);
    } catch (e) {}
  }

  // ---------------------------------------------------------------
  // christmas lights: press a bulb and it breaks, stays broken until
  // the page is refreshed (even if the season is switched off and on)
  // ---------------------------------------------------------------
  var brokenBulbs = {};

  function createBulb(key) {
    var bulb = document.createElement('span');
    bulb.className = 'bulb';
    if (brokenBulbs[key]) {
      bulb.classList.add('is-broken');
    } else {
      bulb.addEventListener('click', function () { breakBulb(bulb, key); });
    }
    return bulb;
  }

  function breakBulb(bulb, key) {
    if (brokenBulbs[key]) return;
    brokenBulbs[key] = true;
    var color = window.getComputedStyle(bulb).backgroundColor;
    bulb.classList.add('is-broken');
    spawnShards(bulb, color);
    playBulbPop();
  }

  // glass shards go on the parent strip (the broken bulb is clipped)
  function spawnShards(bulb, color) {
    var strip = bulb.parentNode;
    if (!strip) return;
    var colors = [color, '#ffffff', color, 'rgba(255,255,255,0.75)'];
    for (var i = 0; i < 7; i += 1) {
      var shard = document.createElement('span');
      shard.className = 'bulb-shard';
      var size = 2 + Math.random() * 2.5;
      shard.style.width = size + 'px';
      shard.style.height = size + 'px';
      shard.style.left = (bulb.offsetLeft + bulb.offsetWidth / 2) + 'px';
      shard.style.top = (bulb.offsetTop + 4) + 'px';
      shard.style.background = colors[i % colors.length];
      shard.style.setProperty('--dx', ((Math.random() - 0.5) * 30) + 'px');
      shard.style.setProperty('--dy', (8 + Math.random() * 20) + 'px');
      shard.style.setProperty('--rot', ((Math.random() - 0.5) * 540) + 'deg');
      strip.appendChild(shard);
      (function (el) {
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 650);
      })(shard);
    }
  }

  // ---------------------------------------------------------------
  // giant pumpkin: once every frame pumpkin is smashed, a big one
  // shows up - tap it 100 times before the clock runs out
  // ---------------------------------------------------------------
  var BOSS_TAPS = 100;
  var BOSS_TIME_MS = 15000;
  var bossDone = false;      // defeated or skipped - stays until refresh
  var bossPending = false;
  var boss = null;

  function currentSeasonName() {
    return root.getAttribute('data-season') || 'none';
  }

  function allFramePumpkinsSmashed() {
    var frames = document.querySelectorAll('.retro-window');
    if (!frames.length) return false;
    for (var i = 0; i < frames.length; i += 1) {
      if (!smashedPumpkins[i + '-left'] || !smashedPumpkins[i + '-right']) return false;
    }
    return true;
  }

  function checkPumpkinBoss() {
    if (bossDone || bossPending || boss) return;
    if (currentSeasonName() !== 'halloween' || !allFramePumpkinsSmashed()) return;
    bossPending = true;
    // a beat, so the last splat can be seen first
    setTimeout(function () {
      bossPending = false;
      if (bossDone || boss) return;
      if (currentSeasonName() !== 'halloween' || !allFramePumpkinsSmashed()) return;
      startPumpkinBoss();
    }, 900);
  }

  function abortBoss() {
    if (boss) boss.cleanup(false);
  }

  function bossCracksSVG() {
    return (
      '<svg viewBox="0 0 40 36" aria-hidden="true">' +
      '<path class="crack-1" d="M20 9l-1.8 5 2.6 3.4-1.6 5.2"/>' +
      '<path class="crack-2" d="M11.5 14.5l3 3.5-2 4.5M28.5 14.5l-3 3.6 2 4.4"/>' +
      '<path class="crack-3" d="M8 21l5 1.5M32 21l-5 2M19.5 26l2.5 4.5-2.5 2.5"/>' +
      '</svg>'
    );
  }

  function bossTick(progress) {
    var ctx = getAudioCtx();
    if (!ctx) return;
    try {
      var t0 = ctx.currentTime;
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(240 + progress * 520, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.07, t0 + 0.004);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.06);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(t0);
      o.stop(t0 + 0.07);
    } catch (e) {}
  }

  // a dull crack when the pumpkin gets another fracture
  function bossCrackSound() {
    var ctx = getAudioCtx();
    if (!ctx) return;
    try {
      var t0 = ctx.currentTime;
      var src = ctx.createBufferSource();
      src.buffer = noiseBuffer(ctx, 0.14, 2);
      var lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 1800;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.24, t0);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.14);
      src.connect(lp);
      lp.connect(g);
      g.connect(ctx.destination);
      src.start(t0);
    } catch (e) {}
  }

  function bossFailSound() {
    var ctx = getAudioCtx();
    if (!ctx) return;
    try {
      var t0 = ctx.currentTime;
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(320, t0);
      o.frequency.exponentialRampToValueAtTime(110, t0 + 0.4);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.1, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.42);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(t0);
      o.stop(t0 + 0.45);
    } catch (e) {}
  }

  // big low-passed boom with a deep thump under it
  function bossExplosionSound() {
    var ctx = getAudioCtx();
    if (!ctx) return;
    try {
      var t0 = ctx.currentTime;
      var src = ctx.createBufferSource();
      src.buffer = noiseBuffer(ctx, 1.1, 1.6);
      var lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(3200, t0);
      lp.frequency.exponentialRampToValueAtTime(90, t0 + 1.0);
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.42, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 1.05);
      src.connect(lp);
      lp.connect(g);
      g.connect(ctx.destination);
      src.start(t0);

      var o = ctx.createOscillator();
      var og = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(110, t0);
      o.frequency.exponentialRampToValueAtTime(28, t0 + 0.6);
      og.gain.setValueAtTime(0.0001, t0);
      og.gain.exponentialRampToValueAtTime(0.5, t0 + 0.02);
      og.gain.exponentialRampToValueAtTime(0.001, t0 + 0.65);
      o.connect(og);
      og.connect(ctx.destination);
      o.start(t0);
      o.stop(t0 + 0.7);
    } catch (e) {}
  }

  function startPumpkinBoss() {
    var count = 0;
    var state = 'idle';        // idle -> running -> done, or running -> failing -> idle
    var deadline = 0;
    var ticker = null;
    var failTimer = null;
    var finishTimer = null;
    var stage = 0;

    var el = document.createElement('div');
    el.className = 'boss-overlay is-idle';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', t('boss.aria', { n: BOSS_TAPS }));
    el.innerHTML =
      '<button type="button" class="boss-skip">' + t('boss.skip') + '</button>' +
      '<div class="boss-title">' + t('boss.title') + '</div>' +
      '<button type="button" class="boss-pumpkin" aria-label="' + t('boss.tapAria') + '">' +
        '<span class="boss-art">' + pumpkinSVG() + '</span>' +
        '<span class="boss-cracks">' + bossCracksSVG() + '</span>' +
      '</button>' +
      '<div class="boss-hud">' +
        '<div class="boss-bar"><span class="boss-bar-fill"></span></div>' +
        '<div class="boss-meta"><span class="boss-count">0 / ' + BOSS_TAPS + '</span><span class="boss-time">' + (BOSS_TIME_MS / 1000).toFixed(1) + 's</span></div>' +
        '<div class="boss-hint">' + t('boss.hint', { n: BOSS_TAPS }) + '</div>' +
      '</div>' +
      '<div class="boss-flash"></div>';
    document.body.appendChild(el);

    var btn = el.querySelector('.boss-pumpkin');
    var art = el.querySelector('.boss-art');
    var fill = el.querySelector('.boss-bar-fill');
    var countEl = el.querySelector('.boss-count');
    var timeEl = el.querySelector('.boss-time');
    var titleEl = el.querySelector('.boss-title');
    var hintEl = el.querySelector('.boss-hint');
    var skipBtn = el.querySelector('.boss-skip');

    // fog and bats step aside, and the page behind stops scrolling
    if (seasonOverlay) seasonOverlay.classList.add('qte-on');
    root.classList.add('qte-lock');
    try { btn.focus({ preventScroll: true }); } catch (e) {}

    function setProgress() {
      fill.style.width = (count / BOSS_TAPS * 100) + '%';
      countEl.textContent = count + ' / ' + BOSS_TAPS;
      var next = count >= BOSS_TAPS * 0.7 ? 3 : count >= BOSS_TAPS * 0.45 ? 2 : count >= BOSS_TAPS * 0.2 ? 1 : 0;
      if (next !== stage) {
        btn.classList.remove('stage-1', 'stage-2', 'stage-3');
        if (next > 0) btn.classList.add('stage-' + next);
        if (next > stage) bossCrackSound();
        stage = next;
      }
    }

    function squash() {
      if (!art.animate) return;
      var tilt = Math.random() * 6 - 3;
      art.animate([
        { transform: 'scale(1) rotate(0deg)' },
        { transform: 'scale(0.92, 0.88) rotate(' + tilt + 'deg)' },
        { transform: 'scale(1) rotate(0deg)' }
      ], { duration: 90, easing: 'ease-out' });
    }

    function tick() {
      var left = deadline - Date.now();
      if (left <= 0) { fail(); return; }
      timeEl.textContent = (left / 1000).toFixed(1) + 's';
      timeEl.classList.toggle('is-low', left < 4000);
    }

    function fail() {
      clearInterval(ticker);
      ticker = null;
      state = 'failing';
      titleEl.textContent = t('boss.tooSlow');
      titleEl.classList.add('is-fail');
      hintEl.textContent = t('boss.healed');
      timeEl.textContent = '0.0s';
      bossFailSound();
      failTimer = setTimeout(function () {
        if (state !== 'failing') return;
        count = 0;
        stage = 0;
        btn.classList.remove('stage-1', 'stage-2', 'stage-3');
        setProgress();
        timeEl.textContent = (BOSS_TIME_MS / 1000).toFixed(1) + 's';
        timeEl.classList.remove('is-low');
        titleEl.textContent = t('boss.title');
        titleEl.classList.remove('is-fail');
        hintEl.textContent = t('boss.hint', { n: BOSS_TAPS });
        el.classList.add('is-idle');
        state = 'idle';
      }, 1300);
    }

    function hit() {
      if (state === 'done' || state === 'failing') return;
      if (state === 'idle') {
        state = 'running';
        el.classList.remove('is-idle');
        deadline = Date.now() + BOSS_TIME_MS;
        titleEl.textContent = t('boss.smashIt');
        hintEl.textContent = t('boss.keepTapping');
        ticker = setInterval(tick, 100);
      } else if (Date.now() > deadline) {
        fail();
        return;
      }
      count += 1;
      setProgress();
      squash();
      bossTick(count / BOSS_TAPS);
      if (count % 2 === 0) spawnChunks(btn, 3);
      if (count >= BOSS_TAPS) explode();
    }

    function explode() {
      state = 'done';
      clearInterval(ticker);
      ticker = null;
      titleEl.textContent = t('boss.smashed');
      hintEl.textContent = '';
      timeEl.classList.remove('is-low');

      var rect = btn.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;

      btn.classList.add('is-exploding');
      el.querySelector('.boss-flash').classList.add('go');
      el.classList.add('is-shaking');
      bossExplosionSound();

      var shock = document.createElement('span');
      shock.className = 'boss-shock';
      shock.style.left = cx + 'px';
      shock.style.top = cy + 'px';
      el.appendChild(shock);

      var colors = ['#e07020', '#f08a38', '#c75a12', '#f6dfb0', '#3d7a32'];
      var reach = Math.min(window.innerWidth, 760) * 0.45;
      for (var i = 0; i < 46; i += 1) {
        var chunk = document.createElement('span');
        chunk.className = 'boss-chunk';
        var angle = Math.random() * Math.PI * 2;
        var dist = 90 + Math.random() * reach;
        var size = 6 + Math.random() * 12;
        chunk.style.left = cx + 'px';
        chunk.style.top = cy + 'px';
        chunk.style.width = size + 'px';
        chunk.style.height = (size * (0.6 + Math.random() * 0.6)) + 'px';
        chunk.style.background = colors[i % colors.length];
        chunk.style.borderRadius = (i % 3 === 0 ? '50%' : '2px');
        chunk.style.setProperty('--dx', (Math.cos(angle) * dist) + 'px');
        chunk.style.setProperty('--dy', (Math.sin(angle) * dist * 0.85 + 40 + Math.random() * 110) + 'px');
        chunk.style.setProperty('--rot', ((Math.random() - 0.5) * 900) + 'deg');
        el.appendChild(chunk);
      }

      finishTimer = setTimeout(function () { cleanup(true); }, 1700);
    }

    // done = the event is over for good (smashed or skipped)
    function cleanup(done) {
      clearInterval(ticker);
      clearTimeout(failTimer);
      clearTimeout(finishTimer);
      document.removeEventListener('keydown', onKey);
      var wasBoss = boss;
      boss = null;
      if (done) bossDone = true;
      if (seasonOverlay) seasonOverlay.classList.remove('qte-on');
      root.classList.remove('qte-lock');
      if (done && wasBoss) {
        el.classList.add('is-leaving');
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 520);
      } else if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }

    function onKey(e) {
      if (e.key === 'Escape') { cleanup(true); }
    }

    btn.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      hit();
    });
    btn.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!e.repeat) hit();
      }
    });
    skipBtn.addEventListener('click', function () { cleanup(true); });
    document.addEventListener('keydown', onKey);

    boss = { el: el, cleanup: cleanup };
  }

  function renderSeason(season) {
    if (!seasonOverlay) return;
    abortBoss();
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
      checkPumpkinBoss();
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
      writeStored(SEASON_KEY, next);
    });
  }

  // scroll spy: mark active section in the rail, and track how long
  // someone lingers on a section to offer a "scroll down" nudge
  var SECTION_ORDER = ['home', 'about', 'skills', 'hobbies', 'contact'];
  var HINT_EXCLUDED = ['home', 'contact'];
  var DWELL_MS = 60000;

  var sections = document.querySelectorAll('#home, #about, #skills, #hobbies, #contact');
  var railItems = document.querySelectorAll('.rail-item');
  var scrollHint = document.getElementById('scroll-hint');
  var dwellTimer = null;
  var currentSectionId = null;

  // tab title follows the section in view (and the chosen language)
  function updateTitle() {
    var id = currentSectionId || 'home';
    document.title = id === 'home' ? 'Bert' : 'Bert | ' + t('nav.' + id);
  }

  function setActive(id) {
    if (id === currentSectionId) return;
    currentSectionId = id;
    updateTitle();

    railItems.forEach(function (item) {
      item.classList.toggle('active', item.getAttribute('data-section') === id);
    });

    clearTimeout(dwellTimer);
    hideScrollHint();
    if (HINT_EXCLUDED.indexOf(id) === -1) {
      dwellTimer = setTimeout(function () { showScrollHint(); }, DWELL_MS);
    }
  }

  function showScrollHint() {
    if (!scrollHint) return;
    scrollHint.hidden = false;
    requestAnimationFrame(function () { scrollHint.classList.add('show'); });
  }

  function hideScrollHint() {
    if (!scrollHint) return;
    scrollHint.classList.remove('show');
    scrollHint.hidden = true;
  }

  // nav auto-hide: after 7.5s with no activity the nav fades away. Only
  // scrolling (wheel, touch-drag, keys) or pressing the arrow brings it back;
  // other input (mouse, taps, typing) just keeps it from hiding.
  var NAV_IDLE_MS = 7500;
  var navIdleTimer = null;

  function restartNavIdleTimer() {
    clearTimeout(navIdleTimer);
    navIdleTimer = setTimeout(function () { root.classList.add('nav-idle'); }, NAV_IDLE_MS);
  }

  function showNav() {
    root.classList.remove('nav-idle');
    restartNavIdleTimer();
  }

  function noteActivity() {
    if (root.classList.contains('nav-idle')) return;
    restartNavIdleTimer();
  }

  ['pointerdown', 'mousemove', 'keydown'].forEach(function (evt) {
    window.addEventListener(evt, noteActivity, { passive: true });
  });
  ['scroll', 'wheel', 'touchmove'].forEach(function (evt) {
    window.addEventListener(evt, showNav, { passive: true });
  });
  document.querySelectorAll('.rail a').forEach(function (a) {
    a.addEventListener('click', showNav);
  });
  restartNavIdleTimer();

  if (scrollHint) {
    scrollHint.addEventListener('click', function () {
      showNav();
      var idx = SECTION_ORDER.indexOf(currentSectionId);
      var nextId = idx > -1 ? SECTION_ORDER[idx + 1] : null;
      var nextEl = nextId ? document.getElementById(nextId) : null;
      if (nextEl) nextEl.scrollIntoView({ behavior: 'smooth' });
      clearTimeout(dwellTimer);
      hideScrollHint();
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
  var confirmLabelKey = null;

  function renderConfirmMessage() {
    if (!confirmMessage) return;
    confirmMessage.textContent = confirmLabelKey
      ? t('confirm.msg', { label: t(confirmLabelKey) })
      : t('confirm.default');
  }

  function openConfirm(url, labelKey) {
    if (!confirmBackdrop) return;
    pendingUrl = url;
    confirmLabelKey = labelKey;
    renderConfirmMessage();
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
    if (href.indexOf('linkedin.com') !== -1) label = 'confirm.label.linkedin';
    else if (href.indexOf('github.com') !== -1) label = 'confirm.label.github';
    else if (href.indexOf('chamsyslighting.com') !== -1) label = 'confirm.label.chamsys';
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

  // apply the chosen language to everything tagged in the page and to the
  // labels that are set from script (theme, season, confirm popup)
  var langBtn = document.getElementById('lang-toggle');

  function applyLanguage(lang) {
    currentLang = lang;
    root.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    [['data-i18n-aria', 'aria-label'], ['data-i18n-alt', 'alt'], ['data-i18n-title', 'title']].forEach(function (pair) {
      document.querySelectorAll('[' + pair[0] + ']').forEach(function (el) {
        el.setAttribute(pair[1], t(el.getAttribute(pair[0])));
      });
    });

    applyTheme(currentTheme);
    if (seasonBtn) seasonBtn.setAttribute('aria-label', seasonAria(root.getAttribute('data-season') || 'none'));
    renderConfirmMessage();
    updateTitle();

    if (langBtn) {
      var label = langBtn.querySelector('.lang-label');
      if (label) label.textContent = lang.toUpperCase();
      langBtn.setAttribute('aria-label', t('lang.switch'));
    }
  }

  applyLanguage(currentLang);

  if (langBtn) {
    langBtn.addEventListener('click', function () {
      var next = currentLang === 'nl' ? 'en' : 'nl';
      userPickedLang = true;
      applyLanguage(next);
      writeStored(LANG_KEY, next);
    });
  }

  // follow live browser-language changes until a language is picked
  window.addEventListener('languagechange', function () {
    if (userPickedLang) return;
    applyLanguage(systemLanguage());
  });

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
      { x: baseX - spreadX, y: heroY - 105 },
      { x: baseX, y: heroY - 130 },
      { x: baseX + spreadX, y: heroY - 105 }
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
          dropLevelUp(baseX, Math.max(8, heroY - 100));
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
    el.textContent = t('egg.levelUp');
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