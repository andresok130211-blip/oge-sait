/* OGE AI Coach
   - запоминает ошибки ученика на страницах предметов (у каждого свои, в localStorage)
   - на главной показывает окошко с листаемыми подсказками
   - просит ИИ (/api/ai-coach) составить подсказки и выбрать задание дня
*/
(function () {
  if (window.OgeCoach) return;

  var KEY = 'oge_coach_v1';
  var MAX_MISTAKES = 150;
  var AI_COOLDOWN_MS = 20 * 60 * 1000;

  var SUBJ = {
    russian: 'Русский язык',
    math: 'Математика',
    history: 'История',
    biology: 'Биология',
    physics: 'Физика',
    english: 'Английский язык',
    geography: 'География',
    social: 'Обществознание',
    informatics: 'Информатика',
    literature: 'Литература',
    chemistry: 'Химия',
  };

  /* ---------- storage ---------- */
  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (d && typeof d === 'object') {
        d.mistakes = Array.isArray(d.mistakes) ? d.mistakes : [];
        d.stats = d.stats && typeof d.stats === 'object' ? d.stats : {};
        return d;
      }
    } catch (e) {}
    return { mistakes: [], stats: {}, ai: null };
  }
  function save(d) {
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
  }

  /* ---------- helpers ---------- */
  function subjectFromPath() {
    var p = window.location.pathname;
    for (var k in SUBJ) if (p.indexOf('/' + k + '/') !== -1) return k;
    return '';
  }
  function hash(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return String(h);
  }
  function clean(s, n) {
    return String(s == null ? '' : s).replace(/\s+/g, ' ').trim().slice(0, n);
  }
  function qTextOf(q) {
    var el = q.querySelector('.q-text');
    if (!el) return clean(q.textContent, 200);
    var c = el.cloneNode(true);
    var badges = c.querySelectorAll('.badge');
    for (var i = 0; i < badges.length; i++) badges[i].remove();
    return clean(c.textContent, 200);
  }
  function topicOf(q) {
    var box = q.closest('.unit, .lesson, section');
    if (!box) return '';
    var h = box.querySelector('h2, h3, .unit-title, summary');
    return clean(h ? h.textContent : '', 80);
  }
  function activeMistakes(d) {
    return d.mistakes
      .filter(function (m) { return (m.count || 0) > (m.fixed || 0); })
      .sort(function (a, b) {
        var ca = (a.count || 0) - (a.fixed || 0), cb = (b.count || 0) - (b.fixed || 0);
        return cb - ca || (b.t || 0) - (a.t || 0);
      });
  }
  function mistakesHash(d) {
    return hash(activeMistakes(d).slice(0, 15).map(function (m) {
      return m.id + ':' + m.count + ':' + (m.fixed || 0);
    }).join(','));
  }
  function apiUrl() {
    var host = window.location.hostname;
    var isLocal = /^(localhost|127\.0\.0\.1)$/i.test(host) &&
      window.location.port !== '8888' && window.location.port !== '8889';
    if (isLocal || window.location.protocol === 'file:') {
      return 'https://preparationforoge.netlify.app/api/ai-coach';
    }
    return '/api/ai-coach';
  }

  /* ---------- recording answers ---------- */
  function record(q, opt, isRight) {
    var subj = subjectFromPath();
    if (!subj) return;
    var d = load();
    var st = d.stats[subj] || (d.stats[subj] = { ok: 0, bad: 0 });
    var text = qTextOf(q);
    var id = subj + '|' + hash(text);
    var i, found = null;
    for (i = 0; i < d.mistakes.length; i++) {
      if (d.mistakes[i].id === id) { found = d.mistakes[i]; break; }
    }

    if (isRight) {
      st.ok++;
      if (found) found.fixed = (found.fixed || 0) + 1;
    } else {
      st.bad++;
      var correctEl = q.querySelector('.opt.correct');
      var picked = clean(opt.textContent, 120);
      var correct = clean(correctEl ? correctEl.textContent : '', 120);
      if (found) {
        found.count = (found.count || 0) + 1;
        found.t = Date.now();
        found.picked = picked;
        if (correct) found.correct = correct;
      } else {
        d.mistakes.push({
          id: id, subj: subj, topic: topicOf(q), q: text,
          picked: picked, correct: correct, count: 1, fixed: 0, t: Date.now(),
        });
      }
      if (d.mistakes.length > MAX_MISTAKES) {
        d.mistakes.sort(function (a, b) { return (b.t || 0) - (a.t || 0); });
        d.mistakes.length = MAX_MISTAKES;
      }
      addExplainButton(q, subj, text, picked, correct);
    }
    save(d);
  }

  function addExplainButton(q, subj, text, picked, correct) {
    if (q.querySelector('.coach-explain')) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'coach-explain';
    b.textContent = '🤖 Объясни, почему я ошибся';
    b.addEventListener('click', function () {
      var open = document.getElementById('aiTutorBtn');
      var input = document.getElementById('aiTutorInput');
      var form = document.getElementById('aiTutorForm');
      var sel = document.getElementById('aiTutorSubject');
      if (!open || !input || !form) return;
      open.click();
      if (sel) sel.value = subj;
      input.value = 'Я ошибся в задании: «' + text + '». Я выбрал «' + picked + '»' +
        (correct ? ', а верный ответ «' + correct + '»' : '') +
        '. Объясни простыми словами, почему так.';
      if (form.requestSubmit) form.requestSubmit();
    });
    var fb = q.querySelector('.fb');
    if (fb && fb.parentNode) fb.parentNode.insertBefore(b, fb.nextSibling);
    else q.appendChild(b);
  }

  document.addEventListener('click', function (e) {
    var opt = e.target && e.target.closest ? e.target.closest('.q-item .opt') : null;
    if (!opt) return;
    setTimeout(function () {
      var q = opt.closest('.q-item');
      if (!q || q.getAttribute('data-coach-done') === '1') return;
      var wrong = opt.classList.contains('wrong');
      var right = opt.classList.contains('correct');
      if (!wrong && !right) return;
      q.setAttribute('data-coach-done', '1');
      record(q, opt, right);
    }, 150);
  }, true);

  /* ---------- local (offline) hints ---------- */
  function localCards(d) {
    var cards = [];
    var act = activeMistakes(d);
    var total = 0, subjStats = [];
    for (var k in d.stats) {
      var s = d.stats[k], n = (s.ok || 0) + (s.bad || 0);
      total += n;
      if (SUBJ[k] && n >= 3) subjStats.push({ id: k, n: n, bad: s.bad || 0, rate: (s.bad || 0) / n });
    }

    if (!total) {
      return [{
        icon: '👋', title: 'Я твой ИИ-наставник',
        text: 'Решай задания в любом предмете — я запомню твои ошибки и подскажу, что повторить.',
      }];
    }

    subjStats.sort(function (a, b) { return b.rate - a.rate; });
    if (subjStats.length && subjStats[0].bad > 0) {
      var w = subjStats[0];
      cards.push({
        icon: '🎯', title: 'Слабое место: ' + SUBJ[w.id],
        text: 'Ошибок: ' + w.bad + ' из ' + w.n + '. Начни с повторения теории по этому предмету, потом реши ещё несколько заданий.',
        href: w.id + '/index.html',
      });
    }

    var repeated = act.filter(function (m) { return (m.count - (m.fixed || 0)) >= 2; }).slice(0, 2);
    repeated.forEach(function (m) {
      cards.push({
        icon: '🔁', title: 'Повторная ошибка · ' + (SUBJ[m.subj] || ''),
        text: '«' + m.q + '» — верный ответ: «' + (m.correct || '—') + '». Ты ошибался здесь уже ' + m.count + ' р.',
        href: m.subj + '/index.html',
      });
    });

    act.slice(0, 3).forEach(function (m) {
      if (repeated.indexOf(m) !== -1) return;
      cards.push({
        icon: '🧠', title: 'Запомнил ошибку · ' + (SUBJ[m.subj] || ''),
        text: '«' + m.q + '» Ты выбрал «' + m.picked + '», верно — «' + (m.correct || '—') + '».',
        href: m.subj + '/index.html',
      });
    });

    if (!act.length) {
      cards.push({
        icon: '🌟', title: 'Ошибок нет',
        text: 'Все допущенные ошибки ты уже исправил. Попробуй задания посложнее или другой предмет.',
      });
    }
    return cards.slice(0, 6);
  }

  function currentCards(d) {
    if (d.ai && Array.isArray(d.ai.cards) && d.ai.cards.length && d.ai.hash === mistakesHash(d)) {
      return d.ai.cards.map(function (c) {
        return { icon: '🤖', title: c.title, text: c.text, href: SUBJ[c.subject] ? c.subject + '/index.html' : '' };
      });
    }
    return localCards(d);
  }

  /* ---------- AI request ---------- */
  var asking = false;
  function askAI(force, done) {
    var d = load();
    var act = activeMistakes(d);
    var h = mistakesHash(d);
    if (!act.length) { if (done) done(false); return; }
    if (!force) {
      if (d.ai && d.ai.hash === h) { if (done) done(false); return; }
      if (d.ai && Date.now() - (d.ai.at || 0) < AI_COOLDOWN_MS) { if (done) done(false); return; }
    }
    if (asking) return;
    asking = true;

    var payload = {
      mistakes: act.slice(0, 15).map(function (m) {
        return {
          subject: m.subj, topic: m.topic, question: m.q,
          picked: m.picked, correct: m.correct, count: m.count, fixed: m.fixed || 0,
        };
      }),
      stats: d.stats,
    };

    fetch(apiUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (!res.ok || !res.j || !Array.isArray(res.j.cards) || !res.j.cards.length) throw new Error('bad');
        var cur = load();
        cur.ai = {
          cards: res.j.cards, mission: res.j.mission || null,
          hash: mistakesHash(cur), at: Date.now(), day: new Date().toDateString(),
        };
        save(cur);
        if (done) done(true);
      })
      .catch(function () { if (done) done(false); })
      .then(function () { asking = false; render(); applyMission(); });
  }

  /* ---------- AI-chosen daily mission (main page) ---------- */
  function applyMission() {
    var title = document.getElementById('missionTitle');
    var desc = document.getElementById('missionDesc');
    var go = document.getElementById('missionGo');
    if (!title || !desc || !go) return;
    var d = load();
    var m = d.ai && d.ai.mission;
    if (!m || !SUBJ[m.subject] || d.ai.day !== new Date().toDateString()) return;
    title.textContent = clean(m.title, 80) || SUBJ[m.subject];
    desc.textContent = clean(m.desc, 240);
    go.href = m.subject + '/index.html';
    var tag = document.querySelector('#missionCard .mission-tag');
    if (tag) tag.textContent = '🤖 Задание дня · выбрал ИИ';
  }

  /* ---------- widget on main page ---------- */
  var track, dots, meta;

  function injectStyles() {
    var css = [
      '.coach{background:#fff;border:1px solid #e2e8f0;border-radius:22px;padding:14px;margin-bottom:16px;box-shadow:0 8px 28px rgba(124,58,237,.12)}',
      '.coach-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;color:#1e1b4b;font-weight:800;font-size:1rem}',
      '.coach-btn{border:none;background:#f1f5f9;color:#334155;border-radius:10px;padding:6px 10px;font:inherit;font-size:.78rem;font-weight:700;cursor:pointer}',
      '.coach-btn:disabled{opacity:.5;cursor:default}',
      '.coach-track{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none}',
      '.coach-track::-webkit-scrollbar{display:none}',
      '.coach-card{flex:0 0 100%;scroll-snap-align:start;background:linear-gradient(135deg,#f5f3ff,#fdf2f8);border:1px solid #ede9fe;border-radius:16px;padding:14px;min-height:112px;display:flex;flex-direction:column;gap:6px}',
      '.coach-card h4{margin:0;color:#4c1d95;font-size:.95rem}',
      '.coach-card p{margin:0;color:#334155;font-size:.86rem;line-height:1.45}',
      '.coach-card a{margin-top:auto;align-self:flex-start;color:#7c3aed;font-weight:800;font-size:.82rem;text-decoration:none}',
      '.coach-foot{display:flex;align-items:center;justify-content:space-between;margin-top:10px;gap:8px}',
      '.coach-dots{display:flex;gap:6px;align-items:center;justify-content:center;flex:1}',
      '.coach-dot{width:8px;height:8px;border-radius:50%;background:#ddd6fe;border:none;padding:0;cursor:pointer}',
      '.coach-dot.on{background:#7c3aed;width:20px;border-radius:99px}',
      '.coach-meta{margin-top:8px;display:flex;justify-content:space-between;align-items:center;font-size:.74rem;color:#64748b}',
      '.coach-clear{background:none;border:none;color:#94a3b8;font:inherit;font-size:.74rem;text-decoration:underline;cursor:pointer;padding:0}',
      '.coach-explain{display:inline-block;margin-top:8px;background:#eef2ff;color:#4338ca;border:1px solid #c7d2fe;border-radius:999px;padding:7px 12px;font:inherit;font-size:.82rem;font-weight:700;cursor:pointer}',
    ].join('');
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
  }

  function buildWidget() {
    var anchor = document.getElementById('missionCard');
    if (!anchor || document.getElementById('coachWidget')) return false;
    var w = document.createElement('div');
    w.id = 'coachWidget';
    w.className = 'coach';
    w.innerHTML =
      '<div class="coach-head"><span>🤖 ИИ-наставник</span>' +
      '<button type="button" class="coach-btn" id="coachRefresh">Обновить</button></div>' +
      '<div class="coach-track" id="coachTrack"></div>' +
      '<div class="coach-foot">' +
      '<button type="button" class="coach-btn" id="coachPrev" aria-label="Назад">‹</button>' +
      '<div class="coach-dots" id="coachDots"></div>' +
      '<button type="button" class="coach-btn" id="coachNext" aria-label="Дальше">›</button></div>' +
      '<div class="coach-meta"><span id="coachMeta"></span>' +
      '<button type="button" class="coach-clear" id="coachClear">Забыть ошибки</button></div>';
    anchor.parentNode.insertBefore(w, anchor.nextSibling);

    track = document.getElementById('coachTrack');
    dots = document.getElementById('coachDots');
    meta = document.getElementById('coachMeta');

    function go(delta) {
      var idx = Math.round(track.scrollLeft / Math.max(1, track.clientWidth)) + delta;
      var n = track.children.length;
      idx = Math.max(0, Math.min(n - 1, idx));
      track.scrollTo({ left: idx * track.clientWidth, behavior: 'smooth' });
    }
    document.getElementById('coachPrev').addEventListener('click', function () { go(-1); });
    document.getElementById('coachNext').addEventListener('click', function () { go(1); });
    track.addEventListener('scroll', markDot);

    var refresh = document.getElementById('coachRefresh');
    refresh.addEventListener('click', function () {
      refresh.disabled = true;
      refresh.textContent = 'Думаю…';
      askAI(true, function (ok) {
        refresh.disabled = false;
        refresh.textContent = 'Обновить';
        if (!ok && window.toast) window.toast('Пока без ИИ — показываю обычные подсказки');
      });
      setTimeout(function () { refresh.disabled = false; refresh.textContent = 'Обновить'; }, 15000);
    });

    document.getElementById('coachClear').addEventListener('click', function () {
      if (!window.confirm('Удалить все запомненные ошибки и подсказки?')) return;
      try { localStorage.removeItem(KEY); } catch (e) {}
      render();
    });
    return true;
  }

  function markDot() {
    if (!track || !dots) return;
    var idx = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
    var list = dots.children;
    for (var i = 0; i < list.length; i++) list[i].classList.toggle('on', i === idx);
  }

  function render() {
    if (!track) return;
    var d = load();
    var cards = currentCards(d);
    track.innerHTML = '';
    dots.innerHTML = '';
    cards.forEach(function (c, i) {
      var el = document.createElement('div');
      el.className = 'coach-card';
      var h = document.createElement('h4');
      h.textContent = (c.icon || '💡') + ' ' + clean(c.title, 80);
      var p = document.createElement('p');
      p.textContent = clean(c.text, 300);
      el.appendChild(h);
      el.appendChild(p);
      if (c.href) {
        var a = document.createElement('a');
        a.href = c.href;
        a.textContent = 'Повторить →';
        el.appendChild(a);
      }
      track.appendChild(el);

      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'coach-dot' + (i === 0 ? ' on' : '');
      dot.setAttribute('aria-label', 'Подсказка ' + (i + 1));
      dot.addEventListener('click', function () {
        track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
      });
      dots.appendChild(dot);
    });
    track.scrollLeft = 0;

    var act = activeMistakes(d);
    var subs = {};
    act.forEach(function (m) { subs[m.subj] = 1; });
    meta.textContent = act.length
      ? 'В памяти: ' + act.length + ' ' + plural(act.length, 'ошибка', 'ошибки', 'ошибок') +
        ' · ' + Object.keys(subs).length + ' ' + plural(Object.keys(subs).length, 'предмет', 'предмета', 'предметов')
      : 'Ошибок в памяти нет';
  }

  function plural(n, a, b, c) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return a;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return b;
    return c;
  }

  function init() {
    injectStyles();
    if (buildWidget()) {
      render();
      applyMission();
      var skip = document.getElementById('missionSkip');
      if (skip) skip.addEventListener('click', function () {
        setTimeout(function () {
          var tag = document.querySelector('#missionCard .mission-tag');
          if (tag) tag.textContent = '⚡ Задание дня';
        }, 30);
      });
      askAI(false);
    }
  }

  window.OgeCoach = { load: load, askAI: askAI, render: render };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
