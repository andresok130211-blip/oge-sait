/* OGE AI Tutor widget: floating chat button available on every page */
(function () {
  var SUBJECT_LABELS = {
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

  function detectSubject() {
    var path = window.location.pathname;
    for (var key in SUBJECT_LABELS) {
      if (path.indexOf('/' + key + '/') !== -1) return key;
    }
    return '';
  }

  function apiUrl() {
    // Local static preview has no functions, so fall back to production API.
    var isLocal = /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname) && window.location.port !== '8888' && window.location.port !== '8889';
    if (isLocal) {
      return 'https://preparationforoge.netlify.app/api/ai-tutor';
    }
    return '/api/ai-tutor';
  }

  var QUICK_TOPICS = ['Что такое дробь?', 'Почему небо голубое?', 'Объясни фотосинтез', 'Что такое причастный оборот?'];

  function injectStyles() {
    var css = [
      '#aiTutorBtn{position:fixed;right:18px;bottom:72px;z-index:9998;width:58px;height:58px;border-radius:50%;',
      'background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;border:none;font-size:1.6rem;',
      'box-shadow:0 8px 24px rgba(79,70,229,.4);cursor:pointer;display:flex;align-items:center;justify-content:center}',
      '#aiTutorBtn:active{transform:scale(.94)}',
      '#aiTutorOverlay{position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:9999;display:none;align-items:flex-end;justify-content:center}',
      '#aiTutorOverlay.show{display:flex}',
      '@media(min-width:640px){#aiTutorOverlay{align-items:center}}',
      '#aiTutorPanel{background:#fff;width:100%;max-width:480px;max-height:82vh;border-radius:20px 20px 0 0;',
      'display:flex;flex-direction:column;overflow:hidden;font-family:system-ui,-apple-system,sans-serif}',
      '@media(min-width:640px){#aiTutorPanel{border-radius:20px;max-height:74vh;margin:16px}}',
      '#aiTutorHead{padding:14px 16px;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;',
      'display:flex;align-items:center;justify-content:space-between}',
      '#aiTutorHead h3{margin:0;font-size:1.05rem}',
      '#aiTutorHead select{border:none;border-radius:10px;padding:6px 8px;font:inherit;font-size:.8rem}',
      '#aiTutorClose{background:rgba(255,255,255,.2);border:none;color:#fff;width:30px;height:30px;border-radius:50%;font-size:1.1rem;cursor:pointer;flex-shrink:0}',
      '#aiTutorMsgs{flex:1;overflow-y:auto;padding:14px 16px;display:flex;flex-direction:column;gap:10px;background:#f8fafc}',
      '.aiMsg{max-width:88%;padding:10px 13px;border-radius:14px;font-size:.92rem;line-height:1.5;white-space:pre-wrap}',
      '.aiMsg.user{align-self:flex-end;background:#4f46e5;color:#fff;border-bottom-right-radius:4px}',
      '.aiMsg.bot{align-self:flex-start;background:#fff;border:1px solid #e2e8f0;color:#0f172a;border-bottom-left-radius:4px}',
      '.aiMsg.err{align-self:flex-start;background:#fef2f2;border:1px solid #fecaca;color:#991b1b}',
      '.aiMsg.hint{align-self:center;background:transparent;color:#94a3b8;font-size:.82rem;text-align:center}',
      '#aiTutorForm{display:flex;gap:8px;padding:12px;border-top:1px solid #e2e8f0;background:#fff}',
      '#aiTutorInput{flex:1;border:1px solid #e2e8f0;border-radius:12px;padding:11px 13px;font:inherit;font-size:.92rem;resize:none;max-height:90px}',
      '#aiTutorSend{background:#4f46e5;color:#fff;border:none;border-radius:12px;padding:0 18px;font-weight:700;cursor:pointer;font-size:.92rem}',
      '#aiTutorSend:disabled{background:#94a3b8;cursor:default}',
      '.aiChips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}',
      '.aiChip{background:#eef2ff;color:#4338ca;border:1px solid #c7d2fe;border-radius:999px;padding:6px 11px;font:inherit;font-size:.8rem;cursor:pointer}',
      '.aiChip:disabled{opacity:.5;cursor:default}',
      '.aiActions{align-self:flex-start;display:flex;gap:6px;flex-wrap:wrap}',
    ].join('');
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function buildOptions(selected) {
    var html = '<option value="">Общий вопрос</option>';
    for (var key in SUBJECT_LABELS) {
      html += '<option value="' + key + '"' + (key === selected ? ' selected' : '') + '>' + SUBJECT_LABELS[key] + '</option>';
    }
    return html;
  }

  function injectMarkup() {
    var btn = document.createElement('button');
    btn.id = 'aiTutorBtn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Спросить ИИ-репетитора');
    btn.textContent = '🤖';
    document.body.appendChild(btn);

    var overlay = document.createElement('div');
    overlay.id = 'aiTutorOverlay';
    overlay.innerHTML =
      '<div id="aiTutorPanel">' +
      '<div id="aiTutorHead">' +
      '<h3>🤖 ИИ-репетитор</h3>' +
      '<div style="display:flex;gap:8px;align-items:center">' +
      '<select id="aiTutorSubject">' + buildOptions(detectSubject()) + '</select>' +
      '<button id="aiTutorClose" type="button" aria-label="Закрыть">✕</button>' +
      '</div></div>' +
      '<div id="aiTutorMsgs"><div class="aiMsg hint">Спросите про любую тему или вопрос — объясню простыми словами, с примерами.</div>' +
      '<div class="aiChips" id="aiTutorChips"></div></div>' +
      '<form id="aiTutorForm">' +
      '<textarea id="aiTutorInput" rows="1" placeholder="Например: объясни теорему Пифагора простыми словами" maxlength="2000"></textarea>' +
      '<button id="aiTutorSend" type="submit">Спросить</button>' +
      '</form></div>';
    document.body.appendChild(overlay);

    return { btn: btn, overlay: overlay };
  }

  function addMsg(container, role, text) {
    var div = document.createElement('div');
    div.className = 'aiMsg ' + role;
    if (role === 'bot') renderRich(div, text);
    else div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return div;
  }

  // Safe minimal formatting: only **bold** is turned into markup, everything else stays plain text.
  function renderRich(el, text) {
    var parts = String(text).split(/\*\*([^*]+)\*\*/g);
    for (var i = 0; i < parts.length; i++) {
      if (!parts[i]) continue;
      if (i % 2 === 1) {
        var b = document.createElement('strong');
        b.textContent = parts[i];
        el.appendChild(b);
      } else {
        el.appendChild(document.createTextNode(parts[i]));
      }
    }
  }

  function init() {
    injectStyles();
    var refs = injectMarkup();
    var btn = refs.btn;
    var overlay = refs.overlay;
    var panel = document.getElementById('aiTutorPanel');
    var closeBtn = document.getElementById('aiTutorClose');
    var form = document.getElementById('aiTutorForm');
    var input = document.getElementById('aiTutorInput');
    var sendBtn = document.getElementById('aiTutorSend');
    var msgs = document.getElementById('aiTutorMsgs');
    var subjectSelect = document.getElementById('aiTutorSubject');
    var history = [];

    function open() {
      overlay.classList.add('show');
      input.focus();
    }
    function close() {
      overlay.classList.remove('show');
    }

    btn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    panel.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    var busy = false;
    var actions = null;

    function setBusy(v) {
      busy = v;
      input.disabled = v;
      sendBtn.disabled = v;
      var chips = msgs.querySelectorAll('.aiChip');
      for (var i = 0; i < chips.length; i++) chips[i].disabled = v;
    }

    function chip(label, onClick) {
      var c = document.createElement('button');
      c.type = 'button';
      c.className = 'aiChip';
      c.textContent = label;
      c.addEventListener('click', function () {
        if (!busy) onClick();
      });
      return c;
    }

    function showActions() {
      if (actions) actions.remove();
      actions = document.createElement('div');
      actions.className = 'aiActions';
      actions.appendChild(chip('🧸 Объясни ещё проще', function () {
        ask('Объясни ещё проще, другими словами и с другой аналогией.');
      }));
      actions.appendChild(chip('📝 Дай ещё пример', function () {
        ask('Дай ещё один простой пример.');
      }));
      msgs.appendChild(actions);
      msgs.scrollTop = msgs.scrollHeight;
    }

    var chipsBox = document.getElementById('aiTutorChips');
    QUICK_TOPICS.forEach(function (t) {
      chipsBox.appendChild(chip(t, function () { ask(t); }));
    });

    function ask(question) {
      question = String(question || '').trim();
      if (!question || busy) return;
      if (actions) { actions.remove(); actions = null; }

      addMsg(msgs, 'user', question);
      var prevHistory = history.slice();
      history.push({ role: 'user', text: question });
      setBusy(true);
      var thinking = addMsg(msgs, 'hint', 'Думаю…');

      fetch(apiUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subjectSelect.value,
          question: question,
          history: prevHistory,
        }),
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          thinking.remove();
          if (result.ok && result.data.answer) {
            addMsg(msgs, 'bot', result.data.answer);
            history.push({ role: 'assistant', text: result.data.answer });
            showActions();
          } else {
            history.pop();
            addMsg(msgs, 'err', (result.data && result.data.error) || 'Не удалось получить ответ.');
          }
        })
        .catch(function () {
          thinking.remove();
          history.pop();
          addMsg(msgs, 'err', 'Не удалось связаться с ИИ. Проверьте интернет и попробуйте ещё раз.');
        })
        .finally(function () {
          setBusy(false);
          input.focus();
        });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = input.value;
      input.value = '';
      ask(q);
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        form.requestSubmit();
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
