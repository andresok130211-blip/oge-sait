/* ОГЭ: «Моя подготовка» — статистика, диагностика, пробный экзамен, план, шпаргалки, офлайн-видео, проверка письма */
(function () {
  if (window.__ogeX) return;
  window.__ogeX = 1;
  var SUBJ = { russian: 'Русский язык', math: 'Математика', english: 'Английский язык', literature: 'Литература', history: 'История', geography: 'География', biology: 'Биология', physics: 'Физика', chemistry: 'Химия', social: 'Обществознание', informatics: 'Информатика' };
  var S = (function () {
    var b = document.body.getAttribute('data-subject');
    if (b && SUBJ[b]) return b;
    for (var k in SUBJ) if (location.pathname.indexOf('/' + k + '/') >= 0) return k;
    return '';
  })();
  var LOGK = 'oge_x_log', DATEK = 'oge_x_date', HISTK = 'oge_x_exams';

  function rj(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } }
  function wj(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function day(t) { var d = new Date(t); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function pct(a, b) { return b ? Math.round(a * 100 / b) : 0; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* ---------- журнал ответов ---------- */
  function unitTitle(L) {
    var u = L.closest('.unit'), h = u && u.querySelector('.unit-info h3');
    return h ? h.textContent.trim() : '';
  }
  function log(id, unit, ok, subj) {
    var a = rj(LOGK, []);
    a.push({ t: Date.now(), s: subj || S, l: id, u: unit, ok: ok ? 1 : 0 });
    if (a.length > 4000) a = a.slice(-4000);
    wj(LOGK, a);
  }
  document.addEventListener('click', function (e) {
    var o = e.target.closest && e.target.closest('.q-item .opt');
    if (!o || !S || o.classList.contains('disabled')) return;
    var L = o.closest('.lesson');
    if (!L || !L.closest('#path-hard')) return;
    setTimeout(function () { log(L.dataset.lesson, unitTitle(L), o.classList.contains('correct')); }, 90);
  }, true);

  /* ---------- переход к уроку ---------- */
  function lessonHref(id) {
    var m = /^sc(\d+)-([a-z]+)-/.exec(id);
    return (S && S === m[2] ? '' : '../' + m[2] + '/index.html') + '#' + id;
  }
  function goLesson(id) {
    close();
    var L = document.querySelector('.lesson[data-lesson="' + id + '"]');
    if (!L) return;
    try { if (typeof switchTab === 'function') switchTab('hard'); } catch (e) {}
    var g = +/^sc(\d+)/.exec(id)[1];
    try { if (typeof showGrade === 'function') showGrade(g); } catch (e) {}
    var u = L.closest('.unit');
    if (u && !u.classList.contains('open')) { var h = u.querySelector('.unit-header'); if (h) h.click(); }
    setTimeout(function () {
      L.scrollIntoView({ behavior: 'smooth', block: 'start' });
      L.style.outline = '3px solid #22d3ee'; L.style.outlineOffset = '4px';
      setTimeout(function () { L.style.outline = ''; }, 2500);
    }, 250);
  }
  window.addEventListener('load', function () {
    if (/^#sc\d+-[a-z]+-\d+$/.test(location.hash)) setTimeout(function () { goLesson(location.hash.slice(1)); }, 400);
  });

  /* ---------- банк вопросов из страницы ---------- */
  function bank(grades) {
    var out = [];
    document.querySelectorAll('#path-hard .lesson[data-lesson]').forEach(function (L) {
      var id = L.dataset.lesson, g = +/^sc(\d+)/.exec(id)[1];
      if (grades && grades.indexOf(g) < 0) return;
      var u = unitTitle(L), lt = L.querySelector('h4').textContent;
      L.querySelectorAll('.q-item').forEach(function (q) {
        var os = []; q.querySelectorAll('.opt').forEach(function (o) { os.push(o.innerHTML); });
        out.push({ id: id, g: g, u: u, lt: lt, q: q.querySelector('.q-text').innerHTML, o: os, c: (+q.dataset.c) - 1, w: q.dataset.why || '' });
      });
    });
    return out;
  }
  function lessonsAll() {
    var out = [];
    document.querySelectorAll('#path-hard .lesson[data-lesson]').forEach(function (L) {
      var b = L.querySelector('.done-btn');
      out.push({ id: L.dataset.lesson, t: L.querySelector('h4').textContent, u: unitTitle(L), done: !!(b && b.disabled) });
    });
    return out;
  }

  /* ---------- окно ---------- */
  var M, timerId = null;
  function css() {
    var c = document.createElement('style');
    c.textContent = [
      '#xBtn{position:fixed;left:14px;bottom:74px;z-index:9997;border:0;border-radius:99px;padding:11px 16px;font:inherit;font-weight:700;font-size:.85rem;color:#fff;background:linear-gradient(135deg,#0ea5e9,#6366f1);box-shadow:0 6px 18px rgba(79,70,229,.4);cursor:pointer}',
      '#xm{position:fixed;inset:0;z-index:99996;background:rgba(5,10,20,.85);display:none;align-items:center;justify-content:center;padding:10px}',
      '#xm .xc{background:#fff;color:#1e293b;border-radius:18px;max-width:560px;width:100%;max-height:92vh;overflow:auto;padding:14px 16px;font-size:.95rem;line-height:1.45}',
      '#xm .xh{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px;position:sticky;top:-14px;background:#fff;padding:6px 0;z-index:2}',
      '#xm .xh b{font-size:1.05rem}#xm .xx{border:0;background:#e2e8f0;border-radius:99px;width:36px;height:36px;font-size:1.1rem;cursor:pointer}',
      '#xm .xb{border:2px solid #2563eb;background:#fff;color:#2563eb;border-radius:12px;padding:9px 13px;font:inherit;font-weight:700;cursor:pointer;margin:3px 3px 3px 0}',
      '#xm .xb.on,#xm .xb.pri{background:#2563eb;color:#fff}#xm .xb:disabled{opacity:.5}',
      '#xm .xmenu button{display:block;width:100%;text-align:left;border:0;background:#f1f5f9;border-radius:12px;padding:13px;margin:6px 0;font:inherit;font-weight:700;color:#1e293b;cursor:pointer}',
      '#xm .xmenu small{display:block;font-weight:400;opacity:.7;margin-top:2px}',
      '#xm .xo{display:block;width:100%;text-align:left;border:2px solid #cbd5e1;background:#f8fafc;border-radius:12px;padding:11px 12px;margin:6px 0;font:inherit;color:#1e293b;cursor:pointer}',
      '#xm .xo.sel{border-color:#2563eb;background:#dbeafe}#xm .xo.ok{border-color:#16a34a;background:#dcfce7}#xm .xo.no{border-color:#dc2626;background:#fee2e2}',
      '#xm .xq{font-weight:700;margin:8px 0}#xm .xn{font-size:.85rem;opacity:.75;margin:6px 0}',
      '#xm .xbar{height:10px;border-radius:6px;background:#e2e8f0;overflow:hidden;margin:3px 0 8px}#xm .xbar i{display:block;height:100%;background:#2563eb}',
      '#xm .xrow{display:flex;gap:6px;flex-wrap:wrap;align-items:center}',
      '#xm .xbig{font-size:1.5rem;font-weight:800;text-align:center;margin:10px 0}',
      '#xm .xdays{display:flex;gap:3px;align-items:flex-end;height:70px;margin:8px 0}#xm .xdays i{flex:1;background:#60a5fa;border-radius:3px 3px 0 0;min-height:2px}',
      '#xm input,#xm select,#xm textarea{font:inherit;border:2px solid #cbd5e1;border-radius:10px;padding:8px 10px;max-width:100%}#xm textarea{width:100%;min-height:150px;box-sizing:border-box}',
      '#xm .xcard{border:2px dashed #94a3b8;border-radius:12px;padding:10px 12px;margin:8px 0;background:#f8fafc}',
      '#xm .xchk label{display:block;margin:5px 0}',
      '#xm .xs h4{margin:4px 0 8px}#xm .xs ul{padding-left:20px}',
      '.vb-x{background:rgba(0,0,0,.08)!important;color:inherit!important;box-shadow:none!important;border:2px solid var(--p,#2563eb)!important}',
      '@media print{body.x-print>*:not(#xm){display:none!important}body.x-print #xm{position:static;background:#fff;display:block}body.x-print #xm .xh,body.x-print #xm .xno{display:none}body.x-print #xm .xc{max-height:none;overflow:visible}}'
    ].join('');
    document.head.appendChild(c);
  }
  function mk() {
    if (M) return;
    M = document.createElement('div'); M.id = 'xm';
    M.innerHTML = '<div class="xc"><div class="xh"><b></b><button class="xx" aria-label="Закрыть">✕</button></div><div class="xbody"></div></div>';
    document.body.appendChild(M);
    M.querySelector('.xx').onclick = close;
    M.onclick = function (e) { if (e.target === M) close(); };
  }
  function open(title, fn) {
    mk(); clearInterval(timerId);
    M.querySelector('.xh b').textContent = title;
    var b = M.querySelector('.xbody'); b.innerHTML = '';
    fn(b); M.style.display = 'flex';
  }
  function close() { clearInterval(timerId); document.body.classList.remove('x-print'); if (M) M.style.display = 'none'; }
  function back(b) { var x = document.createElement('div'); x.innerHTML = '<button class="xb xno" style="margin-top:10px">← В меню</button>'; x.firstChild.onclick = menu; b.appendChild(x.firstChild); }

  /* ---------- меню ---------- */
  function menu() {
    open('⭐ Моя подготовка' + (S ? ': ' + SUBJ[S] : ''), function (b) {
      var h = '<div class="xmenu">';
      h += '<button data-a="stats">📊 Моя статистика<small>' + (S ? 'ответы, слабые темы, серия дней' : 'все предметы, серия дней') + '</small></button>';
      if (S) {
        h += '<button data-a="diag">🎯 Диагностика<small>10 вопросов — покажу, с каких тем начать</small></button>';
        h += '<button data-a="exam">⏱ Пробный экзамен<small>вопросы по школьным темам с таймером и оценкой</small></button>';
        h += '<button data-a="plan">📅 План подготовки<small>выбери дату экзамена — разложу уроки по дням</small></button>';
        h += '<button data-a="write">✍️ Проверка письменной работы<small>чек-лист и разбор от ИИ</small></button>';
        h += '<button data-a="offline">💾 Видео без интернета<small>сохрани видеоуроки на телефон</small></button>';
      } else {
        h += '<button data-a="plan">📅 До экзамена<small>обратный отсчёт и план</small></button>';
        h += '<div class="xn">Диагностика, пробный экзамен и проверка работ — внутри страницы каждого предмета.</div>';
      }
      b.innerHTML = h + '</div>';
      b.querySelectorAll('[data-a]').forEach(function (x) { x.onclick = function () { ({ stats: stats, diag: diag, exam: exam, plan: plan, write: write, offline: offline })[x.dataset.a](); }; });
    });
  }

  /* ---------- статистика ---------- */
  function streak(a) {
    var days = {}; a.forEach(function (x) { days[day(x.t)] = 1; });
    var n = 0, d = new Date();
    if (!days[day(d)]) d.setDate(d.getDate() - 1);
    while (days[day(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function stats() {
    open('📊 Моя статистика', function (b) {
      var all = rj(LOGK, []), a = S ? all.filter(function (x) { return x.s === S; }) : all;
      if (!a.length) { b.innerHTML = '<p>Пока нет данных. Отвечай на вопросы «Проверь себя» в уроках вкладки «5–9 классы» — статистика появится здесь.</p>'; back(b); return; }
      var ok = a.filter(function (x) { return x.ok; }).length, h = '';
      h += '<div class="xbig">' + pct(ok, a.length) + '% верных</div><div class="xn" style="text-align:center">' + a.length + ' ответов · серия: ' + streak(all) + ' дн. подряд</div>';
      var days = [], t = new Date();
      for (var i = 13; i >= 0; i--) { var d = new Date(t); d.setDate(t.getDate() - i); var k = day(d); days.push(a.filter(function (x) { return day(x.t) === k; }).length); }
      var mx = Math.max.apply(null, days) || 1;
      h += '<b>Ответы за 14 дней</b><div class="xdays">' + days.map(function (n) { return '<i style="height:' + Math.max(3, n * 100 / mx) + '%" title="' + n + '"></i>'; }).join('') + '</div>';
      if (S) {
        var L = lessonsAll(), done = L.filter(function (x) { return x.done; }).length;
        h += '<p>Уроков пройдено: <b>' + done + ' из ' + L.length + '</b></p><div class="xbar"><i style="width:' + pct(done, L.length) + '%"></i></div>';
        var u = {}; a.forEach(function (x) { var o = u[x.u] = u[x.u] || { n: 0, w: 0, l: x.l }; o.n++; if (!x.ok) { o.w++; o.l = x.l; } });
        var weak = Object.keys(u).filter(function (k) { return u[k].n >= 2 && u[k].w > 0; }).sort(function (p, q) { return u[q].w / u[q].n - u[p].w / u[p].n; }).slice(0, 5);
        h += '<b>Слабые темы</b>';
        h += weak.length ? weak.map(function (k) { return '<div class="xcard">' + esc(k) + '<br><small>ошибок: ' + u[k].w + ' из ' + u[k].n + '</small> <button class="xb" data-g="' + u[k].l + '">Повторить</button></div>'; }).join('') : '<p class="xn">Пока слабых тем нет — так держать!</p>';
      } else {
        h += '<b>По предметам</b>';
        Object.keys(SUBJ).forEach(function (k) {
          var s = all.filter(function (x) { return x.s === k; }); if (!s.length) return;
          var o = s.filter(function (x) { return x.ok; }).length;
          h += '<div><a href="' + k + '/index.html" style="color:inherit">' + SUBJ[k] + '</a> — ' + pct(o, s.length) + '% (' + s.length + ')</div><div class="xbar"><i style="width:' + pct(o, s.length) + '%"></i></div>';
        });
      }
      var ex = rj(HISTK, []).filter(function (x) { return !S || x.s === S; }).slice(-5);
      if (ex.length) h += '<b>Пробные экзамены</b>' + ex.map(function (x) { return '<div class="xn">' + new Date(x.t).toLocaleDateString('ru') + (S ? '' : ' · ' + SUBJ[x.s]) + ': ' + x.ok + '/' + x.n + ' (' + pct(x.ok, x.n) + '%)</div>'; }).join('');
      b.innerHTML = h;
      b.querySelectorAll('[data-g]').forEach(function (x) { x.onclick = function () { goLesson(x.dataset.g); }; });
      back(b);
    });
  }

  /* ---------- движок теста (диагностика и экзамен) ---------- */
  function runQuiz(b, qs, o) {
    var ans = [], i = 0, left = o.sec || 0;
    function draw() {
      var q = qs[i];
      var h = '<div class="xrow"><span class="xn">Вопрос ' + (i + 1) + ' из ' + qs.length + '</span>' + (o.sec ? '<b id="xt" style="margin-left:auto"></b>' : '') + '</div>';
      h += '<div class="xbar"><i style="width:' + pct(i, qs.length) + '%"></i></div><div class="xq">' + q.q + '</div>';
      h += q.o.map(function (t, k) { return '<button class="xo' + (ans[i] === k ? ' sel' : '') + '" data-k="' + k + '">' + t + '</button>'; }).join('');
      h += '<div class="xrow">' + (i ? '<button class="xb" id="xp">← Назад</button>' : '') + '<button class="xb pri" id="xnx">' + (i === qs.length - 1 ? 'Завершить' : 'Дальше →') + '</button></div>';
      b.innerHTML = h;
      b.querySelectorAll('.xo').forEach(function (x) { x.onclick = function () { ans[i] = +x.dataset.k; draw(); tick(); }; });
      var p = b.querySelector('#xp'); if (p) p.onclick = function () { i--; draw(); tick(); };
      b.querySelector('#xnx').onclick = function () { if (i === qs.length - 1) finish(); else { i++; draw(); tick(); } };
    }
    function tick() { var t = b.querySelector('#xt'); if (t) t.textContent = '⏱ ' + Math.floor(left / 60) + ':' + ('0' + left % 60).slice(-2); }
    function finish() {
      clearInterval(timerId);
      var ok = 0, wrong = [], un = {};
      qs.forEach(function (q, k) {
        var r = ans[k] === q.c; if (r) ok++; else { wrong.push(q); if (!un[q.u]) un[q.u] = q; }
        log(q.id, q.u, r);
      });
      var p = pct(ok, qs.length), mark = p >= 80 ? 5 : p >= 60 ? 4 : p >= 40 ? 3 : 2;
      if (o.save) { var hs = rj(HISTK, []); hs.push({ t: Date.now(), s: S, ok: ok, n: qs.length }); wj(HISTK, hs.slice(-30)); }
      var h = '<div class="xbig">' + ok + ' из ' + qs.length + ' · ' + p + '%</div>';
      if (o.mark) h += '<div class="xn" style="text-align:center">Ориентировочная оценка: <b>' + mark + '</b> (считаю по доле верных ответов, это не официальная шкала ОГЭ)</div>';
      var us = Object.keys(un);
      h += '<b>' + (us.length ? (o.diag ? 'Начни с этих тем' : 'Повтори темы') : 'Ошибок нет — отлично!') + '</b>';
      h += us.map(function (k) { return '<div class="xcard">' + esc(k) + '<br><small>урок: ' + esc(un[k].lt) + '</small> <button class="xb" data-g="' + un[k].id + '">Открыть</button></div>'; }).join('');
      if (wrong.length) {
        h += '<b>Разбор ошибок</b>';
        h += wrong.map(function (q) { return '<div class="xcard"><div class="xq">' + q.q + '</div><div>Правильно: <b>' + q.o[q.c] + '</b></div>' + (q.w ? '<div class="xn">' + esc(q.w) + '</div>' : '') + '</div>'; }).join('');
      }
      b.innerHTML = h;
      b.querySelectorAll('[data-g]').forEach(function (x) { x.onclick = function () { goLesson(x.dataset.g); }; });
      back(b);
    }
    draw();
    if (o.sec) {
      tick();
      timerId = setInterval(function () { left--; tick(); if (left <= 0) finish(); }, 1000);
    }
  }
  function diag() {
    open('🎯 Диагностика', function (b) {
      var bk = bank(), byU = {};
      bk.forEach(function (q) { (byU[q.u] = byU[q.u] || []).push(q); });
      var qs = shuffle(Object.keys(byU)).slice(0, 10).map(function (u) { return shuffle(byU[u])[0]; });
      if (qs.length < 3) { b.innerHTML = '<p>Мало вопросов для диагностики.</p>'; back(b); return; }
      runQuiz(b, qs, { diag: true });
    });
  }
  function exam() {
    open('⏱ Пробный экзамен', function (b) {
      var grades = []; document.querySelectorAll('.grade-sec').forEach(function (s) { grades.push(+s.dataset.grade); });
      var sel = grades.slice(), cnt = 20, min = 30;
      function setup() {
        var h = '<p>Вопросы случайные, из тем выбранных классов. Ответы покажу в конце.</p><b>Классы</b><div class="xrow">' + grades.map(function (g) { return '<button class="xb' + (sel.indexOf(g) >= 0 ? ' on' : '') + '" data-g="' + g + '">' + g + '</button>'; }).join('') + '</div>';
        h += '<b>Вопросов</b><div class="xrow">' + [10, 20, 30].map(function (n) { return '<button class="xb' + (cnt === n ? ' on' : '') + '" data-n="' + n + '">' + n + '</button>'; }).join('') + '</div>';
        h += '<b>Время</b><div class="xrow">' + [10, 20, 30, 45].map(function (n) { return '<button class="xb' + (min === n ? ' on' : '') + '" data-m="' + n + '">' + n + ' мин</button>'; }).join('') + '</div>';
        h += '<button class="xb pri" id="xs" style="margin-top:10px">Начать</button>';
        b.innerHTML = h;
        b.querySelectorAll('[data-g]').forEach(function (x) { x.onclick = function () { var g = +x.dataset.g, k = sel.indexOf(g); if (k >= 0) sel.splice(k, 1); else sel.push(g); setup(); }; });
        b.querySelectorAll('[data-n]').forEach(function (x) { x.onclick = function () { cnt = +x.dataset.n; setup(); }; });
        b.querySelectorAll('[data-m]').forEach(function (x) { x.onclick = function () { min = +x.dataset.m; setup(); }; });
        b.querySelector('#xs').onclick = function () {
          var bk = bank(sel);
          if (bk.length < 5) { alert('Выбери хотя бы один класс'); return; }
          runQuiz(b, shuffle(bk).slice(0, cnt), { sec: min * 60, mark: true, save: true });
        };
      }
      setup();
    });
  }

  /* ---------- план ---------- */
  function plan() {
    open('📅 План подготовки', function (b) {
      var d = localStorage.getItem(DATEK) || '';
      function draw() {
        var h = '<p>Дата экзамена:</p><div class="xrow"><input type="date" id="xd" value="' + esc(d) + '"><button class="xb pri" id="xsv">Сохранить</button></div>';
        var dl = d ? Math.ceil((new Date(d + 'T09:00:00') - Date.now()) / 864e5) : null;
        if (dl !== null) h += dl > 0 ? '<div class="xbig">До экзамена: ' + dl + ' дн.</div>' : '<div class="xbig">Дата уже прошла</div>';
        if (S) {
          var L = lessonsAll(), rest = L.filter(function (x) { return !x.done; });
          if (!rest.length) h += '<p>Все уроки по этому предмету пройдены. 🎉 Теперь решай пробные экзамены.</p>';
          else if (dl && dl > 0) {
            var per = Math.ceil(rest.length / dl);
            h += '<p>Осталось уроков: <b>' + rest.length + '</b>. Чтобы успеть, проходи по <b>' + per + '</b> в день.</p><b>Сегодня:</b>';
            h += rest.slice(0, per).map(function (x) { return '<div class="xcard">' + esc(x.t) + '<br><small>' + esc(x.u) + '</small> <button class="xb" data-g="' + x.id + '">Открыть</button></div>'; }).join('');
          } else h += '<p>Осталось уроков: <b>' + rest.length + '</b>. Выбери дату экзамена — разложу по дням.</p>';
        } else if (dl === null) h += '<p class="xn">Выбери дату — и на каждой странице предмета будет план по дням.</p>';
        b.innerHTML = h; back(b);
        b.querySelector('#xsv').onclick = function () { d = b.querySelector('#xd').value; try { localStorage.setItem(DATEK, d); } catch (e) {} draw(); };
        b.querySelectorAll('[data-g]').forEach(function (x) { x.onclick = function () { goLesson(x.dataset.g); }; });
      }
      draw();
    });
  }

  /* ---------- проверка письма ---------- */
  var KINDS = {
    russian: [['Сочинение-рассуждение (9.1–9.3)', ['Есть ответ на вопрос задания: понятно объяснено, как ты понимаешь смысл', 'Есть минимум два примера-аргумента (из прочитанного текста и из жизненного или читательского опыта)', 'Мысль последовательна, текст разбит на абзацы, есть вывод', 'Речь точная: нет повторов, лишних слов и речевых ошибок', 'Проверены орфография и пунктуация', 'Объём не меньше, чем требует задание (обычно 70 слов)']], ['Сжатое изложение', ['Передана главная мысль и все микротемы текста', 'Убраны подробности и примеры, текст сжат', 'Сохранена логика и последовательность', 'Нет искажений смысла и речевых ошибок', 'Проверены орфография и пунктуация']]],
    social: [['Развёрнутый ответ / задание на анализ', ['Ответил на каждый пункт задания', 'Использованы точные термины и понятия', 'Есть пример или факт для каждого вывода', 'Ответ логичен, без лишнего']], ['Составление плана или сложного плана', ['Есть пункты и подпункты по теме', 'Пункты отражают суть темы, не повторяются', 'Формулировки краткие и точные']]]
  };
  function write() {
    open('✍️ Проверка письменной работы', function (b) {
      var ks = KINDS[S] || [['Развёрнутый ответ', ['Ответил на каждый вопрос задания', 'Использованы термины предмета', 'Есть факты или примеры', 'Есть вывод, мысль логична']]], ki = 0;
      var h = '<p class="xn">Сначала пройдись по чек-листу, потом вставь текст и получи разбор от ИИ. Это подсказка, не оценка экзаменатора.</p>';
      if (ks.length > 1) h += '<select id="wk">' + ks.map(function (k, n) { return '<option value="' + n + '">' + esc(k[0]) + '</option>'; }).join('') + '</select>';
      h += '<div class="xchk" id="wc"></div><textarea id="wt" maxlength="1500" placeholder="Вставь свой текст (до 1500 знаков)"></textarea><div class="xn" id="wn">0 слов · 0 знаков</div><button class="xb pri" id="wa">Проверить с ИИ</button><div class="xcard" id="wr" style="display:none;white-space:pre-wrap"></div>';
      b.innerHTML = h; back(b);
      function chk() { b.querySelector('#wc').innerHTML = ks[ki][1].map(function (t) { return '<label><input type="checkbox"> ' + esc(t) + '</label>'; }).join(''); }
      chk();
      var sel = b.querySelector('#wk'); if (sel) sel.onchange = function () { ki = +sel.value; chk(); };
      var ta = b.querySelector('#wt');
      ta.oninput = function () { var w = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0; b.querySelector('#wn').textContent = w + ' слов · ' + ta.value.length + ' знаков'; };
      b.querySelector('#wa').onclick = function () {
        var t = ta.value.trim(); if (t.length < 30) { alert('Вставь текст подлиннее'); return; }
        var btn = this, out = b.querySelector('#wr'); btn.disabled = true; out.style.display = 'block'; out.textContent = 'ИИ читает…';
        var q = 'Проверь мою письменную работу по предмету «' + SUBJ[S] + '» (' + ks[ki][0] + '). Критерии: ' + ks[ki][1].join('; ') + '. Напиши коротко: что сделано хорошо, что исправить, и какие ошибки есть. Не переписывай текст целиком и не выставляй баллы ОГЭ.\n\nМоя работа:\n' + t;
        var local = /^(localhost|127\.0\.0\.1)$/i.test(location.hostname) && location.port !== '8888' && location.port !== '8889';
        fetch((local ? 'https://preparationforoge.netlify.app' : '') + '/api/ai-tutor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject: S, question: q.slice(0, 1990), history: [] }) })
          .then(function (r) { return r.json().catch(function () { return {}; }); })
          .then(function (d) { out.textContent = d.answer || d.error || 'Не удалось получить ответ.'; })
          .catch(function () { out.textContent = 'Нет связи с ИИ. Проверь интернет.'; })
          .then(function () { btn.disabled = false; });
      };
    });
  }

  /* ---------- шпаргалка ---------- */
  function sheet(L) {
    open('📄 Шпаргалка', function (b) {
      var th = L.querySelector('.theory'), pts = th.querySelector('ul'), ex = th.querySelector('.ex'), tip = L.querySelector('.tip');
      var first = th.querySelector('p');
      var h = '<div class="xs"><h4>' + esc(L.querySelector('h4').textContent) + '</h4>';
      if (first) h += '<p>' + first.innerHTML + '</p>';
      if (pts) h += '<b>Запомни:</b><ul>' + pts.innerHTML + '</ul>';
      if (ex) h += ex.outerHTML;
      if (tip) h += '<p>💡 ' + tip.innerHTML + '</p>';
      h += '</div><div class="xno"><button class="xb pri" id="xpr">🖨 Печать / PDF</button><div class="xn">Откроется окно печати — там можно выбрать «Сохранить как PDF».</div></div>';
      b.innerHTML = h;
      b.querySelector('#xpr').onclick = function () { document.body.classList.add('x-print'); setTimeout(function () { window.print(); setTimeout(function () { document.body.classList.remove('x-print'); }, 500); }, 50); };
    });
  }

  /* ---------- видео офлайн ---------- */
  function vurl(id) {
    var m = /^sc(\d+)-([a-z]+)-(\d+)$/.exec(id);
    return new URL('../videos/' + m[2] + '/' + m[1] + '-' + m[3] + '.mp4', location.href).href;
  }
  function hasCache() { return 'caches' in window; }
  function saved(url) { return caches.open('oge-videos').then(function (c) { return c.match(url); }).then(function (r) { return !!r; }); }
  function offBtn(btn, id) {
    var url = vurl(id);
    function setS(s) { btn.dataset.s = s; btn.textContent = s === '1' ? '✅ Сохранено' : s === 'w' ? '⏳ Скачиваю…' : '💾 Офлайн'; }
    saved(url).then(function (v) { setS(v ? '1' : '0'); }).catch(function () { setS('0'); });
    btn.onclick = function () {
      if (btn.dataset.s === 'w') return;
      if (btn.dataset.s === '1') { caches.open('oge-videos').then(function (c) { return c.delete(url); }).then(function () { setS('0'); }); return; }
      setS('w');
      fetch(url).then(function (r) { if (!r.ok) throw 0; return caches.open('oge-videos').then(function (c) { return c.put(url, r); }); })
        .then(function () { setS('1'); }).catch(function () { setS('0'); alert('Не удалось скачать видео. Проверь интернет.'); });
    };
  }
  function offline() {
    open('💾 Видео без интернета', function (b) {
      var L = lessonsAll();
      b.innerHTML = '<p>Сохранённые видео смотрятся без интернета. Одно видео весит 0,3–1 МБ.</p><div class="xn" id="oc">Считаю…</div><div class="xbar"><i id="op" style="width:0"></i></div><button class="xb pri" id="oa">Скачать все видео предмета (' + L.length + ')</button><button class="xb" id="od">Удалить все сохранённые</button>';
      back(b);
      function count() { return caches.open('oge-videos').then(function (c) { return c.keys(); }).then(function (k) { var n = k.filter(function (r) { return r.url.indexOf('/videos/' + S + '/') >= 0; }).length; b.querySelector('#oc').textContent = 'Сохранено по предмету: ' + n + ' из ' + L.length; b.querySelector('#op').style.width = pct(n, L.length) + '%'; }); }
      if (!hasCache()) { b.querySelector('#oc').textContent = 'Браузер не поддерживает сохранение.'; return; }
      count();
      b.querySelector('#oa').onclick = function () {
        var btn = this; btn.disabled = true; var i = 0;
        caches.open('oge-videos').then(function (c) {
          (function next() {
            if (i >= L.length) { btn.disabled = false; count(); refreshBtns(); return; }
            var url = vurl(L[i++].id);
            c.match(url).then(function (h) { return h || fetch(url).then(function (r) { return r.ok ? c.put(url, r) : 0; }); }).catch(function () {}).then(function () { b.querySelector('#oc').textContent = 'Скачано ' + i + ' из ' + L.length; b.querySelector('#op').style.width = pct(i, L.length) + '%'; next(); });
          })();
        });
      };
      b.querySelector('#od').onclick = function () {
        if (!confirm('Удалить сохранённые видео этого предмета?')) return;
        caches.open('oge-videos').then(function (c) { return c.keys().then(function (k) { return Promise.all(k.filter(function (r) { return r.url.indexOf('/videos/' + S + '/') >= 0; }).map(function (r) { return c.delete(r); })); }); }).then(function () { count(); refreshBtns(); });
      };
    });
  }
  function refreshBtns() {
    document.querySelectorAll('.vb-off').forEach(function (b) { offBtn(b, b.closest('.lesson').dataset.lesson); });
  }

  /* ---------- кнопки в уроках и общая кнопка ---------- */
  function addButtons() {
    if (!S) return;
    document.querySelectorAll('#path-hard .lesson[data-lesson]').forEach(function (L) {
      var w = L.querySelector('.vid-wrap'); if (!w || w.dataset.x) return; w.dataset.x = 1;
      var s = document.createElement('button'); s.type = 'button'; s.className = 'vid-btn vb-x'; s.textContent = '📄 Шпаргалка'; s.onclick = function () { sheet(L); }; w.appendChild(s);
      if (hasCache() && L.querySelector('.vb-board')) { var o = document.createElement('button'); o.type = 'button'; o.className = 'vid-btn vb-x vb-off'; o.textContent = '💾 Офлайн'; w.appendChild(o); offBtn(o, L.dataset.lesson); }
    });
  }
  function init() {
    css();
    var f = document.createElement('button'); f.id = 'xBtn'; f.textContent = '⭐ Подготовка'; f.onclick = menu; document.body.appendChild(f);
    addButtons();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
