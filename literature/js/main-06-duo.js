function generateDuo(){
  const container=document.getElementById('duoContainer');
  if(!container)return;
  const bank=[
    ['Эпос — род?','Да','Нет','Только рифма',1],['Метафора —?','перенос по сходству','только жанр','только размер',1],
    ['Автор Онегина?','Пушкин','Гоголь','Блок',1],['Ревизор — автор?','Гоголь','Пушкин','Есенин',1],
    ['Горе от ума —?','Грибоедов','Лермонтов','Толстой',1],['Печорин —?','Лермонтов','Пушкин','Гоголь',1],
    ['Тема — это?','о чём','только рифма','только год',1],['Идея —?','главная мысль','список героев','обложка',1],
    ['Эпитет —?','образное определение','только глагол','диалог',1],['Анафора — повтор?','в начале','только в конце','случайный',1],
    ['Кульминация —?','пик напряжения','титул','обложка',1],['Конфликт —?','столкновение','строфа','метр',1],
    ['Комедия — жанр?','драмы','былины','оды только',1],['Былина про?','богатырей','только Онегина','только Хлестакова',1],
    ['Пословица —?','законченная мысль','обрывок','роман',1],['Гипербола —?','преувеличение','преуменьшение','жанр',1],
    ['Лирика выражает?','чувства','отчёт','таблицу',1],['Драма для?','сцены','только учебника математики','только нот',1],
    ['Хлестаков —?','Ревизор','Онегин','Мцыри',1],['Мцыри — автор?','Лермонтов','Гоголь','Грибоедов',1],
    ['Тезис в ответе —?','прямой ответ','пересказ тома','список покупок',1],['Пример из текста?','нужен','запрещён','только из физики',1],
    ['ABAB — рифма?','перекрёстная','парная','кольцевая',1],['Олицетворение —?','одушевление','только рифма','только род',1],
    ['Фольклор —?','устное народное','только блог','формула',1],['Не пересказывать вместо?','анализа','чтения вопроса','примера'],
    ['Лирический герой = автор?','не всегда','всегда','никогда не связан',1],['Антитеза —?','противопоставление','повтор согласных','жанр',1]
  ];
  bank[25]=['Не пересказывать вместо?','анализа','чтения вопроса','примера',1];
  const TOTAL=200; let track=null;
  for(let i=0;i<TOTAL;i++){
    if(i%10===0){const m=document.createElement('div');m.className='duo-module';m.innerHTML='<div><h2>МОДУЛЬ '+(Math.floor(i/10)+1)+'</h2></div>';container.appendChild(m);track=document.createElement('div');track.className='duo-track';container.appendChild(track);}
    const id='dn'+i;const off=['',' offset-left',' offset-right'][i%3];
    const wrap=document.createElement('div');wrap.className='duo-node-wrap'+off;
    const btn=document.createElement('button');btn.className='duo-node '+(i===0?'active':'locked');
    if(i>0)btn.dataset.unlock='dn'+(i-1);
    btn.textContent=['📚','✨','📖','✍️','🎵','👤'][i%6];
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
  fp.innerHTML='<h4>Итог — 50</h4><div class="quiz-box">'+fq+'</div><button class="duo-start-btn" onclick="completeDuoNode(this,\'dnfinal\',100)">Готово ✓</button>';
  fw.appendChild(fb);fw.appendChild(fl);fw.appendChild(fp);container.appendChild(fw);
  document.querySelectorAll('.duo-node[data-unlock]').forEach(n=>{if(completed['duo-'+n.dataset.unlock]){n.classList.remove('locked');n.classList.add('active')}});
  bindQuizzes();
}
