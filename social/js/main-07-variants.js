function generateVariants(){
  const container=document.getElementById('variantsContainer');
  if(!container)return;
  const note=document.createElement('div');note.className='hero';
  note.innerHTML='<h1>Варианты</h1><p><strong>Тренировочные задания, не официальные КИМ ОГЭ.</strong></p>';
  container.appendChild(note);
  const shortQ=[
    ['Термин: отдельный человек (не группа)','индивид'],
    ['Основной закон государства','конституция'],
    ['Рост общего уровня цен','инфляция'],
    ['Форма правления с выборной властью (не монархия)','республика'],
    ['Обязательный платёж государству','налог'],
    ['Система норм, установленных государством','право'],
    ['Положение человека в обществе','статус'],
    ['Нормы добра и зла','мораль'],
  ];
  const choice=[
    ['Человек — существо','биосоциальное','только биологическое','только социальное без тела'],
    ['Школа — это','социальный институт','вид налога','форма рельефа'],
    ['К факторам производства относится','труд','сон','артикли'],
    ['Демократия предполагает','выборы','запрет прав','отсутствие законов'],
    ['Конституция РФ —','основной закон','роман','рецепт'],
    ['Преступление —','уголовно наказуемое деяние','любая ошибка','опоздание на 1 минуту'],
    ['Инфляция —','рост цен','падение одного товара всегда','отмена денег'],
    ['Факт — это','проверяемое утверждение','только мнение','оценка «красиво»'],
    ['Семейное право регулирует','брак и семью','только налоги','только выборы'],
    ['Глобализация —','усиление связей стран','полная изоляция','отмена общества']
  ];
  for(let v=1;v<=50;v++){
    const unit=document.createElement('div');unit.className='unit';unit.dataset.unit='var'+v;
    unit.innerHTML='<div class="unit-header" onclick="toggleUnit(this)"><div class="unit-icon">📝</div><div class="unit-info"><h3>Вариант '+v+'</h3><p>12 заданий</p><div class="unit-progress"><div class="unit-progress-bar"></div></div></div><div class="unit-chevron">▼</div></div>';
    const body=document.createElement('div');body.className='unit-body';
    const lesson=document.createElement('div');lesson.className='lesson';lesson.dataset.lesson='var'+v;
    let h='<div class="theory"><p>Тренировка (не офиц. КИМ). 1–8 краткий ответ, 9–12 выбор.</p></div><div class="quiz-box">';
    for(let i=0;i<8;i++){const q=shortQ[(v+i)%shortQ.length];h+='<div class="q-item open-q" data-a="'+q[1]+'"><div class="q-text">'+(i+1)+'. '+q[0]+'</div><input class="open-input" placeholder="Ответ" style="width:100%;padding:10px;margin:8px 0;border-radius:10px;border:1px solid #ccc"><div class="fb"></div></div>';}
    for(let i=0;i<4;i++){const q=choice[(v+i)%choice.length];h+='<div class="q-item" data-c="1"><div class="q-text">'+(9+i)+'. '+q[0]+'</div><div class="opts"><button class="opt" data-v="1">'+q[1]+'</button><button class="opt" data-v="2">'+q[2]+'</button><button class="opt" data-v="3">'+q[3]+'</button></div><div class="fb"></div></div>';}
    h+='</div><button class="done-btn" style="display:block" onclick="checkOpenVariant(this)">Проверить</button>';
    lesson.innerHTML=h;body.appendChild(lesson);unit.appendChild(body);container.appendChild(unit);
  }
  bindQuizzes();
}
generateDuo();
generateVariants();

