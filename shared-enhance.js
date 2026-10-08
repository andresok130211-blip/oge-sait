/*! OGE auto-XP + daily quest + level */
(function(){
  if (window.__ogeEnhance) return;
  window.__ogeEnhance = true;

  var XP_KEY = 'oge_global_xp';
  var STREAK_KEY = 'oge_global_streak';
  var LAST_KEY = 'oge_global_last';
  var DAY_KEY = 'oge_daily_quest';
  var ANS_KEY = 'oge_answered_ids';

  function getXp(){ return parseInt(localStorage.getItem(XP_KEY)||'0',10)||0; }
  function setXp(n){ localStorage.setItem(XP_KEY,String(n)); }
  function levelOf(xp){ return Math.floor(xp/100)+1; }
  function xpToNext(xp){ return 100 - (xp % 100); }

  function toast(pts){
    var t = document.createElement('div');
    t.className = 'oge-xp-toast';
    t.textContent = '+' + pts + ' XP';
    document.body.appendChild(t);
    requestAnimationFrame(function(){ t.classList.add('show'); });
    setTimeout(function(){ t.classList.remove('show'); setTimeout(function(){ t.remove(); },400); },1400);
  }

  function updateUI(){
    var xp = getXp();
    var el = document.getElementById('xpCount');
    if (el) el.textContent = xp;
    var lvl = document.getElementById('lvlCount');
    if (lvl) lvl.textContent = levelOf(xp);
    var bar = document.getElementById('xpBarFill');
    if (bar) bar.style.width = (xp % 100) + '%';
    var need = document.getElementById('xpNeed');
    if (need) need.textContent = xpToNext(xp);
    var st = document.getElementById('streakCount');
    if (st) st.textContent = localStorage.getItem(STREAK_KEY)||'0';
    var dq = document.getElementById('dailyQuestText');
    if (dq) {
      var d = JSON.parse(localStorage.getItem(DAY_KEY)||'{}');
      var today = new Date().toDateString();
      if (d.date !== today) d = { date: today, done: 0, goal: 10 };
      localStorage.setItem(DAY_KEY, JSON.stringify(d));
      dq.textContent = 'Задание дня: ' + d.done + '/' + d.goal + ' верных ответов';
      var df = document.getElementById('dailyFill');
      if (df) df.style.width = Math.min(100, (d.done/d.goal)*100) + '%';
    }
  }

  function bumpStreak(){
    var today = new Date().toDateString();
    var last = localStorage.getItem(LAST_KEY);
    if (last === today) return;
    var streak = parseInt(localStorage.getItem(STREAK_KEY)||'0',10)||0;
    if (last && (new Date(last).getTime() > Date.now() - 172800000)) streak += 1;
    else streak = 1;
    localStorage.setItem(STREAK_KEY, String(streak));
    localStorage.setItem(LAST_KEY, today);
  }

  function dailyInc(){
    var today = new Date().toDateString();
    var d = JSON.parse(localStorage.getItem(DAY_KEY)||'{}');
    if (d.date !== today) d = { date: today, done: 0, goal: 10 };
    d.done = (d.done||0) + 1;
    localStorage.setItem(DAY_KEY, JSON.stringify(d));
    if (d.done === d.goal) {
      gainXP(50, true); // bonus for finishing daily
      toast(50);
    }
  }

  window.ogeGainXP = function gainXP(pts, skipDaily){
    pts = pts || 5;
    var xp = getXp() + pts;
    setXp(xp);
    bumpStreak();
    if (!skipDaily) dailyInc();
    updateUI();
    // sync legacy per-subject counters if present
    try {
      ['oge_xp','oge_math_xp','oge_bio_xp'].forEach(function(k){
        // don't overwrite others; only mirror global to main display
      });
    } catch(e){}
    toast(pts);
    return xp;
  };

  // Auto XP on correct option click (no "Готово" needed)
  document.addEventListener('click', function(e){
    var opt = e.target.closest('.opt, .q-opt, [data-v]');
    if (!opt) return;
    if (opt.dataset.xpGiven === '1') return;
    if (opt.classList.contains('disabled')) return;
    setTimeout(function(){
      if (opt.dataset.xpGiven === '1') return;
      var isCorrect = opt.classList.contains('correct') || opt.classList.contains('ok');
      // also: parent marked correct and this is the right one
      if (!isCorrect && opt.dataset.v != null) {
        var q = opt.closest('.q-item, .quiz, .lesson, [data-c]');
        if (q && q.dataset.c != null && String(opt.dataset.v) === String(q.dataset.c) && opt.classList.contains('disabled')) {
          isCorrect = true;
        }
      }
      if (isCorrect) {
        opt.dataset.xpGiven = '1';
        // mark siblings so only once per question
        var parent = opt.parentElement;
        if (parent) parent.querySelectorAll('.opt, .q-opt').forEach(function(o){ o.dataset.xpGiven = '1'; });
        window.ogeGainXP(8);
      }
    }, 80);
  }, true);

  // Inject HUD if missing
  function injectHud(){
    if (document.getElementById('ogeDailyHud')) return;
    var hud = document.createElement('div');
    hud.id = 'ogeDailyHud';
    hud.innerHTML = '<div class="oge-hud-row"><span>🏅 Уровень <b id="lvlCount">1</b></span><span>до след.: <b id="xpNeed">100</b> XP</span></div>'
      + '<div class="oge-hud-bar"><i id="xpBarFill"></i></div>'
      + '<div class="oge-hud-daily" id="dailyQuestText">Задание дня: 0/10</div>'
      + '<div class="oge-hud-bar daily"><i id="dailyFill"></i></div>';
    var top = document.querySelector('.topbar, header, .stats');
    if (top && top.parentNode) top.parentNode.insertBefore(hud, top.nextSibling);
    else document.body.insertBefore(hud, document.body.firstChild);
  }

  // Styles
  var css = document.createElement('style');
  css.textContent = [
    '.oge-xp-toast{position:fixed;top:18%;left:50%;transform:translate(-50%,10px);background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#1c1917;font-weight:800;padding:10px 18px;border-radius:999px;z-index:9999;opacity:0;pointer-events:none;transition:.35s;box-shadow:0 8px 24px rgba(245,158,11,.4);font-size:1.05rem}',
    '.oge-xp-toast.show{opacity:1;transform:translate(-50%,0)}',
    '#ogeDailyHud{margin:10px 12px 0;padding:12px 14px;border-radius:16px;background:rgba(255,255,255,.12);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.18);color:#f8fafc;font-size:.85rem}',
    '.oge-hud-row{display:flex;justify-content:space-between;gap:8px;margin-bottom:6px}',
    '.oge-hud-bar{height:8px;background:rgba(255,255,255,.15);border-radius:99px;overflow:hidden;margin-bottom:8px}',
    '.oge-hud-bar>i{display:block;height:100%;width:0%;background:linear-gradient(90deg,#a78bfa,#22d3ee,#fbbf24);border-radius:99px;transition:width .4s}',
    '.oge-hud-bar.daily>i{background:linear-gradient(90deg,#34d399,#22c55e)}',
    '.oge-hud-daily{margin-bottom:4px;font-weight:600}',
    /* light cards on dark bg */
    '.topbar{background:rgba(15,23,42,.75)!important;color:#f8fafc!important;border-bottom-color:rgba(255,255,255,.1)!important}',
    '.topbar .logo,.stats,.stat{color:#f8fafc!important}',
    '.stat.xp{color:#fbbf24!important}.stat.streak{color:#fb923c!important}',
    '.tabs .tab{background:rgba(255,255,255,.1)!important;color:#e2e8f0!important}',
    '.tabs .tab.active{background:rgba(255,255,255,.95)!important;color:#4f46e5!important}',
    '.unit{background:rgba(255,255,255,.94)!important}',
    '.bottom-nav{background:rgba(15,23,42,.92)!important}'
  ].join('');
  document.head.appendChild(css);

  function boot(){
    injectHud();
    updateUI();
    // +2 XP for opening subject today once
    var visitKey = 'oge_visit_' + (location.pathname||'/');
    var today = new Date().toDateString();
    if (localStorage.getItem(visitKey) !== today) {
      localStorage.setItem(visitKey, today);
      window.ogeGainXP(2, true);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  // Sync topbar XP display to global (auto XP from answers)
  setInterval(function(){
    var el=document.getElementById('xpCount');
    if(el) el.textContent=getXp();
  }, 2000);
})();
