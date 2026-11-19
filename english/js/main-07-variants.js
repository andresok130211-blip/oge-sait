function generateVariants(){
  const container=document.getElementById('variantsContainer');
  if(!container)return;
  const note=document.createElement('div');note.className='hero';
  note.innerHTML='<h1>Варианты</h1><p><strong>Тренировочные задания, не официальные КИМ ОГЭ.</strong> Грамматика, лексика, письмо.</p>';
  container.appendChild(note);
  const shortQ=[
    ['Вставьте: She ___ (go) to school every day.','goes'],
    ['Вставьте: I ___ (be) 14 years old.','am'],
    ['Вставьте: They ___ (visit) London last year.','visited'],
    ['Вставьте: I have ___ finished my work (already/yesterday).','already'],
    ['Артикль: ___ apple','an'],
    ['Артикль: ___ sun','the'],
    ['Форма: go – ___ – gone','went'],
    ['Форма: see – saw – ___','seen'],
    ['Предлог: interested ___ music','in'],
    ['Предлог: good ___ English','at'],
    ['Much или many: How ___ sugar?','much'],
    ['Much или many: How ___ books?','many']
  ];
  const choice=[
    ['Choose: He ___ football on Sundays.','plays','play','playing'],
    ['Choose: Look! She ___ .','is running','runs','run'],
    ['Choose tense marker "ago"','Past Simple','Present Perfect','Present Continuous'],
    ['Choose: There ___ two chairs.','are','is','have'],
    ['Choose ending of informal letter','Best wishes','Yours faithfully only','The end'],
    ['Choose: I ___ not like tea.','do','does','am'],
    ['Not stated means','not in the text','false','true'],
    ['Future plan often uses','going to','went','did'],
    ['a/an used with','singular countable','plural only','names always'],
    ['Present Perfect uses','have + V3','V2 only','did + V3']
  ];
  for(let v=1;v<=50;v++){
    const unit=document.createElement('div');unit.className='unit';unit.dataset.unit='var'+v;
    unit.innerHTML='<div class="unit-header" onclick="toggleUnit(this)"><div class="unit-icon">📝</div><div class="unit-info"><h3>Вариант '+v+'</h3><p>12 заданий</p><div class="unit-progress"><div class="unit-progress-bar"></div></div></div><div class="unit-chevron">▼</div></div>';
    const body=document.createElement('div');body.className='unit-body';
    const lesson=document.createElement('div');lesson.className='lesson';lesson.dataset.lesson='var'+v;
    let h='<div class="theory"><p>Тренировка (не официальный КИМ). 1–8 краткий ответ, 9–12 выбор.</p></div><div class="quiz-box">';
    for(let i=0;i<8;i++){const q=shortQ[(v*2+i)%shortQ.length];h+='<div class="q-item open-q" data-a="'+q[1]+'"><div class="q-text">'+(i+1)+'. '+q[0]+'</div><input class="open-input" placeholder="Answer" style="width:100%;padding:10px;margin:8px 0;border-radius:10px;border:1px solid #ccc"><div class="fb"></div></div>';}
    for(let i=0;i<4;i++){const q=choice[(v+i)%choice.length];h+='<div class="q-item" data-c="1"><div class="q-text">'+(9+i)+'. '+q[0]+'</div><div class="opts"><button class="opt" data-v="1">'+q[1]+'</button><button class="opt" data-v="2">'+q[2]+'</button><button class="opt" data-v="3">'+q[3]+'</button></div><div class="fb"></div></div>';}
    h+='</div><button class="done-btn" style="display:block" onclick="checkOpenVariant(this)">Проверить</button>';
    lesson.innerHTML=h;body.appendChild(lesson);unit.appendChild(body);container.appendChild(unit);
  }
  bindQuizzes();
}
generateDuo();
generateVariants();

