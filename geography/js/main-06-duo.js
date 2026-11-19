function generateDuo(){
  const container=document.getElementById('duoContainer');
  if(!container)return;
  const bank=[
    ['Масштаб 1:100 000 — в 1 см?','1 км','10 км','100 м',1],
    ['Крупнее масштаб у карты?','1:10 000','1:1 000 000','1:5 000 000',1],
    ['Экватор — широта?','0°','90°','45°',1],
    ['Гринвич — меридиан?','0°','180°','90°',1],
    ['Азимут юга?','180°','90°','0°',1],
    ['Азимут востока?','90°','180°','270°',1],
    ['Высшая точка РФ?','Эльбрус','Народная','Белуха',1],
    ['Урал — граница?','Европы и Азии','Африки и Азии','Только леса',1],
    ['Равнина Урал–Енисей?','Западно-Сибирская','Прикаспийская','Валдай',1],
    ['Самая большая зона?','Тайга','Степь','Пустыня',1],
    ['Чернозём в?','Степи','Тундре','Арктике',1],
    ['Основной климат РФ?','Умеренный','Тропический','Экваториальный',1],
    ['Субтропики РФ?','Черноморское побережье','Якутия','Чукотка',1],
    ['Нефть/газ — район?','Западная Сибирь','Только Крым','Карелия',1],
    ['Кузбасс — это?','Уголь','Чай','Хлопок',1],
    ['Крупнейший город?','Москва','Магадан','Анадырь',1],
    ['Где плотность выше?','Европейская часть','Вся тундра равномерно','Только острова',1],
    ['Байкал — озеро?','Самое глубокое','Самое мелкое','Солёное как океан',1],
    ['Волга впадает в?','Каспий','Балтику','Тихий океан',1],
    ['Мурманск — порт?','Незамерзающий','Только речной юг','Только озёрный',1],
    ['Владивосток у?','Тихого океана','Каспия','Балтики',1],
    ['Оймякон известен?','Холодом','Жарой экватора','Влажностью Амазонки',1],
    ['Муссоны у?','Дальнего Востока','Калининграда только','Пустыни Прикаспия',1],
    ['КМА — руда?','Железная','Нефть','Уран только',1],
    ['Горизонтали показывают?','Высоту','Население','Температуру',1],
    ['Север на карте?','Вверху','Внизу','Слева всегда',1],
    ['Тихий океан —?','Самый большой','Самый маленький','Пресноводный',1],
    ['Эверест —?','Высшая точка суши','Глубина океана','Город РФ',1],
    ['Сахара —?','Пустыня','Озеро','Гора',1],
    ['Тайга — лес?','Хвойный','Только дубовый','Только пальмы',1],
    ['Тундра —?','Ягель, олени','Пальмы','Лианы',1],
    ['Кавказ — горы?','Высокие молодые','Только холмы Валдая','Ниже уровня моря',1],
    ['ЯНАО —?','Газ','Чай','Хлопок',1],
    ['ХМАО —?','Нефть','Виноград','Какао',1],
    ['Ладога —?','Крупное озеро','Вулкан','Пустыня',1],
    ['Амур — бассейн?','Тихого океана','Каспия','Балтики',1],
    ['Дон впадает в?','Азовское море','Байкал','Балтику',1],
    ['Прикаспий —?','Низменность','Высочайшие горы','Только тайга',1],
    ['Белуха на?','Алтае','Кавказе','Урале',1],
    ['Ключевская —?','Вулкан Камчатки','Река','Озеро',1],
    ['Широта растёт к?','Полюсам','Гринвичу','Только западу',1],
    ['Долгота от?','Гринвича','Экватора','Полюса',1],
    ['Изотерма —?','Равная температура','Равная высота','Равное население',1],
    ['Плотность —?','чел/км²','км/ч','°C',1],
    ['Степь — хозяйство?','Зерно','Оленеводство только','Пальмы',1],
    ['Оленеводство — зона?','Тундра','Субтропики','Пустыня Сахара',1],
    ['Новороссийск — море?','Чёрное','Балтийское','Японское',1],
    ['СПб — море?','Балтийское','Каспий','Охотское',1],
    ['Резко континентальный —?','Восточная Сибирь','Сочи','Калининград',1],
    ['Арктика — пояс?','Холодный север','Тропики','Экватор',1],
    ['Камчатка известна?','Вулканами','Только степью','Только пустыней',1],
    ['Саяны — горы в?','Южной Сибири','Калининграде','Крыму только',1],
    ['Енисей течёт в?','Северный Ледовитый','Каспий','Чёрное море',1],
    ['Обь течёт в?','Северный Ледовитый','Балтику','Азов',1],
    ['Лена течёт в?','Море Лаптевых','Каспий','Чёрное',1],
    ['Каспий — это?','Бессточное озеро','Река','Часть Атлантики',1],
    ['Балтика омывает?','СПб и Калининград','Владивосток','Мурманск только',1],
    ['Японское море у?','Дальнего Востока','Кавказа','Кольского',1],
    ['Чернозём богат?','Гумусом','Только песком','Только льдом',1],
    ['Мерзлота типична для?','Тундры и севера','Субтропиков Сочи','Пустынь Африки',1]
  ];
  const TOTAL=200;
  let track=null;
  for(let i=0;i<TOTAL;i++){
    if(i%10===0){
      const m=document.createElement('div');
      m.className='duo-module';
      m.innerHTML='<div><h2>МОДУЛЬ '+(Math.floor(i/10)+1)+'</h2></div>';
      container.appendChild(m);
      track=document.createElement('div');
      track.className='duo-track';
      container.appendChild(track);
    }
    const id='dn'+i;
    const off=['',' offset-left',' offset-right'][i%3];
    const wrap=document.createElement('div');
    wrap.className='duo-node-wrap'+off;
    const btn=document.createElement('button');
    btn.className='duo-node '+(i===0?'active':'locked');
    if(i>0) btn.dataset.unlock='dn'+(i-1);
    btn.textContent=['🗺️','⛰️','🌡️','🌲','🏙️','💧','🧭','⭐'][i%8];
    btn.onclick=function(){openDuoLesson(this,'panel-'+id)};
    const label=document.createElement('div');
    label.className='duo-label';
    label.textContent='Урок '+(i+1);
    const panel=document.createElement('div');
    panel.className='duo-lesson-panel';
    panel.id='panel-'+id;
    let quiz='';
    for(let k=0;k<10;k++){
      const it=bank[(i*5+k)%bank.length];
      quiz+='<div class="q-item" data-c="'+it[4]+'"><div class="q-text">'+it[0]+'</div><div class="opts"><button class="opt" data-v="1">'+it[1]+'</button><button class="opt" data-v="2">'+it[2]+'</button><button class="opt" data-v="3">'+it[3]+'</button></div><div class="fb"></div></div>';
    }
    panel.innerHTML='<h4>Урок '+(i+1)+'</h4><div class="quiz-box">'+quiz+'</div><button class="duo-start-btn" onclick="completeDuoNode(this,\''+id+'\',12)">Готово ✓</button>';
    wrap.appendChild(btn);wrap.appendChild(label);wrap.appendChild(panel);
    track.appendChild(wrap);
    const line=document.createElement('div');line.className='duo-line';track.appendChild(line);
  }
  
  // Финальный урок — 50 вопросов по всем темам
  const finalWrap=document.createElement('div');
  finalWrap.className='duo-node-wrap';
  const finalBtn=document.createElement('button');
  finalBtn.className='duo-node locked';
  finalBtn.dataset.unlock='dn199';
  finalBtn.textContent='🏆';
  finalBtn.onclick=function(){openDuoLesson(this,'panel-dnfinal')};
  const finalLabel=document.createElement('div');
  finalLabel.className='duo-label';
  finalLabel.textContent='Финал 50';
  const finalPanel=document.createElement('div');
  finalPanel.className='duo-lesson-panel';
  finalPanel.id='panel-dnfinal';
  let fq='';
  for(let k=0;k<50;k++){
    const it=bank[k%bank.length];
    fq+='<div class="q-item" data-c="'+it[4]+'"><div class="q-text">'+(k+1)+'. '+it[0]+'</div><div class="opts"><button class="opt" data-v="1">'+it[1]+'</button><button class="opt" data-v="2">'+it[2]+'</button><button class="opt" data-v="3">'+it[3]+'</button></div><div class="fb"></div></div>';
  }
  finalPanel.innerHTML='<h4>Итоговый тест — 50 вопросов</h4><div class="quiz-box">'+fq+'</div><button class="duo-start-btn" onclick="completeDuoNode(this,\'dnfinal\',100)">Готово ✓</button>';
  finalWrap.appendChild(finalBtn);finalWrap.appendChild(finalLabel);finalWrap.appendChild(finalPanel);
  container.appendChild(finalWrap);
const mas=document.createElement('div');mas.className='duo-mascot';mas.textContent='🌍';container.appendChild(mas);
  document.querySelectorAll('.duo-node[data-unlock]').forEach(n=>{
    if(completed['duo-'+n.dataset.unlock]){n.classList.remove('locked');n.classList.add('active')}
  });
  bindQuizzes();
}

