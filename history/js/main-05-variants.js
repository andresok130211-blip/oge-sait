function generateVariants() {
  const container = document.getElementById('variantsContainer');
  const variants = [
    { name: 'Отечественная война 1812', year: 'XIX век', place1: 'Бородино', place2: 'Москва', answer1: 'Бородино', answer2: 'Москва' },
    { name: 'Нашествие Батыя', year: 'XIII век', place1: 'Рязань', place2: 'Владимир', answer1: 'Рязань', answer2: 'Владимир' },
    { name: 'Крымская война', year: 'XIX век', place1: 'Севастополь', place2: 'Евпатория', answer1: 'Севастополь', answer2: 'Евпатория' },
    { name: 'Северная война', year: 'XVIII век', place1: 'Полтава', place2: 'Нарва', answer1: 'Полтава', answer2: 'Нарва' },
    { name: 'Раздробленность Руси', year: 'XII век', place1: 'Новгород', place2: 'Владимир', answer1: 'Новгород', answer2: 'Владимир' },
    { name: 'Смутное время', year: 'XVII век', place1: 'Москва', place2: 'Ярославль', answer1: 'Москва', answer2: 'Ярославль' },
    { name: 'Русско-японская война', year: 'XX век', place1: 'Порт-Артур', place2: 'Цусима', answer1: 'Порт-Артур', answer2: 'Цусима' },
    { name: 'Кавказская война', year: 'XIX век', place1: 'Грозная', place2: 'Шамиль', answer1: 'Грозная', answer2: 'Шамиль' },
    { name: 'Восстание Пугачёва', year: 'XVIII век', place1: 'Яицкий городок', place2: 'Оренбург', answer1: 'Яицкий городок', answer2: 'Оренбург' },
    { name: 'Ливонская война', year: 'XVI век', place1: 'Нарва', place2: 'Полоцк', answer1: 'Нарва', answer2: 'Полоцк' },
    { name: 'Русско-турецкая война 1877-78', year: 'XIX век', place1: 'Плевна', place2: 'Шипка', answer1: 'Плевна', answer2: 'Шипка' },
    { name: 'Восстание декабристов', year: 'XIX век', place1: 'Сенатская площадь', place2: 'Петербург', answer1: 'Сенатская площадь', answer2: 'Петербург' },
    { name: 'Опричнина', year: 'XVI век', place1: 'Александровская слобода', place2: 'Москва', answer1: 'Александровская слобода', answer2: 'Москва' },
    { name: 'Церковный раскол', year: 'XVII век', place1: 'Москва', place2: 'Соловки', answer1: 'Москва', answer2: 'Соловки' },
    { name: 'Присоединение Сибири', year: 'XVI век', place1: 'Искер', place2: 'Тобольск', answer1: 'Искер', answer2: 'Тобольск' },
    { name: 'Азовские походы', year: 'XVII век', place1: 'Азов', place2: 'Дон', answer1: 'Азов', answer2: 'Дон' },
    { name: 'Русско-шведская война 1808-09', year: 'XIX век', place1: 'Финляндия', place2: 'Ботния', answer1: 'Финляндия', answer2: 'Ботния' },
    { name: 'Крестьянская война Разина', year: 'XVII век', place1: 'Дон', place2: 'Астрахань', answer1: 'Дон', answer2: 'Астрахань' },
    { name: 'Прутский поход', year: 'XVIII век', place1: 'Прут', place2: 'Станилешты', answer1: 'Прут', answer2: 'Станилешты' },
    { name: 'Семилетняя война', year: 'XVIII век', place1: 'Кунерсдорф', place2: 'Пальциг', answer1: 'Кунерсдорф', answer2: 'Пальциг' },
    { name: 'Восстание Болотникова', year: 'XVII век', place1: 'Путивль', place2: 'Москва', answer1: 'Путивль', answer2: 'Москва' },
    { name: 'Русско-польская война 1654-67', year: 'XVII век', place1: 'Смоленск', place2: 'Вильно', answer1: 'Смоленск', answer2: 'Вильно' },
    { name: 'Хивинский поход', year: 'XIX век', place1: 'Хива', place2: 'Казалинск', answer1: 'Хива', answer2: 'Казалинск' },
    { name: 'Кокандский поход', year: 'XIX век', place1: 'Ташкент', place2: 'Ходжент', answer1: 'Ташкент', answer2: 'Ходжент' },
    { name: 'Бухарский поход', year: 'XIX век', place1: 'Самарканд', place2: 'Бухара', answer1: 'Самарканд', answer2: 'Бухара' },
    { name: 'Первая мировая война', year: 'XX век', place1: 'Галиция', place2: 'Варшава', answer1: 'Галиция', answer2: 'Варшава' },
    { name: 'Гражданская война', year: 'XX век', place1: 'Царицын', place2: 'Екатеринбург', answer1: 'Царицын', answer2: 'Екатеринбург' },
    { name: 'Нэп и индустриализация', year: 'XX век', place1: 'Москва', place2: 'Донбасс', answer1: 'Москва', answer2: 'Донбасс' },
    { name: 'Великая Отечественная война', year: 'XX век', place1: 'Сталинград', place2: 'Курск', answer1: 'Сталинград', answer2: 'Курск' },
    { name: 'Холодная война', year: 'XX век', place1: 'Берлин', place2: 'Куба', answer1: 'Берлин', answer2: 'Куба' }
  ];

  for (let v = 0; v < variants.length; v++) {
    const data = variants[v];
    const num = v + 1;
    const unit = document.createElement('div');
    unit.className = 'unit';
    unit.dataset.unit = 'hv' + num;

    const header = document.createElement('div');
    header.className = 'unit-header';
    header.onclick = function(){ toggleUnit(this); };
    header.innerHTML = `<div class="unit-icon">${num}</div><div class="unit-info"><h3>Вариант ${num}</h3><p>24 задания · формат ОГЭ</p><div class="unit-progress"><div class="unit-progress-bar"></div></div></div><div class="unit-chevron">▼</div>`;
    unit.appendChild(header);

    const body = document.createElement('div');
    body.className = 'unit-body';
    const lesson = document.createElement('div');
    lesson.className = 'lesson';
    lesson.dataset.lesson = 'hv' + num;

    // Задание 1: Соответствие
    const t1 = document.createElement('div');
    t1.className = 'exam-task open-task';
    t1.dataset.answer = '5142';
    t1.innerHTML = `
      <div class="exam-title"><span class="exam-num">1</span> Установите соответствие</div>
      <div class="exam-text">Установите соответствие между событиями и годами.</div>
      <div class="exam-match">
        <div class="col"><strong>СОБЫТИЯ</strong><br>А) Земская реформа<br>Б) Битва на Калке<br>В) Полтавская битва<br>Г) Соборное уложение</div>
        <div class="col"><strong>ГОДЫ</strong><br>1) 1223 г.<br>2) 1327 г.<br>3) 1649 г.<br>4) 1709 г.<br>5) 1864 г.</div>
      </div>
      <div class="ans-row"><label>Ответ (цифры без пробелов):</label><input type="text" class="ans-input" placeholder="Например: 5142" autocomplete="off"></div>
      <div class="correct-ans">Правильный ответ: <strong>5142</strong></div>
    `;
    lesson.appendChild(t1);

    // Задание 2: Хронология
    const t2 = document.createElement('div');
    t2.className = 'exam-task open-task';
    t2.dataset.answer = '2143';
    t2.innerHTML = `
      <div class="exam-title"><span class="exam-num">2</span> Хронологическая последовательность</div>
      <div class="exam-text">Расположите в хронологическом порядке события XIX века.</div>
      <div class="exam-text">1) учреждение министерств<br>2) реформа Киселёва<br>3) создание Госсовета<br>4) начало правления Александра I</div>
      <div class="ans-row"><label>Ответ:</label><input type="text" class="ans-input" placeholder="Например: 2143" autocomplete="off"></div>
      <div class="correct-ans">Правильный ответ: <strong>2143</strong></div>
    `;
    lesson.appendChild(t2);

    // Задание 3: Термин
    const t3 = document.createElement('div');
    t3.className = 'exam-task open-task';
    t3.dataset.answer = 'местничество';
    t3.innerHTML = `
      <div class="exam-title"><span class="exam-num">3</span> Запишите термин</div>
      <div class="exam-source">«Распределение служебных должностей в XV–XVII вв. в зависимости от родовитости.»</div>
      <div class="ans-row"><label>Ответ:</label><input type="text" class="ans-input" placeholder="Термин" autocomplete="off"></div>
      <div class="correct-ans">Правильный ответ: <strong>местничество</strong></div>
    `;
    lesson.appendChild(t3);

    // Задание 4: Города Батыя
    const t4 = document.createElement('div');
    t4.className = 'exam-task open-task';
    t4.dataset.answer = '12';
    t4.innerHTML = `
      <div class="exam-title"><span class="exam-num">4</span> Города, захваченные Батыем</div>
      <div class="exam-text">Какие города были захвачены в 1237–1238 гг.? Выберите два.</div>
      <div class="exam-text">1) Рязань<br>2) Владимир<br>3) Новгород<br>4) Псков<br>5) Смоленск</div>
      <div class="ans-row"><label>Ответ:</label><input type="text" class="ans-input" placeholder="Например: 12" autocomplete="off"></div>
      <div class="correct-ans">Правильный ответ: <strong>12</strong></div>
    `;
    lesson.appendChild(t4);

    // Задание 5: Лишнее
    const t5 = document.createElement('div');
    t5.className = 'exam-task open-task';
    t5.dataset.answer = '2';
    t5.innerHTML = `
      <div class="exam-title"><span class="exam-num">5</span> Исключите лишнее</div>
      <div class="exam-text">Все термины, кроме одного, обозначают сословия. Найдите лишний.</div>
      <div class="exam-text">1) купцы<br>2) пролетарии<br>3) мещане<br>4) казаки<br>5) дворяне</div>
      <div class="ans-row"><label>Ответ (номер):</label><input type="text" class="ans-input" placeholder="Номер" autocomplete="off"></div>
      <div class="correct-ans">Правильный ответ: <strong>2</strong></div>
    `;
    lesson.appendChild(t5);

    // Задание 6: Тезисы и факты
    const t6 = document.createElement('div');
    t6.className = 'exam-task open-task';
    t6.dataset.answer = '31|42';
    t6.innerHTML = `
      <div class="exam-title"><span class="exam-num">6</span> Тезисы и факты</div>
      <div class="exam-text">Подберите факты к тезисам.</div>
      <div class="exam-text">1) Тильзитский мир — присоединение к блокаде Англии.<br>2) При Александре I — Конституция Польши, отмена крепостного в Прибалтике.<br>3) Реформы Александра I — прогрессивные.<br>4) Внешняя политика начала XIX в. имела негативные последствия.</div>
      <div class="ans-row"><label>Ответ (тезис|факт через |):</label><input type="text" class="ans-input" placeholder="31|42" autocomplete="off"></div>
      <div class="correct-ans">Правильный ответ: <strong>31|42</strong></div>
    `;
    lesson.appendChild(t6);

    // Задание 7: Статистика
    const t7 = document.createElement('div');
    t7.className = 'exam-task open-task';
    t7.dataset.answer = '523';
    t7.innerHTML = `
      <div class="exam-title"><span class="exam-num">7</span> Статистика</div>
      <div class="exam-text">Используя данные таблицы, завершите суждения.</div>
      <table class="exam-table">
        <tr><th>Отрасль</th><th>1900</th><th>1913</th></tr>
        <tr><td>Сельское хозяйство</td><td>4,5 млн</td><td>6,5 млн</td></tr>
        <tr><td>Строительство</td><td>1 млн</td><td>1,5 млн</td></tr>
        <tr><td>Мелкая промышленность</td><td>2 млн</td><td>3 млн</td></tr>
      </table>
      <div class="exam-text">А) Большинство рабочих трудились в ...<br>Б) Число рабочих в строительстве и мелкой промышленности ...<br>В) Примерно 1/4 сельхозработников составляли занятые в ...</div>
      <div class="exam-text">Варианты: 1) строительстве 2) выросло в 2 раза 3) мелкой промышленности 4) одинаковыми темпами 5) сельском хозяйстве</div>
      <div class="ans-row"><label>Ответ (например, 523):</label><input type="text" class="ans-input" placeholder="Например: 523" autocomplete="off"></div>
      <div class="correct-ans">Правильный ответ: <strong>523</strong></div>
    `;
    lesson.appendChild(t7);

    // Задания 8-10: Карта
    const t8 = document.createElement('div');
    t8.className = 'exam-task open-task';
    t8.dataset.answer = data.year + '|' + data.answer1 + '|1';
    t8.innerHTML = `
      <div class="exam-title"><span class="exam-num">8</span> Карта — век</div>
      <div class="exam-text">Укажите век, когда произошли события, изображённые на схеме.</div>
      <div class="fig">
        <svg viewBox="0 0 400 280" width="400" height="280">
          <rect x="5" y="5" width="390" height="270" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5" rx="6"/>
          <text x="200" y="25" text-anchor="middle" font-size="12" font-weight="700" fill="#1e40af">Схема военных действий</text>
          <path d="M80 230 L120 210 L160 190 L200 170 L240 150 L280 130 L320 110 L360 90" stroke="#1e40af" stroke-width="1.5" fill="none"/>
          <path d="M80 230 L60 240 L40 230 L30 210 L40 190 L60 180 L80 170 L100 160 L120 150 L140 140 L160 130 L180 120 L200 110 L220 100 L240 90 L260 80 L280 70 L300 60 L320 50 L340 40 L360 30" stroke="#1e40af" stroke-width="1.5" fill="#dbeafe"/>
          <text x="180" y="200" font-size="10" fill="#1e40af">Россия</text>
          <circle cx="200" cy="160" r="8" fill="#dc2626" stroke="#fff" stroke-width="1.5"/>
          <text x="200" y="175" text-anchor="middle" font-size="8" font-weight="700" fill="#dc2626">${data.place1}</text>
          <line x1="360" y1="30" x2="300" y2="100" stroke="#2563eb" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#arrowB)"/>
          <line x1="300" y1="100" x2="200" y2="160" stroke="#2563eb" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#arrowB)"/>
          <circle cx="200" cy="160" r="12" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
          <text x="200" y="164" text-anchor="middle" font-size="10" font-weight="700" fill="#d97706">1</text>
          <circle cx="300" cy="100" r="12" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
          <text x="300" y="104" text-anchor="middle" font-size="10" font-weight="700" fill="#d97706">2</text>
          <circle cx="360" cy="30" r="12" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
          <text x="360" y="34" text-anchor="middle" font-size="10" font-weight="700" fill="#d97706">3</text>
          <defs><marker id="arrowB" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#2563eb"/></marker></defs>
        </svg>
      </div>
      <div class="ans-row"><label>Ответ (век словом, например: XIX век):</label><input type="text" class="ans-input" placeholder="Например: XIX век" autocomplete="off"></div>
      <div class="correct-ans">Правильный ответ: <strong>${data.year}</strong></div>
    `;
    lesson.appendChild(t8);

    const t9 = document.createElement('div');
    t9.className = 'exam-task open-task';
    t9.dataset.answer = data.answer1;
    t9.innerHTML = `
      <div class="exam-title"><span class="exam-num">9</span> Карта — название города</div>
      <div class="exam-text">Укажите название города, обозначенного на схеме цифрой «1».</div>
      <div class="ans-row"><label>Ответ:</label><input type="text" class="ans-input" placeholder="Название" autocomplete="off"></div>
      <div class="correct-ans">Правильный ответ: <strong>${data.answer1}</strong></div>
    `;
    lesson.appendChild(t9);

    const t10 = document.createElement('div');
    t10.className = 'exam-task open-task';
    t10.dataset.answer = '1';
    t10.innerHTML = `
      <div class="exam-title"><span class="exam-num">10</span> Карта — город по тексту</div>
      <div class="exam-text">Прочитайте отрывок и укажите цифру, обозначающую город, название которого пропущено.</div>
      <div class="exam-source">«...войска противника осадили ________, но защитники города выдержали долгую осаду.»</div>
      <div class="ans-row"><label>Ответ (цифра):</label><input type="text" class="ans-input" placeholder="Например: 1" autocomplete="off"></div>
      <div class="correct-ans">Правильный ответ: <strong>1</strong></div>
    `;
    lesson.appendChild(t10);

    // Задания 11-23: Краткие
    const shortQs = [
      { id: 11, text: 'Участником событий, увековеченных в памятнике, был:', opts: '1) Кутузов 2) Нахимов 3) Скобелев 4) Суворов', ans: '4' },
      { id: 12, text: 'Запишите название, пропущенное на схеме мирных договоров.', ans: 'Тильзитский мир' },
      { id: 13, text: 'Какие два памятника созданы в XVII веке?', opts: '1) Собор Василия Блаженного 2) Дворец в Коломенском 3) Успенский собор во Владимире 4) Церковь Покрова в Филях', ans: '24' },
      { id: 14, text: 'Создателем какого памятника является Екатерина Великая?', opts: '1) Медный всадник 2) Минину и Пожарскому 3) Александровская колонна', ans: '1' },
      { id: 15, text: 'Участником какого события был Спартак?', ans: '1' },
      { id: 16, text: 'Прочтите отрывок и укажите событие.', source: '«…Низкий Спартак, в Италийской области всей беснуясь…»', ans: '3' },
      { id: 17, text: 'Назовите императора и войну по записке.', ans: 'Александр I|Отечественная война 1812' },
      { id: 18, text: 'Почему Россия спасает Австрию? Какой пример приводит автор? Почему союз невозможен?', ans: 'Священный союз|война с Турцией|недоверие' },
      { id: 19, text: 'Укажите три итога войны.', ans: 'Венский конгресс|Священный союз|присоединение Финляндии' },
      { id: 20, text: 'Что стало причиной введения рекрутских наборов?', opts: '1) Северная война 2) Ливонская война 3) Крымская война', ans: '1' },
      { id: 21, text: 'Найдите две ошибки в тексте о Петре I.', source: '«Пётр I заменил приказы на министерства... ввёл всеобщую воинскую повинность.»', ans: 'министерства→коллегии|всеобщая воинская повинность→рекрутские наборы' },
      { id: 22, text: 'Назовите отличия в положении крестьян в начале XIX в. и 1860–70-х гг.', ans: 'личная свобода|выкупные платежи|земство' },
      { id: 23, text: 'Укажите век, князя и архитектора Успенского собора.', ans: 'XV век|Иван III|Аристотель Фиораванти' }
    ];

    shortQs.forEach(q => {
      const div = document.createElement('div');
      div.className = 'exam-task open-task';
      div.dataset.answer = q.ans;
      let html = `<div class="exam-title"><span class="exam-num">${q.id}</span> `;
      if (q.id === 11 || q.id === 13 || q.id === 14 || q.id === 20) {
        html += q.text + '</div><div class="exam-text">' + q.opts + '</div>';
      } else if (q.id === 16 || q.id === 21) {
        html += q.text + '</div><div class="exam-source">' + q.source + '</div>';
      } else if (q.id === 15 || q.id === 17 || q.id === 18 || q.id === 19 || q.id === 22 || q.id === 23) {
        html += q.text + '</div>';
      } else {
        html += q.text + '</div>';
      }
      html += `<div class="ans-row"><label>Ответ:</label><input type="text" class="ans-input" placeholder="Ответ" autocomplete="off"></div>
              <div class="correct-ans">Правильный ответ: <strong>${q.ans}</strong></div>`;
      div.innerHTML = html;
      lesson.appendChild(div);
    });

    // Кнопка проверки
    const checkBtn = document.createElement('button');
    checkBtn.className = 'check-btn';
    checkBtn.textContent = 'Проверить вариант';
    checkBtn.onclick = function(){ checkOpenVariant(this); };
    lesson.appendChild(checkBtn);

    const resultDiv = document.createElement('div');
    resultDiv.className = 'var-result';
    lesson.appendChild(resultDiv);

    const doneBtn = document.createElement('button');
    doneBtn.className = 'done-btn';
    doneBtn.textContent = 'Вариант ' + num + ' засчитан ✓';
    doneBtn.style.display = 'none';
    doneBtn.onclick = function(){ completeLesson(this, 80); };
    lesson.appendChild(doneBtn);

    body.appendChild(lesson);
    unit.appendChild(body);
    container.appendChild(unit);
  }
}

