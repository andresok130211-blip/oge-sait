/*
 * Сборщик страницы предмета.
 *
 * Страница предмета (например chemistry/index.html) состоит из маленьких файлов:
 *   - css/*.css            — стили
 *   - parts/*.html         — блоки страницы (темы / units), вставляются на место
 *                            заглушек <div data-include="parts/...">
 *   - js/*.js              — скрипты
 *
 * OGE_BOOT(scripts) делает три вещи по порядку:
 *   1) параллельно загружает все блоки parts/*.html и вставляет их на свои места;
 *   2) подключает скрипты из списка строго в том порядке, в каком они в списке;
 *   3) если страница уже успела «загрузиться», повторно шлёт событие load,
 *      чтобы скриптам, которые ждут load (например extras.js), ничего не потерялось.
 */
(function () {
  'use strict';

  function preload(list) {
    list.forEach(function (src) {
      var l = document.createElement('link');
      l.rel = 'preload';
      l.as = 'script';
      l.href = src;
      document.head.appendChild(l);
    });
  }

  function loadParts() {
    var holes = [].slice.call(document.querySelectorAll('[data-include]'));
    return Promise.all(holes.map(function (h) {
      return fetch(h.getAttribute('data-include')).then(function (r) {
        if (!r.ok) throw new Error('Не загрузился блок ' + h.getAttribute('data-include') + ' (' + r.status + ')');
        return r.text();
      });
    })).then(function (texts) {
      holes.forEach(function (h, i) {
        h.insertAdjacentHTML('beforebegin', texts[i]);
        h.parentNode.removeChild(h);
      });
    });
  }

  /*
   * Скрипты страницы написаны в расчёте на обычную загрузку: пока они подключаются,
   * document.readyState === 'loading', а обработчики DOMContentLoaded срабатывают
   * ПОСЛЕ того, как выполнились все скрипты. Блоки parts/ приходят позже разбора
   * страницы, поэтому здесь воспроизводим тот же порядок: на время подключения
   * скриптов readyState «притворяется» loading, обработчики DOMContentLoaded
   * копятся и запускаются после последнего скрипта.
   */
  function loadScripts(list) {
    var queued = [];
    var realAdd = document.addEventListener;
    document.addEventListener = function (type, fn, opts) {
      if (type === 'DOMContentLoaded') { queued.push(fn); return; }
      return realAdd.call(document, type, fn, opts);
    };
    Object.defineProperty(document, 'readyState', { configurable: true, get: function () { return 'loading'; } });

    function restore() {
      document.addEventListener = realAdd;
      delete document.readyState;
    }

    // async=false: скачиваются параллельно, выполняются строго по порядку
    return Promise.all(list.map(function (src) {
      return new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = src;
        s.async = false;
        s.onload = resolve;
        s.onerror = function () { reject(new Error('Не загрузился скрипт ' + src)); };
        document.body.appendChild(s);
      });
    })).then(function () {
      restore();
      var ev = new Event('DOMContentLoaded');
      queued.forEach(function (fn) {
        try {
          if (typeof fn === 'function') fn.call(document, ev); else if (fn && fn.handleEvent) fn.handleEvent(ev);
        } catch (e) { console.error(e); }
      });
    }, function (e) { restore(); throw e; });
  }

  window.OGE_BOOT = function (scripts) {
    preload(scripts);
    loadParts()
      .then(function () { return loadScripts(scripts); })
      .then(function () {
        window.OGE_READY = true;
        if (document.readyState === 'complete') window.dispatchEvent(new Event('load'));
      })
      .catch(function (e) {
        console.error(e);
        var m = document.createElement('div');
        m.style.cssText = 'padding:16px;margin:16px;background:#fee2e2;color:#991b1b;border-radius:12px;font:600 14px system-ui';
        m.textContent = 'Не удалось загрузить страницу. Проверь интернет и обнови её.';
        document.body.insertBefore(m, document.body.firstChild);
      });
  };
})();
