/* OGE AI Coach: remembers every student's mistakes, picks tasks and shows personal hints */
(function () {
  if (window.__ogeCoach) return;
  window.__ogeCoach = true;

  var SUBJECTS = {
    russian: { name: 'Русский язык', icon: '📖' },
    math: { name: 'Математика', icon: '🔢' },
    history: { name: 'История', icon: '🏛️' },
    biology: { name: 'Биология', icon: '🧬' },
    physics: { name: 'Физика', icon: '⚛️' },
    english: { name: 'Английский', icon: '🇬🇧' },
    geography: { name: 'География', icon: '🌍' },
    social: { name: 'Обществознание', icon: '⚖️' },
    informatics: { name: 'Информатика', icon: '💻' },
    literature: { name: 'Литература', icon: '📕' },
    chemistry: { name: 'Химия', icon: '⚗️' },
  };
  // Prefixes used by the main-page mini test ("Русский: ...")
  var QUIZ_PREFIX = { 'русский': 'russian', 'математика': 'math', 'история': 'history', 'биология': 'biology', 'физика': 'physics' };

  var UID_KEY = 'oge_coach_uid';
  var CACHE_KEY = 'oge_coach_cache';
  var LOCAL_KEY = 'oge_coach_local';

  function uid() {
    var id = localStorage.getItem(UID_KEY);
    if (!id || !/^[a-zA-Z0-9-]{16,64}$/.test(id)) {
      id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
        : 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 12) + Math.random().toString(36).slice(2, 8);
      localStorage.setItem(UID_KEY, id);
    }
    return id;
  }

  function api(path) {
    var isLocal = /^(localhost|127\.0\.0\.1)$/i.test(location.hostname) && location.port !== '8888' && location.port !== '8889';
    return (isLocal ? 'https://preparationforoge.netlify.app' : '') + '/api/coach' + path;
  }

  function readJSON(key, def) {
    try { return JSON.parse(localStorage.getItem(key) || '') || def; } catch (e) { return def; }
  }
  function writeJSON(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }

  function pageSubject() {
    var p = location.pathname;
    for (var k in SUBJECTS) if (p.indexOf('/' + k + '/') !== -1) return k;
    return '';
  }
  var isHome = !pageSubject();

  function txt(el) { return el ? String(el.textContent || '').replace(/\s+/g, ' ').trim() : ''; }

  /* ---------- Answer tracking ---------- */
  var queue = [];
  var flushTimer = null;
  var seen = typeof WeakSet === 'function' ? new WeakSet() : null;

  function flush(beacon) {
    clearTimeout(flushTimer);
    if (!queue.length) return;
    var payload = JSON.stringify({ uid: uid(), events: queue.splice(0, 40) });
    if (beacon && navigator.sendBeacon) {
      navigator.sendBeacon(api('/event'), payload);
      return;
    }
    fetch(api('/event'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true })
      .catch(function () {});
  }

  function push(ev) {
    queue.push(ev);
    // Local copy so badges and offline hints work instantly
    var local = readJSON(LOCAL_KEY, { wrong: [] });
    if (ev.type === 'wrong') {
      local.wrong = local.wrong.filter(function (w) { return w.question !== ev.question; });
      local.wrong.unshift({ subject: ev.subject, topic: ev.topic, question: ev.question, correct: ev.correct });
      local.wrong = local.wrong.slice(0, 60);
    } else {
      local.wrong = local.wrong.filter(function (w) { return w.question !== ev.question; });
    }
    writeJSON(LOCAL_KEY, local);
    clearTimeout(flushTimer);
    flushTimer = setTimeout(function () { flush(false); }, 1500);
  }

  function containerOf(el) {
    return el.closest('.q-item, .q-card, .open-task, [data-c]') || el.parentElement && el.parentElement.parentElement || el.parentElement;
  }

  function subjectFor(question) {
    var s = pageSubject();
    if (s) return s;
    var m = /^\s*(?:\d+\.\s*)?([А-Яа-яЁё]+)\s*:/.exec(question);
    return m ? QUIZ_PREFIX[m[1].toLowerCase()] || '' : '';
  }

  function topicFor(c) {
    var unit = c.closest('.unit');
    var h = unit && unit.querySelector('.unit-header h3, h3');
    if (h) return txt(h);
    if (c.closest('#quizPanel')) return 'Мини-тест';
    var box = c.closest('.lesson, section');
    var h2 = box && box.querySelector('h3, h4, h5');
    return txt(h2);
  }

  function questionOf(c) {
    var q = c.querySelector('.q-text, .task-text, .q, h4, h5, p, label');
    var t = txt(q) || txt(c);
    return t.slice(0, 500);
  }

  function handle(el, isWrong) {
    var c = containerOf(el);
    if (!c) return;
    if (seen) { if (seen.has(c)) return; } else if (c.dataset.coachSeen) return;
    // Wait a tick: the page marks the right option right after the wrong one
    setTimeout(function () {
      if (seen) { if (seen.has(c)) return; seen.add(c); } else { if (c.dataset.coachSeen) return; c.dataset.coachSeen = '1'; }
      var wrong = isWrong || !!c.querySelector('.wrong, .bad');
      var question = questionOf(c);
      var subject = subjectFor(question);
      if (!subject || !question) return;
      var optEls = c.querySelectorAll('.opt, .q-opt');
      var options = [];
      for (var i = 0; i < optEls.length; i++) options.push(txt(optEls[i]));
      var wrongEl = c.querySelector('.wrong, .bad');
      var correctEl = c.querySelector('.opt.correct, .q-opt.correct, .correct-ans');
      var correct = txt(correctEl);
      if (!correct && c.dataset.answer) correct = String(c.dataset.answer).split('|')[0];
      push({
        type: wrong ? 'wrong' : 'right',
        subject: subject,
        topic: topicFor(c),
        question: question,
        chosen: wrongEl ? (wrongEl.value != null && wrongEl.tagName === 'INPUT' ? wrongEl.value : txt(wrongEl)) : '',
        correct: correct.replace(/^Правильн\w*\s*(ответ)?\s*:?\s*/i, ''),
        options: options,
      });
    }, 60);
  }

  function watch() {
    if (!('MutationObserver' in window)) return;
    new MutationObserver(function (records) {
      for (var i = 0; i < records.length; i++) {
        var el = records[i].target;
        if (!el.classList || el.closest('#aiCoach')) continue;
        var old = ' ' + (records[i].oldValue || '') + ' ';
        if ((el.classList.contains('wrong') && old.indexOf(' wrong ') < 0) || (el.classList.contains('bad') && old.indexOf(' bad ') < 0)) handle(el, true);
        else if ((el.classList.contains('correct') && old.indexOf(' correct ') < 0 && el.matches('.opt, .q-opt')) ||
          (el.classList.contains('ok') && old.indexOf(' ok ') < 0 && el.matches('input'))) handle(el, false);
      }
    }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'], attributeOldValue: true });
    window.addEventListener('pagehide', function () { flush(true); });
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') flush(true); });
  }

  /* ---------- Styles ---------- */
  function styles() {
    var css = [
      '#aiCoach{position:relative;margin:0 0 16px;padding:16px 0 14px;border-radius:22px;background:linear-gradient(150deg,rgba(30,27,75,.92),rgba(76,29,149,.9));border:1px solid rgba(167,139,250,.35);color:#f8fafc;box-shadow:0 12px 36px rgba(15,10,30,.45);overflow:hidden}',
      '#aiCoach .ac-head{display:flex;align-items:center;gap:10px;padding:0 16px 10px}',
      '#aiCoach .ac-ava{width:40px;height:40px;border-radius:14px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.35rem;background:linear-gradient(135deg,#22d3ee,#a78bfa);box-shadow:0 0 0 3px rgba(34,211,238,.18)}',
      '#aiCoach h3{font-size:1rem;margin:0}',
      '#aiCoach .ac-sub{font-size:.78rem;color:#c4b5fd;margin-top:2px}',
      '#aiCoach .ac-refresh{margin-left:auto;background:rgba(255,255,255,.12);border:none;color:#fff;width:34px;height:34px;border-radius:50%;font-size:1rem;cursor:pointer;flex-shrink:0}',
      '#aiCoach .ac-refresh.spin{animation:acSpin 1s linear infinite}',
      '@keyframes acSpin{to{transform:rotate(360deg)}}',
      '#aiCoach .ac-track{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;padding:4px 16px 6px;scrollbar-width:none;-webkit-overflow-scrolling:touch}',
      '#aiCoach .ac-track::-webkit-scrollbar{display:none}',
      '#aiCoach .ac-card{flex:0 0 86%;max-width:360px;scroll-snap-align:center;background:rgba(255,255,255,.96);color:#1e1b4b;border-radius:16px;padding:13px 14px;min-height:118px;display:flex;flex-direction:column;gap:6px}',
      '#aiCoach .ac-tag{align-self:flex-start;font-size:.7rem;font-weight:700;padding:3px 9px;border-radius:999px;background:#ede9fe;color:#6d28d9}',
      '#aiCoach .ac-card b{font-size:.93rem}',
      '#aiCoach .ac-card p{font-size:.84rem;line-height:1.45;color:#475569;margin:0}',
      '#aiCoach .ac-nav{display:flex;align-items:center;justify-content:center;gap:10px;padding:6px 16px 0}',
      '#aiCoach .ac-arrow{background:rgba(255,255,255,.14);border:none;color:#fff;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:.95rem}',
      '#aiCoach .ac-dots{display:flex;gap:5px;flex-wrap:wrap;justify-content:center;max-width:70%}',
      '#aiCoach .ac-dots i{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.3);transition:.2s}',
      '#aiCoach .ac-dots i.on{background:#22d3ee;width:18px;border-radius:99px}',
      '#aiCoach .ac-actions{display:flex;gap:8px;flex-wrap:wrap;padding:12px 16px 0}',
      '#aiCoach .ac-btn{border:none;border-radius:12px;padding:9px 13px;font:inherit;font-size:.84rem;font-weight:700;cursor:pointer;background:rgba(255,255,255,.14);color:#fff}',
      '#aiCoach .ac-btn.main{background:linear-gradient(135deg,#22d3ee,#6366f1)}',
      '#aiCoach .ac-btn:disabled{opacity:.5;cursor:default}',
      '#aiCoach .ac-weak{display:flex;gap:6px;flex-wrap:wrap;padding:10px 16px 0}',
      '#aiCoach .ac-chip{font-size:.74rem;padding:4px 9px;border-radius:999px;background:rgba(244,114,182,.2);color:#fbcfe8;text-decoration:none}',
      '#aiCoach .ac-practice{margin:12px 16px 0;background:#fff;color:#1e1b4b;border-radius:16px;padding:14px}',
      '#aiCoach .ac-practice .q{font-weight:700;font-size:.92rem;margin:4px 0 10px;line-height:1.4}',
      '#aiCoach .ac-practice .o{display:block;width:100%;text-align:left;margin-bottom:7px;padding:10px 12px;border-radius:11px;border:1.5px solid #e2e8f0;background:#f8fafc;font:inherit;font-size:.86rem;cursor:pointer;color:#0f172a}',
      '#aiCoach .ac-practice .o.ok{border-color:#22c55e;background:#dcfce7}',
      '#aiCoach .ac-practice .o.no{border-color:#ef4444;background:#fee2e2}',
      '#aiCoach .ac-practice .meta{font-size:.74rem;color:#7c3aed;font-weight:700}',
      '#aiCoach .ac-practice .fbk{font-size:.84rem;margin:6px 0 8px;color:#475569}',
      '.ac-badge{display:inline-block;margin-top:4px;font-size:.7rem;font-weight:700;padding:2px 8px;border-radius:999px;background:#fee2e2;color:#b91c1c}',
      '.ac-focus{outline:3px solid #22d3ee;outline-offset:3px;border-radius:16px;transition:outline-color 2s}',
      '#acBanner{margin:10px 12px 0;padding:11px 14px;border-radius:16px;background:linear-gradient(135deg,rgba(34,211,238,.18),rgba(167,139,250,.22));border:1px solid rgba(167,139,250,.4);color:#f8fafc;font-size:.85rem;display:flex;gap:10px;align-items:center}',
      '#acBanner button{margin-left:auto;flex-shrink:0;border:none;border-radius:10px;padding:7px 11px;background:#22d3ee;color:#0f172a;font-weight:700;font:inherit;font-size:.8rem;cursor:pointer}',
    ].join('');
    var s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  /* ---------- Data ---------- */
  function load(refresh) {
    return fetch(api('?uid=' + encodeURIComponent(uid()) + (refresh ? '&refresh=1' : '')), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d && d.hints) writeJSON(CACHE_KEY, d); return d; })
      .catch(function () { return null; });
  }

  function offlinePlan() {
    var local = readJSON(LOCAL_KEY, { wrong: [] });
    var hints = local.wrong.slice(0, 6).map(function (w) {
      return { subject: w.subject, title: (SUBJECTS[w.subject] || {}).name + (w.topic ? ' · ' + w.topic : ''), text: 'Ошибка в вопросе «' + w.question.slice(0, 110) + '».' + (w.correct ? ' Правильно: ' + w.correct.slice(0, 110) + '.' : '') };
    });
    hints.push({ title: 'Я учусь у тебя', text: 'Решай тесты в предметах — я запомню ошибки и подберу задания и подсказки именно для тебя.' });
    hints.push({ title: 'Ошибка — это подсказка', text: 'Каждая ошибка показывает, что повторить. Вернись к ней через день — так знания закрепляются.' });
    return { hints: hints, mission: null, mistakesCount: local.wrong.length, bySubject: {}, practice: [] };
  }

  /* ---------- Home window ---------- */
  function renderHome(box, data) {
    box.innerHTML = '';
    var head = el('div', 'ac-head');
    head.appendChild(el('div', 'ac-ava', '🧠'));
    var t = el('div');
    t.appendChild(el('h3', '', 'Твой ИИ-наставник'));
    var n = data.mistakesCount || 0;
    var weak = Object.keys(data.bySubject || {}).sort(function (a, b) { return data.bySubject[b] - data.bySubject[a]; });
    t.appendChild(el('div', 'ac-sub', n
      ? 'Запомнил ошибок: ' + n + (weak[0] ? ' · слабое место: ' + SUBJECTS[weak[0]].name : '')
      : 'Решай тесты — я запомню ошибки и подскажу'));
    head.appendChild(t);
    var refresh = el('button', 'ac-refresh', '↻');
    refresh.type = 'button';
    refresh.title = 'Новые подсказки';
    refresh.onclick = function () {
      refresh.classList.add('spin');
      load(true).then(function (d) { refresh.classList.remove('spin'); if (d) { renderHome(box, d); applyMission(d.mission); } });
    };
    head.appendChild(refresh);
    box.appendChild(head);

    var track = el('div', 'ac-track');
    var hints = data.hints && data.hints.length ? data.hints : offlinePlan().hints;
    hints.forEach(function (h) {
      var c = el('div', 'ac-card');
      var s = SUBJECTS[h.subject];
      c.appendChild(el('span', 'ac-tag', s ? s.icon + ' ' + s.name : '💡 Совет'));
      c.appendChild(el('b', '', h.title));
      c.appendChild(el('p', '', h.text));
      track.appendChild(c);
    });
    box.appendChild(track);

    var nav = el('div', 'ac-nav');
    var prev = el('button', 'ac-arrow', '‹');
    var next = el('button', 'ac-arrow', '›');
    prev.type = next.type = 'button';
    prev.setAttribute('aria-label', 'Предыдущая подсказка');
    next.setAttribute('aria-label', 'Следующая подсказка');
    var dots = el('div', 'ac-dots');
    hints.forEach(function () { dots.appendChild(el('i')); });
    nav.appendChild(prev); nav.appendChild(dots); nav.appendChild(next);
    box.appendChild(nav);

    function current() {
      var cards = track.children;
      var mid = track.scrollLeft + track.clientWidth / 2, best = 0, bd = Infinity;
      for (var i = 0; i < cards.length; i++) {
        var d = Math.abs(cards[i].offsetLeft + cards[i].offsetWidth / 2 - mid);
        if (d < bd) { bd = d; best = i; }
      }
      return best;
    }
    function go(i) {
      var c = track.children[Math.max(0, Math.min(track.children.length - 1, i))];
      if (c) track.scrollTo({ left: c.offsetLeft - (track.clientWidth - c.offsetWidth) / 2, behavior: 'smooth' });
    }
    function mark() {
      var k = current();
      for (var i = 0; i < dots.children.length; i++) dots.children[i].className = i === k ? 'on' : '';
    }
    prev.onclick = function () { go(current() - 1); };
    next.onclick = function () { var k = current(); go(k >= track.children.length - 1 ? 0 : k + 1); };
    track.addEventListener('scroll', function () { clearTimeout(track._t); track._t = setTimeout(mark, 60); });
    setTimeout(mark, 50);

    if (weak.length) {
      var w = el('div', 'ac-weak');
      weak.slice(0, 4).forEach(function (k) {
        var a = el('a', 'ac-chip', SUBJECTS[k].icon + ' ' + SUBJECTS[k].name + ': ' + data.bySubject[k]);
        a.href = k + '/index.html';
        w.appendChild(a);
      });
      box.appendChild(w);
    }

    var actions = el('div', 'ac-actions');
    var practice = data.practice || [];
    var pb = el('button', 'ac-btn main', '🔁 Работа над ошибками' + (practice.length ? ' (' + practice.length + ')' : ''));
    pb.type = 'button';
    pb.disabled = !practice.length;
    pb.onclick = function () { startPractice(box, practice.slice(), data); };
    actions.appendChild(pb);
    var ask = el('button', 'ac-btn', '🤖 Спросить ИИ');
    ask.type = 'button';
    ask.onclick = function () { var b = document.getElementById('aiTutorBtn'); if (b) b.click(); };
    actions.appendChild(ask);
    box.appendChild(actions);
  }

  function startPractice(box, list, data) {
    var old = box.querySelector('.ac-practice');
    if (old) old.remove();
    var wrap = el('div', 'ac-practice');
    box.appendChild(wrap);
    var fixed = 0, total = list.length;
    function show() {
      wrap.innerHTML = '';
      var item = list.shift();
      if (!item) {
        wrap.appendChild(el('div', 'q', 'Готово! Исправлено ошибок: ' + fixed + ' из ' + total + ' 🎉'));
        var done = el('button', 'ac-btn main', 'Обновить подсказки');
        done.type = 'button';
        done.onclick = function () { load(true).then(function (d) { if (d) { renderHome(box, d); applyMission(d.mission); } }); };
        wrap.appendChild(done);
        if (fixed && window.ogeGainXP) window.ogeGainXP(fixed * 3, true);
        return;
      }
      var s = SUBJECTS[item.subject] || {};
      wrap.appendChild(el('div', 'meta', (s.icon || '') + ' ' + (s.name || '') + (item.topic ? ' · ' + item.topic : '') + ' · осталось ' + (list.length + 1)));
      wrap.appendChild(el('div', 'q', item.question.replace(/^\s*\d+\.\s*/, '')));
      var answered = false;
      item.options.forEach(function (o) {
        var b = el('button', 'o', o);
        b.type = 'button';
        b.onclick = function () {
          if (answered) return;
          answered = true;
          var ok = o === item.correct;
          b.classList.add(ok ? 'ok' : 'no');
          var all = wrap.querySelectorAll('.o');
          for (var i = 0; i < all.length; i++) if (txt(all[i]) === item.correct) all[i].classList.add('ok');
          if (ok) fixed++;
          else list.push(item); // ask again at the end
          fetch(api('/resolve'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uid: uid(), id: item.id, correct: ok }) }).catch(function () {});
          wrap.appendChild(el('div', 'fbk', ok ? '✓ Верно! Ошибка исправлена.' : '✗ Правильно: ' + item.correct + '. Вернёмся к этому вопросу в конце.'));
          var nb = el('button', 'ac-btn main', 'Дальше →');
          nb.type = 'button';
          nb.onclick = show;
          wrap.appendChild(nb);
        };
        wrap.appendChild(b);
      });
    }
    show();
    try { wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) {}
  }

  // The AI decides the daily mission on the main page
  function applyMission(m) {
    if (!m || !SUBJECTS[m.subject]) return;
    var card = document.getElementById('missionCard');
    if (!card) return;
    window.ogeAiMission = { subj: m.subject };
    var tag = card.querySelector('.mission-tag');
    if (tag) tag.textContent = '🧠 Задание дня от ИИ';
    var mt = document.getElementById('missionTitle');
    var md = document.getElementById('missionDesc');
    var go = document.getElementById('missionGo');
    if (mt) mt.textContent = SUBJECTS[m.subject].icon + ' ' + m.title;
    if (md) md.textContent = m.desc || '';
    if (go) {
      go.href = m.subject + '/index.html' + (m.topic ? '#ai-topic=' + encodeURIComponent(m.topic) : '');
      go.onclick = null;
    }
  }

  function initHome() {
    var box = document.getElementById('aiCoach');
    if (!box) return;
    var cached = readJSON(CACHE_KEY, null);
    renderHome(box, cached && cached.hints ? cached : offlinePlan());
    if (cached) applyMission(cached.mission);
    // "Другое" lets the student switch back to the regular mission list
    var skip = document.getElementById('missionSkip');
    if (skip) skip.addEventListener('click', function () {
      window.ogeAiMission = null;
      var tag = document.querySelector('#missionCard .mission-tag');
      if (tag) tag.textContent = '⚡ Задание дня';
    }, true);
    load(false).then(function (d) { if (d) { renderHome(box, d); applyMission(d.mission); } });
  }

  /* ---------- Subject pages: AI points to weak topics ---------- */
  function openTopic(topic) {
    var units = document.querySelectorAll('.unit');
    for (var i = 0; i < units.length; i++) {
      var h = units[i].querySelector('.unit-header h3');
      if (h && txt(h) === topic) {
        var path = units[i].closest('.path');
        if (path && path.classList.contains('hidden') && typeof window.switchTab === 'function') {
          window.switchTab(path.id.replace('path-', ''));
        }
        units[i].classList.add('open', 'ac-focus');
        var u = units[i];
        setTimeout(function () { try { u.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) {} }, 250);
        setTimeout(function () { u.classList.remove('ac-focus'); }, 6000);
        return true;
      }
    }
    return false;
  }

  function initSubject(subject) {
    var m = /ai-topic=([^&]+)/.exec(location.hash);
    if (m) openTopic(decodeURIComponent(m[1]));

    function badges(topics) {
      var units = document.querySelectorAll('.unit');
      for (var i = 0; i < units.length; i++) {
        var h = units[i].querySelector('.unit-header h3');
        if (!h) continue;
        var old = units[i].querySelector('.ac-badge');
        if (old) old.remove();
        var n = topics[txt(h)];
        if (n) h.parentNode.insertBefore(el('span', 'ac-badge', '🧠 ошибок: ' + n), h.nextSibling);
      }
    }
    function banner(data) {
      var t = (data.topics || {})[subject] || {};
      badges(t);
      var top = Object.keys(t).sort(function (a, b) { return t[b] - t[a]; })[0];
      var mission = data.mission && data.mission.subject === subject ? data.mission : null;
      var topic = (mission && mission.topic) || top;
      var old = document.getElementById('acBanner');
      if (old) old.remove();
      if (!topic && !mission) return;
      var b = el('div');
      b.id = 'acBanner';
      b.appendChild(el('span', '', '🧠'));
      b.appendChild(el('span', '', mission ? 'ИИ-наставник: ' + mission.title : 'ИИ-наставник советует повторить «' + topic + '»'));
      if (topic) {
        var btn = el('button', '', 'Открыть');
        btn.type = 'button';
        btn.onclick = function () { openTopic(topic); };
        b.appendChild(btn);
      }
      var hud = document.getElementById('ogeDailyHud') || document.querySelector('.topbar, header');
      if (hud && hud.parentNode) hud.parentNode.insertBefore(b, hud.nextSibling);
      else document.body.insertBefore(b, document.body.firstChild);
    }
    var cached = readJSON(CACHE_KEY, null);
    if (cached) banner(cached);
    load(false).then(function (d) { if (d) banner(d); });
  }

  function init() {
    styles();
    watch();
    if (isHome) initHome();
    else setTimeout(function () { initSubject(pageSubject()); }, 300);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