// ===================== ПРОВЕРКА ВАРИАНТОВ =====================
function normalizeAns(s) {
  return String(s).trim().toLowerCase().replace(/\s+/g,'').replace(',','.').replace('−','-').replace('ё','е');
}
function checkOpenVariant(btn) {
  const lesson = btn.closest('.lesson');
  if (lesson.dataset.checked === '1') return;
  const tasks = lesson.querySelectorAll('.open-task');
  let ok = 0, total = tasks.length;
  tasks.forEach(t => {
    const input = t.querySelector('.ans-input');
    if (!input) return;
    const corrects = normalizeAns(t.dataset.answer).split('|');
    const user = normalizeAns(input.value);
    const ansBox = t.querySelector('.correct-ans');
    let match = corrects.some(c => c === user);
    if (!match && user.length === 2 && corrects[0] && corrects[0].length === 2) {
      match = user.split('').sort().join('') === corrects[0].split('').sort().join('');
    }
    if (match && user !== '') {
      input.classList.add('ok'); ok++;
    } else {
      input.classList.add('bad');
    }
    if (ansBox) ansBox.classList.add('show');
    input.readOnly = true;
  });
  lesson.dataset.checked = '1';
  btn.disabled = true;
  btn.textContent = 'Проверено';
  const res = lesson.querySelector('.var-result');
  const pct = total ? Math.round(ok/total*100) : 0;
  if (res) {
    res.classList.add('show');
    res.innerHTML = 'Результат: <strong>' + ok + ' из ' + total + '</strong> (' + pct + '%)';
    if (pct >= 80) res.className = 'var-result show good';
    else if (pct >= 50) res.className = 'var-result show mid';
    else res.className = 'var-result show bad';
  }
  const done = lesson.querySelector('.done-btn');
  if (done) done.style.display = 'block';
}

// Запускаем генерацию
generateDuo();
generateVariants();
