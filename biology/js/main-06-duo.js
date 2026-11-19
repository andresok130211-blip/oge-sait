function generateDuo(){
  const container=document.getElementById('duoContainer');
  if(!container)return;
  const bank=[
    ['Ядро хранит?','ДНК','Хлорофилл','Желчь',1],['Фотосинтез в?','Хлоропластах','Митохондриях','Рибосомах',1],
    ['Энергия АТФ в?','Митохондриях','Ядре','Стенке',1],['Белок синтезируют?','Рибосомы','Вакуоли','Стенки',1],
    ['У животных нет?','Хлоропластов','Мембраны','Митохондрий',1],['Бактерии —?','Прокариоты','Эукариоты','Грибы',1],
    ['Крахмал у?','Растений','Животных','Вирусов',1],['Гликоген у?','Животных','Только дуба','Вирусов',1],
    ['Артерии несут кровь?','От сердца','К сердцу','Только в мозг',1],['O₂ в крови несут?','Эритроциты','Тромбоциты','Лейкоциты',1],
    ['Газообмен в?','Альвеолах','Трахее','Гортани',1],['Всасывание в?','Тонком кишечнике','Пищеводе','Рту',1],
    ['Пепсин в?','Желудке','Рту','Толстой кишке',1],['ЦНС —?','Головной и спинной мозг','Только кожа','Только глаза',1],
    ['Свёртывание?','Тромбоциты','Эритроциты','Альвеолы',1],['Малый круг — в?','Лёгкие','Печень','Почки',1],
    ['При фотосинтезе выделяется?','O₂','CO₂','N₂',1],['Вода по стеблю?','Ксилема','Флоэма','Кора',1],
    ['Продуценты?','Растения','Хищники','Паразиты',1],['Митоз для?','Роста','Гамет','Только вирусов',1],
    ['Мейоз даёт?','Гаметы','Клетки кожи','Бактерии',1],['23 пары хромосом у?','Человека','Бактерии','Вируса',1],
    ['Инсулин вырабатывает?','Поджелудочная','Печень','Селезёнка',1],['Желчь образуется в?','Печени','Желудке','Лёгких',1],
    ['Перья — класс?','Птицы','Рыбы','Земноводные',1],['Молоко — класс?','Млекопитающие','Птицы','Рыбы',1],
    ['Жабры у взрослых?','Рыбы','Птицы','Млекопитающие',1],['Редуценты?','Бактерии и грибы','Только тигры','Только дуб',1],
    ['Цинга — нехватка?','C','D','A',1],['Хитин в стенке?','Грибов','Растений','Животных клеток',1]
  ];
  const TOTAL=200;
  let track=null;
  for(let i=0;i<TOTAL;i++){
    if(i%10===0){
      const m=document.createElement('div');m.className='duo-module';m.innerHTML='<div><h2>МОДУЛЬ '+(Math.floor(i/10)+1)+'</h2></div>';container.appendChild(m);
      track=document.createElement('div');track.className='duo-track';container.appendChild(track);
    }
    const id='dn'+i;
    const off=['',' offset-left',' offset-right'][i%3];
    const wrap=document.createElement('div');wrap.className='duo-node-wrap'+off;
    const btn=document.createElement('button');
    btn.className='duo-node '+(i===0?'active':'locked');
    if(i>0)btn.dataset.unlock='dn'+(i-1);
    btn.textContent=['🦠','🫀','🌱','🌍','🧬','⭐'][i%6];
    btn.onclick=function(){openDuoLesson(this,'panel-'+id)};
    const label=document.createElement('div');label.className='duo-label';label.textContent='Урок '+(i+1);
    const panel=document.createElement('div');panel.className='duo-lesson-panel';panel.id='panel-'+id;
    let quiz='';
    for(let k=0;k<10;k++){
      const it=bank[(i*3+k)%bank.length];
      quiz+='<div class="q-item" data-c="'+it[4]+'"><div class="q-text">'+it[0]+'</div><div class="opts"><button class="opt" data-v="1">'+it[1]+'</button><button class="opt" data-v="2">'+it[2]+'</button><button class="opt" data-v="3">'+it[3]+'</button></div><div class="fb"></div></div>';
    }
    panel.innerHTML='<h4>Урок '+(i+1)+'</h4><div class="quiz-box">'+quiz+'</div><button class="duo-start-btn" onclick="completeDuoNode(this,\''+id+'\',12)">Готово ✓</button>';
    wrap.appendChild(btn);wrap.appendChild(label);wrap.appendChild(panel);track.appendChild(wrap);
    const line=document.createElement('div');line.className='duo-line';track.appendChild(line);
  }
  // final 50
  const fw=document.createElement('div');fw.className='duo-node-wrap';
  const fb=document.createElement('button');fb.className='duo-node locked';fb.dataset.unlock='dn199';fb.textContent='🏆';
  fb.onclick=function(){openDuoLesson(this,'panel-dnfinal')};
  const fl=document.createElement('div');fl.className='duo-label';fl.textContent='Финал 50';
  const fp=document.createElement('div');fp.className='duo-lesson-panel';fp.id='panel-dnfinal';
  let fq='';
  for(let k=0;k<50;k++){const it=bank[k%bank.length];fq+='<div class="q-item" data-c="'+it[4]+'"><div class="q-text">'+(k+1)+'. '+it[0]+'</div><div class="opts"><button class="opt" data-v="1">'+it[1]+'</button><button class="opt" data-v="2">'+it[2]+'</button><button class="opt" data-v="3">'+it[3]+'</button></div><div class="fb"></div></div>';}
  fp.innerHTML='<h4>Итоговый тест — 50 вопросов</h4><div class="quiz-box">'+fq+'</div><button class="duo-start-btn" onclick="completeDuoNode(this,\'dnfinal\',100)">Готово ✓</button>';
  fw.appendChild(fb);fw.appendChild(fl);fw.appendChild(fp);container.appendChild(fw);
  document.querySelectorAll('.duo-node[data-unlock]').forEach(n=>{if(completed['duo-'+n.dataset.unlock]){n.classList.remove('locked');n.classList.add('active')}});
  bindQuizzes();
}

