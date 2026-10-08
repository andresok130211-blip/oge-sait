
/* OGE App: PWA + daily reminders + feedback */
(function(){
  const FEEDBACK_EMAIL_KEY = 'oge_feedback_email';
  const NOTIFY_KEY = 'oge_notify_settings';

  function defaults(){
    return { enabled:false, hour:18, minute:0, lastSent:'' };
  }
  function getNotify(){
    try { return Object.assign(defaults(), JSON.parse(localStorage.getItem(NOTIFY_KEY)||'{}')); }
    catch(e){ return defaults(); }
  }
  function setNotify(s){ localStorage.setItem(NOTIFY_KEY, JSON.stringify(s)); }

  async function registerSW(){
    if (!('serviceWorker' in navigator)) return null;
    try {
      const reg = await navigator.serviceWorker.register('./sw.js?v=4');
      if (reg.waiting) reg.waiting.postMessage({type:'SKIP_WAITING'});
      reg.update();
      return reg;
    } catch(e){ console.warn('SW', e); return null; }
  }

  async function enableNotifications(){
    if (!('Notification' in window)) {
      alert('Браузер не поддерживает уведомления');
      return false;
    }
    let perm = Notification.permission;
    if (perm !== 'granted') {
      perm = await Notification.requestPermission();
    }
    if (perm !== 'granted') {
      alert('Разрешите уведомления в настройках браузера');
      return false;
    }
    const s = getNotify();
    s.enabled = true;
    setNotify(s);
    await registerSW();
    scheduleTick();
    alert('Готово! Каждый день около ' + String(s.hour).padStart(2,'0') + ':' + String(s.minute).padStart(2,'0') + ' придёт напоминание (когда браузер/приложение открыты или недавно использовались).');
    return true;
  }

  function disableNotifications(){
    const s = getNotify();
    s.enabled = false;
    setNotify(s);
    alert('Напоминания выключены');
  }

  function scheduleTick(){
    // Check every minute whether we should notify today
    if (window._ogeNotifyTimer) clearInterval(window._ogeNotifyTimer);
    window._ogeNotifyTimer = setInterval(maybeNotify, 30000);
    maybeNotify();
  }

  async function maybeNotify(){
    const s = getNotify();
    if (!s.enabled) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const now = new Date();
    const today = now.toDateString();
    if (s.lastSent === today) return;
    if (now.getHours() > s.hour || (now.getHours() === s.hour && now.getMinutes() >= s.minute)) {
      const title = 'ОГЭ — время заниматься';
      const body = 'Короткая практика сегодня важнее идеального плана. Открой приложение!';
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg && reg.showNotification) {
          await reg.showNotification(title, { body, icon: './icon-192.png', tag: 'oge-daily', renotify: true, data: { url: './index.html' } });
        } else {
          new Notification(title, { body, icon: './icon-192.png', tag: 'oge-daily' });
        }
      } catch(e) {
        try { new Notification(title, { body }); } catch(_){}
      }
      s.lastSent = today;
      setNotify(s);
    }
  }

  function installPWA(){
    if (window._ogeDeferredPrompt) {
      window._ogeDeferredPrompt.prompt();
      window._ogeDeferredPrompt.userChoice.then(() => { window._ogeDeferredPrompt = null; });
      return;
    }
    alert('Чтобы установить приложение:\n\n• Chrome/Android: меню ⋮ → «Установить приложение» или «На экран»\n• Safari/iPhone: «Поделиться» → «На экран Домой»\n\nИли скачайте архив сайта с кнопки ниже и откройте index.html.');
  }

  function sendFeedback(name, text, rating){
    const email = localStorage.getItem(FEEDBACK_EMAIL_KEY) || '';
    const subject = encodeURIComponent('Отзыв ОГЭ приложение' + (rating ? ' · ' + rating + '/5' : ''));
    const body = encodeURIComponent('Имя: ' + (name||'Аноним') + '\nОценка: ' + (rating||'-') + '/5\n\n' + text + '\n\n---\nОтправлено из ОГЭ Подготовка');
    if (email) {
      window.location.href = 'mailto:' + email + '?subject=' + subject + '&body=' + body;
    } else {
      // Copy to clipboard fallback
      const full = 'Имя: ' + (name||'Аноним') + '\nОценка: ' + (rating||'-') + '/5\n\n' + text;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(full).then(() => {
          alert('Отзыв скопирован. Вставьте его в Telegram/почту автору.\n\nЧтобы отзывы открывали почту сразу — укажите email получателя в блоке настроек.');
        }).catch(() => prompt('Скопируйте отзыв:', full));
      } else {
        prompt('Скопируйте отзыв:', full);
      }
    }
  }

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    window._ogeDeferredPrompt = e;
    const b = document.getElementById('btnInstallApp');
    if (b) b.style.display = 'inline-flex';
  });

  window.OgeApp = {
    enableNotifications, disableNotifications, installPWA, sendFeedback, getNotify, setNotify,
    setFeedbackEmail(email){ localStorage.setItem(FEEDBACK_EMAIL_KEY, email.trim()); },
    getFeedbackEmail(){ return localStorage.getItem(FEEDBACK_EMAIL_KEY)||''; },
    init(){
      registerSW();
      if (getNotify().enabled) scheduleTick();
      // fill UI if present
      const s = getNotify();
      const en = document.getElementById('notifyEnabled');
      if (en) en.checked = !!s.enabled;
      const hh = document.getElementById('notifyHour');
      if (hh) hh.value = s.hour;
      const mm = document.getElementById('notifyMinute');
      if (mm) mm.value = s.minute;
      const em = document.getElementById('feedbackEmail');
      if (em) em.value = OgeApp.getFeedbackEmail();
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => OgeApp.init());
  else OgeApp.init();
})();
