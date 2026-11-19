function generateVariants(){
  const container=document.getElementById('variantsContainer');
  container.innerHTML='';
  const matchTasks=[
    {title:'Зона — признак',left:['А) Тундра','Б) Тайга','В) Степь','Г) Пустыня'],right:['1) Хвойный лес','2) Ягель','3) Чернозём','4) Мало осадков'],ans:'2134'},
    {title:'Объект — факт',left:['А) Эльбрус','Б) Урал','В) Волга','Г) Байкал'],right:['1) Граница Европы и Азии','2) Высшая точка РФ','3) Глубочайшее озеро','4) Впадает в Каспий'],ans:'2143'},
    {title:'Ресурс — район',left:['А) Нефть','Б) Уголь','В) Железная руда','Г) Газ'],right:['1) Кузбасс','2) Западная Сибирь','3) КМА','4) Ямал'],ans:'2134'},
    {title:'Река — море/океан',left:['А) Волга','Б) Лена','В) Амур','Г) Дон'],right:['1) Сев. Ледовитый','2) Каспий','3) Тихий','4) Азовское'],ans:'2134'},
  ];
  const shortQ=[
    ['Высшая точка России','эльбрус'],['Самая большая природная зона','тайга'],['Горы — граница Европы и Азии','урал'],
    ['Главный район нефти и газа','западная сибирь'],['Климатический пояс большей части РФ','умеренный'],
    ['Чернозёмы типичны для','степи|лесостепи'],['Крупнейший город России','москва'],['Самое глубокое озеро','байкал'],
    ['Угольный бассейн','кузбасс'],['Субтропики в РФ','кавказ|сочи'],['Волга впадает в','каспий|каспийское море'],
    ['Незамерзающий порт севера','мурманск'],['Порт Тихого океана','владивосток'],['КМА — это запасы','железной руды|железа'],
    ['Азимут юга (градусы)','180'],['Широта экватора','0'],['Нулевой меридиан','гринвич'],
  ];
  for(let v=1;v<=40;v++){
    const unit=document.createElement('div');unit.className='unit'+(v===1?' open':'');
    const header=document.createElement('div');header.className='unit-header';header.onclick=function(){toggleUnit(this)};
    header.innerHTML=`<div class="unit-icon">${v}</div><div class="unit-info"><h3>Вариант ${v}</h3><p>Тренировка · не официальный КИМ</p><div class="unit-progress"><div class="unit-progress-bar"></div></div></div><div class="unit-chevron">▼</div>`;
    unit.appendChild(header);
    const body=document.createElement('div');body.className='unit-body';
    const lesson=document.createElement('div');lesson.className='lesson';lesson.dataset.lesson='gv'+v;
    // 2 match
    for(let m=0;m<2;m++){
      const mt=matchTasks[(v+m)%matchTasks.length];
      let L='',R='';mt.left.forEach(x=>L+=x+'<br>');mt.right.forEach(x=>R+=x+'<br>');
      const t=document.createElement('div');t.className='exam-task open-task';t.dataset.answer=mt.ans;
      t.innerHTML=`<div class="exam-title"><span class="exam-num">${m+1}</span> ${mt.title}</div><div class="exam-text"><strong>СТОЛБЕЦ 1</strong><br>${L}</div><div class="exam-text"><strong>СТОЛБЕЦ 2</strong><br>${R}</div><div class="ans-row"><label>Ответ:</label><input type="text" class="ans-input" placeholder="${mt.ans}" autocomplete="off"></div><div class="correct-ans">Правильный ответ: <strong>${mt.ans}</strong></div>`;
      lesson.appendChild(t);
    }
    // 12 short
    for(let i=0;i<12;i++){
      const item=shortQ[(v*3+i)%shortQ.length];
      const t=document.createElement('div');t.className='exam-task open-task';t.dataset.answer=item[1];
      t.innerHTML=`<div class="exam-title"><span class="exam-num">${i+3}</span> Краткий ответ</div><div class="exam-text">${item[0]}?</div><div class="ans-row"><label>Ответ:</label><input type="text" class="ans-input" placeholder="Ответ" autocomplete="off"></div><div class="correct-ans">Правильный ответ: <strong>${item[1].split('|')[0]}</strong></div>`;
      lesson.appendChild(t);
    }
    const btn=document.createElement('button');btn.className='check-btn';btn.textContent='Проверить вариант';btn.onclick=function(){checkOpenVariant(this)};
    lesson.appendChild(btn);
    const res=document.createElement('div');res.className='var-result';lesson.appendChild(res);
    const done=document.createElement('button');done.className='done-btn';done.style.display='none';done.textContent=`Вариант ${v} засчитан ✓`;done.onclick=function(){completeLesson(this,50)};
    lesson.appendChild(done);
    body.appendChild(lesson);unit.appendChild(body);container.appendChild(unit);
  }
}

generateDuo();
generateVariants();

