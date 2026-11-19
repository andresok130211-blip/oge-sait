function generateVariants(){
  const container=document.getElementById('variantsContainer');
  if(!container)return;
  const note=document.createElement('div');
  note.className='hero';
  note.innerHTML='<h1>Варианты</h1><p><strong>Тренировочные задания, не официальные КИМ ОГЭ.</strong> Формат близок к экзамену: краткий ответ, выбор, соответствия.</p>';
  container.appendChild(note);

  const shortQ=[
    ['Сила тяжести тела массой 5 кг (g=10). Ответ в Н','50'],
    ['Путь при v=8 м/с за 4 с (равномерно). В метрах','32'],
    ['Ток при U=12 В и R=3 Ом. В амперах','4'],
    ['Мощность при A=120 Дж за 6 с. В ваттах','20'],
    ['Давление F=40 Н на S=2 м². В паскалях','20'],
    ['Оптическая сила при F=0,25 м. В диоптриях','4'],
    ['Период при частоте 25 Гц. В секундах','0,04'],
    ['Q нагрева 2 кг воды на 5°C (c=4200). В джоулях','42000'],
    ['R двух резисторов 3 Ом и 5 Ом последовательно','8'],
    ['Импульс m=2 кг, v=6 м/с','12'],
    ['R двух по 6 Ом параллельно','3'],
    ['E_k при m=2 кг, v=3 м/с','9'],
    ['E_p при m=4 кг, h=5 м (g=10)','200'],
    ['Путь s=v₀t+at²/2: v₀=0, a=4, t=3','18'],
    ['I при q=10 Кл за 5 с','2'],
    ['Вес тела 3 кг (g=10)','30'],
    ['Плотность m=400 г, V=200 см³. В г/см³','2'],
    ['F упругости k=100 Н/м, x=0,05 м','5'],
    ['λ при v=340 м/с, T=0,02 с','6,8'],
    ['D линзы F=50 см (в дптр)','2']
  ];
  const choice=[
    ['При увеличении R при постоянном U ток','Уменьшится','Увеличится','Не изменится'],
    ['На участке плавления температура','Постоянна','Растёт','Падает'],
    ['Изображение в плоском зеркале','Мнимое','Действительное','Отсутствует'],
    ['Единица мощности','Вт','Дж','Н'],
    ['Второй закон Ньютона','F=ma','I=U/R','Q=cmΔt'],
    ['Тело тонет, если его плотность по отношению к жидкости','Больше','Меньше','Равна нулю'],
    ['Амперметр в цепь включают','Последовательно','Параллельно','Вместо источника'],
    ['Горизонтальный участок графика s(t) означает','Покой','Ускорение','Свободное падение'],
    ['Сила Архимеда зависит от','Плотности жидкости и объёма','Цвета тела','Только массы в воздухе'],
    ['Последовательно соединённые резисторы: ток','Одинаков','Разный','Всегда ноль']
  ];
  const matchHints=[
    'Соотнесите: 1) плотность 2) сила 3) давление → A) F/S B) m/V C) ma',
    'Соотнесите: 1) Q=cmΔt 2) Q=λm 3) Q=Lm → A) плавление B) нагрев C) парообразование',
    'Соотнесите: 1) амперметр 2) вольтметр → A) последовательно B) параллельно'
  ];

  for(let v=1;v<=50;v++){
    const unit=document.createElement('div');unit.className='unit';unit.dataset.unit='var'+v;
    unit.innerHTML='<div class="unit-header" onclick="toggleUnit(this)"><div class="unit-icon">📝</div><div class="unit-info"><h3>Вариант '+v+'</h3><p>12 заданий · тренировка</p><div class="unit-progress"><div class="unit-progress-bar"></div></div></div><div class="unit-chevron">▼</div></div>';
    const body=document.createElement('div');body.className='unit-body';
    const lesson=document.createElement('div');lesson.className='lesson';lesson.dataset.lesson='var'+v;
    let h='<div class="theory"><p>Тренировочный вариант (не официальный КИМ). Задания 1–8 — краткий ответ, 9–12 — выбор.</p></div><div class="quiz-box">';
    for(let i=0;i<8;i++){
      const q=shortQ[(v*3+i)%shortQ.length];
      h+='<div class="q-item open-q" data-a="'+q[1]+'"><div class="q-text">'+(i+1)+'. '+q[0]+'</div><input class="open-input" placeholder="Ответ" style="width:100%;padding:10px;margin:8px 0;border-radius:10px;border:1px solid #ccc"><div class="fb"></div></div>';
    }
    for(let i=0;i<4;i++){
      const q=choice[(v+i)%choice.length];
      h+='<div class="q-item" data-c="1"><div class="q-text">'+(9+i)+'. '+q[0]+'</div><div class="opts"><button class="opt" data-v="1">'+q[1]+'</button><button class="opt" data-v="2">'+q[2]+'</button><button class="opt" data-v="3">'+q[3]+'</button></div><div class="fb"></div></div>';
    }
    h+='</div><button class="done-btn" style="display:block" onclick="checkOpenVariant(this)">Проверить</button>';
    lesson.innerHTML=h;body.appendChild(lesson);unit.appendChild(body);container.appendChild(unit);
  }
  bindQuizzes();
}


generateDuo();
generateVariants();

