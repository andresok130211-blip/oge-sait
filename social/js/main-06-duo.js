function generateDuo(){
  const container=document.getElementById('duoContainer');
  if(!container)return;
  const bank=[
    ['Человек — существо?','Биосоциальное','Только каменное','Только газовое',1],
    ['Индивид — это?','Отдельный человек','Только группа','Закон',1],
    ['Сфер общества?','4','1','50',1],
    ['Школа — институт?','Социальный','Геологический','Кулинарный',1],
    ['Фактор производства?','Труд','Сон','Шутка',1],
    ['Инфляция —?','Рост цен','Падение яблока','Отмена школ',1],
    ['Признак государства?','Суверенитет','Мода','Цвет флага только',1],
    ['Демократия предполагает?','Выборы','Запрет прав','Хаос без норм',1],
    ['Конституция —?','Основной закон','Рецепт','Роман',1],
    ['Преступление —?','Уголовно наказуемое','Любая ошибка','Опоздание на 1 мин',1],
    ['Семья —?','Группа и институт','Только дом','Налог',1],
    ['Статус —?','Положение в обществе','Рост','Цвет глаз',1],
    ['Мораль —?','Добро и зло','Курс валют','ПДД только',1],
    ['Факт можно?','Проверить','Только почувствовать','Никогда',1],
    ['Налог —?','Обязательный платёж','Подарок','Зарплата',1],
    ['Республика — форма?','Правления','Рельефа','Облака',1],
    ['Право на образование?','Право','Штраф','Запрет',1],
    ['Глобализация —?','Сближение стран','Изоляция','Отмена людей',1],
    ['Рынок опирается на?','Спрос и предложение','Только приказ','Только сон',1],
    ['Разделение властей — на?','3 ветви','10 ветвей','0',1],
    ['Личность связана с?','Соц. качествами','Только ростом','Только паспортом без социума',1],
    ['Духовная сфера —?','Наука и искусство','Только заводы','Только налоги',1],
    ['Обязанность гражданина?','Соблюдать законы','Нарушать','Не учиться',1],
    ['Мобильность вертикальная?','Вверх/вниз по статусу','Только сон','Отмена статуса',1],
    ['Санкция в праве —?','Мера ответственности','Цвет бланка','Имя героя',1],
    ['There is экономика про?','Ресурсы и выбор','Только стихи','Только атомы',1],
    ['Гражданство —?','Связь с государством','Цвет глаз','Рост',1],
    ['Конфликт ролей —?','Столкновение требований','Гармония','Отмена ролей']
  ];
  bank[25]=['Экономика про?','Ресурсы и выбор','Только стихи','Только атомы',1];
  bank[27]=['Конфликт ролей —?','Столкновение требований','Гармония','Отмена ролей',1];
  const TOTAL=200; let track=null;
  for(let i=0;i<TOTAL;i++){
    if(i%10===0){const m=document.createElement('div');m.className='duo-module';m.innerHTML='<div><h2>МОДУЛЬ '+(Math.floor(i/10)+1)+'</h2></div>';container.appendChild(m);track=document.createElement('div');track.className='duo-track';container.appendChild(track);}
    const id='dn'+i;const off=['',' offset-left',' offset-right'][i%3];
    const wrap=document.createElement('div');wrap.className='duo-node-wrap'+off;
    const btn=document.createElement('button');btn.className='duo-node '+(i===0?'active':'locked');
    if(i>0)btn.dataset.unlock='dn'+(i-1);
    btn.textContent=['🧑','👥','💰','🏛️','⚖️','📚'][i%6];
    btn.onclick=function(){openDuoLesson(this,'panel-'+id)};
    const label=document.createElement('div');label.className='duo-label';label.textContent='Урок '+(i+1);
    const panel=document.createElement('div');panel.className='duo-lesson-panel';panel.id='panel-'+id;
    let quiz='';
    for(let k=0;k<10;k++){const it=bank[(i*3+k)%bank.length];quiz+='<div class="q-item" data-c="'+it[4]+'"><div class="q-text">'+it[0]+'</div><div class="opts"><button class="opt" data-v="1">'+it[1]+'</button><button class="opt" data-v="2">'+it[2]+'</button><button class="opt" data-v="3">'+it[3]+'</button></div><div class="fb"></div></div>';}
    panel.innerHTML='<h4>Урок '+(i+1)+'</h4><div class="quiz-box">'+quiz+'</div><button class="duo-start-btn" onclick="completeDuoNode(this,\''+id+'\',12)">Готово ✓</button>';
    wrap.appendChild(btn);wrap.appendChild(label);wrap.appendChild(panel);track.appendChild(wrap);
    track.appendChild(Object.assign(document.createElement('div'),{className:'duo-line'}));
  }
  const fw=document.createElement('div');fw.className='duo-node-wrap';
  const fb=document.createElement('button');fb.className='duo-node locked';fb.dataset.unlock='dn199';fb.textContent='🏆';
  fb.onclick=function(){openDuoLesson(this,'panel-dnfinal')};
  const fl=document.createElement('div');fl.className='duo-label';fl.textContent='Финал 50';
  const fp=document.createElement('div');fp.className='duo-lesson-panel';fp.id='panel-dnfinal';
  let fq='';for(let k=0;k<50;k++){const it=bank[k%bank.length];fq+='<div class="q-item" data-c="'+it[4]+'"><div class="q-text">'+(k+1)+'. '+it[0]+'</div><div class="opts"><button class="opt" data-v="1">'+it[1]+'</button><button class="opt" data-v="2">'+it[2]+'</button><button class="opt" data-v="3">'+it[3]+'</button></div><div class="fb"></div></div>';}
  fp.innerHTML='<h4>Итог — 50 вопросов</h4><div class="quiz-box">'+fq+'</div><button class="duo-start-btn" onclick="completeDuoNode(this,\'dnfinal\',100)">Готово ✓</button>';
  fw.appendChild(fb);fw.appendChild(fl);fw.appendChild(fp);container.appendChild(fw);
  document.querySelectorAll('.duo-node[data-unlock]').forEach(n=>{if(completed['duo-'+n.dataset.unlock]){n.classList.remove('locked');n.classList.add('active')}});
  bindQuizzes();
}
