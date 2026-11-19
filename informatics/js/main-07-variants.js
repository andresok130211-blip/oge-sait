function generateVariants(){
  const container=document.getElementById('variantsContainer');
  if(!container)return;
  const note=document.createElement('div');note.className='hero';
  note.innerHTML='<h1>Варианты</h1><p><strong>Тренировочные задания, не официальные КИМ ОГЭ.</strong></p>';
  container.appendChild(note);
  const shortQ=[
    ['1010₂ в десятичной системе','10'],['1 байт = ? бит','8'],
    ['НЕ 1 = ?','0'],['1 И 0 = ?','0'],['1 ИЛИ 0 = ?','1'],
    ['111₂ = ?₁₀','7'],['log₂ 8 = ?','3'],['1024 байт = ? Кбайт','1'],
    ['Основание двоичной системы','2'],['8₁₀ в двоичной (ответ числом 1000)','1000'],
  ];
  const choice=[
    ['* в маске означает','любую последовательность','один символ','только точку'],
    ['if в программе — это','ветвление','только цикл','имя файла'],
    ['Формула в таблице начинается с','=','#','@'],
    ['Конъюнкция — это','И','ИЛИ','НЕ'],
    ['Алгоритм должен быть','конечным','бесконечным','случайным'],
    ['ОЗУ — это память','оперативная','только на диске','бумажная'],
    ['Фишинг — это','мошенничество','антивирус','процессор'],
    ['$A$1 — ссылка','абсолютная','относительная','маска файла'],
    ['Цикл while нужен чтобы','повторять действия','удалить файл','сменить IP'],
    ['1 Кбайт в задачах ОГЭ часто','1024 байт','1000 бит','8 бит']
  ];
  for(let v=1;v<=50;v++){
    const unit=document.createElement('div');unit.className='unit';unit.dataset.unit='var'+v;
    unit.innerHTML='<div class="unit-header" onclick="toggleUnit(this)"><div class="unit-icon">📝</div><div class="unit-info"><h3>Вариант '+v+'</h3><p>12 заданий</p><div class="unit-progress"><div class="unit-progress-bar"></div></div></div><div class="unit-chevron">▼</div></div>';
    const body=document.createElement('div');body.className='unit-body';
    const lesson=document.createElement('div');lesson.className='lesson';lesson.dataset.lesson='var'+v;
    let h='<div class="theory"><p>Тренировка (не офиц. КИМ).</p></div><div class="quiz-box">';
    for(let i=0;i<8;i++){const q=shortQ[(v+i)%shortQ.length];h+='<div class="q-item open-q" data-a="'+q[1]+'"><div class="q-text">'+(i+1)+'. '+q[0]+'</div><input class="open-input" placeholder="Ответ" style="width:100%;padding:10px;margin:8px 0;border-radius:10px;border:1px solid #ccc"><div class="fb"></div></div>';}
    for(let i=0;i<4;i++){const q=choice[(v+i)%choice.length];h+='<div class="q-item" data-c="1"><div class="q-text">'+(9+i)+'. '+q[0]+'</div><div class="opts"><button class="opt" data-v="1">'+q[1]+'</button><button class="opt" data-v="2">'+q[2]+'</button><button class="opt" data-v="3">'+q[3]+'</button></div><div class="fb"></div></div>';}
    h+='</div><button class="done-btn" style="display:block" onclick="checkOpenVariant(this)">Проверить</button>';
    lesson.innerHTML=h;body.appendChild(lesson);unit.appendChild(body);container.appendChild(unit);
  }
  bindQuizzes();
}
generateDuo();
generateVariants();

